# English Quest

独立制作の非公式英語学習Webアプリです。リーディング・リスニング・語彙・熟語・小テストに対応しています。

## 商標・独立性について

TOEIC® Listening & Reading Test はETSの登録商標です。本アプリはETSおよびIIBCとは無関係で、両団体による承認・後援・提携を受けていません。

TOEIC® Listening & Reading Test is a registered trademark of ETS. This product is not endorsed or approved by ETS.

このアプリは公式試験問題・公式写真・公式音声や市販問題集の例文の転載を目的として制作していません。独自に作成した問題・説明文・画像を用いていますが、第三者著作物との全面的な照合や法的な無侵害保証を行ったものではありません。

## スコア表示

予測点は独自の学習指標であり、公式スコアや本番試験の結果を保証しません。

## iPhone ホーム画面への追加

Safariで https://hiiroyui0617-glitch.github.io/myEnglish/ を開き、「共有」→「ホーム画面に追加」を選択してください。既存の追加済みアイコンを削除すると端末内の学習記録が失われる可能性があるため、ご注意ください。


## Speaking Quest / Writing Quest（v12追加）
- **iPhone単独（無料）**：20種類の英語テーマから、教材会話形式で質問に答えて練習できます。端末の読み上げ機能、録音・聞き直しも使えます。教材モードの応答はAIによる自由生成ではありません。
- **端末内AI（試験運用）**：設定からWebLLMの0.5Bモデルをダウンロード・起動できます。WebGPUと端末メモリが必要で、iPhone 13では動作を保証しません。失敗しても教材モードに戻ります。
- **PC連携（無料）**：Ollamaで自由会話、Whisperで音声認識。Tailscale ServeのHTTPS URLと個人用トークンを使います。詳細は [local_ai/README.md](local_ai/README.md) を参照してください。
- Writingはテーマに数文で答え、追加質問と必要に応じた簡易表記チェックができます。詳しい添削にはPC連携が必要です。
- SpeakingのiPhone単独版は録音→再生→文章入力方式です。PC連携なら録音→自動文字起こし→確認→送信を利用できます。途切れないリアルタイム双方向音声会話ではありません。
- Speaking/Writingの履歴は `english-quest-studio-v1` に保存され、既存の学習履歴 `toeic-quest-v1-local` や非公式L&R予測点を変更しません。
- 今回の改修前のコードはブランチ [backup-before-speaking-writing-20261115](../../tree/backup-before-speaking-writing-20261115) に保存されています。

### 動作確認
1. Reading・Listening・語彙・小テストが従来どおり開始できることを確認します。
2. Writing→英文入力→「送信」、Speaking→質問の読み上げ・録音を確認します。
3. PC連携を使用する場合はPC側サーバーを起動し、Tailscaleの接続設定を行います。
4. iPhoneのホーム画面アプリは一度終了して再起動してください。学習記録を失う可能性があるため、ホーム画面アイコンの削除やアプリデータの消去は不要です。
