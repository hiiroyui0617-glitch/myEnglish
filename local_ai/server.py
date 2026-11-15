"""English Quest personal local AI server (free/self-hosted).
Run only on loopback and reach it through Tailscale Serve HTTPS.
Do not expose this endpoint to the open internet.
"""
from __future__ import annotations

import hmac
import json
import os
import urllib.error
import urllib.request
from typing import Literal

from fastapi import FastAPI, File, Header, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

MODEL = os.getenv("ENGLISH_QUEST_MODEL", "qwen3:4b-instruct")
TOKEN = os.getenv("ENGLISH_QUEST_TOKEN", "")
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434")
MAX_AUDIO_BYTES = 12 * 1024 * 1024
ORIGINS = [
    "https://hiiroyui0617-glitch.github.io",
    "http://127.0.0.1:8000",
    "http://localhost:8000",
]
app = FastAPI(title="English Quest Personal AI", docs_url=None, redoc_url=None)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)
_whisper = None


def authorize(auth: str | None) -> None:
    if not TOKEN or len(TOKEN) < 24:
        raise HTTPException(503, "Set ENGLISH_QUEST_TOKEN to a random value of at least 24 characters.")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(401, "Authentication is required.")
    if not hmac.compare_digest(auth[7:], TOKEN):
        raise HTTPException(401, "Authentication failed.")


class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str = Field(max_length=3000)


class ChatRequest(BaseModel):
    mode: Literal["speaking", "writing"]
    topic: str = Field(max_length=180)
    messages: list[ChatMessage] = Field(min_length=1, max_length=16)


@app.get("/health")
def health(authorization: str | None = Header(default=None)):
    authorize(authorization)
    return {"ok": True, "model": MODEL, "transcribe": "whisper-tiny.en"}


@app.post("/chat")
def chat(payload: ChatRequest, authorization: str | None = Header(default=None)):
    authorize(authorization)
    # Frontend never gets to override the server's tutor safety and pedagogy rules.
    system = (
        "You are an English conversation tutor. The student is a Japanese learner. "
        "Use natural, encouraging English, preferably CEFR A2-B1 unless prompted otherwise. "
        "Respond to what the student actually said, in 1-3 short sentences; end with one relevant "
        "follow-up question that does not repeat an earlier one. Never copy a textbook. "
        "When a learner makes an error, offer a brief specific correction in Japanese. "
        'Return ONLY a JSON object with two keys: "reply" (English) and "feedback_ja" '
        "(brief Japanese correction, or empty string when none). "
        "Do not fabricate errors or mark stylistic preferences as grammar errors."
    )
    requested = payload.messages[-12:]
    messages = [{"role": "system", "content": system + " Topic: " + payload.topic}]
    for item in requested:
        # Do not let a user-provided system prompt override the tutor instruction.
        if item.role == "system":
            continue
        messages.append({"role": item.role, "content": item.content[:1600]})
    if not any(m["role"] == "user" for m in messages):
        raise HTTPException(400, "A student response is required.")
    body = {
        "model": MODEL,
        "stream": False,
        "format": "json",
        "messages": messages,
        "options": {"temperature": 0.65, "num_predict": 190, "num_ctx": 2048},
        "think": False,
    }
    req = urllib.request.Request(
        OLLAMA_URL.rstrip("/") + "/api/chat",
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=90) as response:
            answer = json.load(response)
    except (urllib.error.URLError, TimeoutError) as exc:
        raise HTTPException(503, f"Local Ollama unavailable: {type(exc).__name__}") from exc
    except Exception as exc:
        raise HTTPException(502, "Invalid Ollama response") from exc
    text = answer.get("message", {}).get("content", "")
    try:
        data = json.loads(text)
    except (ValueError, TypeError):
        data = {"reply": text, "feedback_ja": ""}
    if not isinstance(data, dict):
        raise HTTPException(502, "Local model returned an invalid format.")
    reply = str(data.get("reply", "")).strip()[:1600]
    if not reply:
        raise HTTPException(502, "Local model returned an empty reply.")
    return {"reply": reply, "feedback_ja": str(data.get("feedback_ja", ""))[:500]}


@app.post("/transcribe")
async def transcribe(audio: UploadFile = File(...), authorization: str | None = Header(default=None)):
    global _whisper
    authorize(authorization)
    if audio.content_type not in (
        "audio/mp4", "audio/m4a", "audio/x-m4a", "audio/webm", "audio/ogg",
        "video/mp4", "application/octet-stream",
    ):
        raise HTTPException(415, "Unsupported recording type.")
    data = await audio.read(MAX_AUDIO_BYTES + 1)
    if len(data) > MAX_AUDIO_BYTES:
        raise HTTPException(413, "Audio is too large (maximum 12 MB).")
    if not data:
        raise HTTPException(400, "Audio recording is empty.")
    try:
        from faster_whisper import WhisperModel
        import av
        import io
        import numpy as np
    except ImportError as exc:
        raise HTTPException(503, "Install faster-whisper, av and numpy first.") from exc
    if _whisper is None:
        _whisper = WhisperModel("tiny.en", device="cpu", compute_type="int8")
    # PyAV decodes the iPhone's m4a/MP4 and Chromium's WebM without a system ffmpeg executable.
    try:
        chunks = []
        with av.open(io.BytesIO(data), mode="r") as container:
            audio_stream = next(s for s in container.streams if s.type == "audio")
            resampler = av.audio.resampler.AudioResampler(format="s16", layout="mono", rate=16000)
            for frame in container.decode(audio_stream):
                converted = resampler.resample(frame)
                if not isinstance(converted, list):
                    converted = [converted]
                for item in converted:
                    chunks.append(item.to_ndarray().reshape(-1))
        if not chunks:
            raise ValueError("No audio data")
        pcm = np.concatenate(chunks).astype(np.float32) / 32768.0
        if len(pcm) > 16000 * 90:
            raise HTTPException(413, "Please limit recordings to 90 seconds.")
        segments, _ = _whisper.transcribe(pcm, language="en", beam_size=2, vad_filter=True)
        text = " ".join(segment.text.strip() for segment in segments).strip()
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(422, "Could not decode or transcribe this recording.") from exc
    return {"text": text[:3000]}
