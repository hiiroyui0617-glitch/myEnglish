# English Quest: 個人用ローカルAIサーバー

## 目的
Writing / Speaking の会話AIを、従量課金APIなしでWindows PC上に構築します。
iPhoneではTailscale Serveを通じて接続します。PCが停止中でもEnglish Questの教材モードと従来の練習は使用できます。

## 必要なもの
- Windows PC / Python 3.10以降（推奨3.11）
- Ollama（https://ollama.com/ からインストール）
- Tailscale（PC・iPhoneに同じアカウントでインストール）
- 初回インストール・モデル取得時のインターネット接続

## セットアップ
1. このフォルダの \`run_windows.ps1\` をPowerShellから実行します。
   \`\`\`powershell
   cd local_ai
   powershell -ExecutionPolicy Bypass -File .\run_windows.ps1
   \`\`\`
2. 初回はPythonの依存関係とOllamaの \`qwen3:4b\`（約2.5GB）がダウンロードされます。
3. コンソールに表示された **アクセス用トークン** は個人情報として扱い、GitHubにアップロードしないでください。
4. 別のPowerShellで \`tailscale serve 8765\` を実行します。Tailscaleの案内に従ってHTTPSを有効にします。
5. 表示された \`https://<PC名>.<tailnet名>.ts.net\` のURLを、English Questの Speaking / Writing → 設定 → PC接続先URLへ入力し、手順3のトークンを入力して「接続設定を保存・確認」を押してください。

接続が成功したら「会話方式」を「PCのローカルAI」または「自動」にします。
音声認識の初回実行時はWhisper tiny.enをダウンロードします。

## 注意事項
- **Tailscale Funnelを使わないこと。** 8765番ポートを一般インターネットに公開しないでください。
- サーバーは \`127.0.0.1:8765\` にのみバインドし、Tailscale ServeでHTTPS中継します。
- アクセストークンはブラウザのセッション内に保存されるため、再起動時は入力し直す場合があります。
- PC版の音声入力は「録音→文字起こし→文章を確認→送信」です。ChatGPT Voiceのような同時双方向会話ではありません。
- PCの応答が遅い場合、Whisper（CPU）やOllama（GPU）のモデルを小さくする必要があります。
- 無料のローカル処理はAPIの回数制限を受けませんが、電気代・通信費、ハードウェア性能の制約があります。
- 発話録音はPCへ明示的に送られた場合だけ処理し、サーバーは音声ファイルを保存しません。
- モデルの利用ライセンスは各配布元に従います。

## 動作確認
PC上で開く \`http://127.0.0.1:8765/health\` は認証が必要です。通常のブラウザだけでは401になります（仕様）。
English QuestのPC接続設定に、HTTPS URLとトークンを設定して接続テストしてください。

## ロールバック
GitHubのバックアップブランチ \`backup-before-speaking-writing-20261115\` から改修前の \`main\` に戻せます。
Speaking / Writing の保存先は独立して \`english-quest-studio-v1\` であり、既存の学習履歴 \`toeic-quest-v1-local\` は変更しません。
