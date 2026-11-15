# English Quest local AI: run from PowerShell on your Windows PC.
# Requires Python 3.10+ and installed Ollama (https://ollama.com/).
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
if (-not (Get-Command ollama -ErrorAction SilentlyContinue)) {
  Write-Host "Please install Ollama from https://ollama.com/ first." -ForegroundColor Yellow
  exit 1
}
if (-not (Test-Path ".venv")) { py -3 -m venv .venv }
& ".venv\Scripts\python.exe" -m pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) { exit 1 }
if (-not (Test-Path "token.txt")) {
  $bytes = New-Object byte[] 36
  $rng = [Security.Cryptography.RandomNumberGenerator]::Create()
  $rng.GetBytes($bytes)
  $rng.Dispose()
  [Convert]::ToBase64String($bytes) | Set-Content -Encoding Ascii "token.txt"
}
$env:ENGLISH_QUEST_TOKEN = (Get-Content "token.txt" -Raw).Trim()
$env:ENGLISH_QUEST_MODEL = "qwen3:4b"
Write-Host "Checking Ollama model. Download occurs only on first use."
& ollama pull $env:ENGLISH_QUEST_MODEL
if ($LASTEXITCODE -ne 0) { exit 1 }
Write-Host ""
Write-Host "Personal access token (paste into iPhone connection settings):" -ForegroundColor Cyan
Write-Host $env:ENGLISH_QUEST_TOKEN
Write-Host ""
Write-Host "Start Tailscale Serve in another PowerShell window: tailscale serve 8765" -ForegroundColor Cyan
Write-Host "Do not use Tailscale Funnel. Do not port-forward 8765." -ForegroundColor Yellow
& ".venv\Scripts\python.exe" -m uvicorn server:app --host 127.0.0.1 --port 8765
