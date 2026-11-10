---
created: 2026-08-31
updated: 2026-08-31
type: evergreen
category: article
tags:
  - reference
  - tech/obsidian
  - tech/ai
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> websiteのデータをObsidianのNoteとして取り込むブラウザ拡張機能に関する設定、利用方法を確認します。

## 🧩 詳細

Chrome用のブラウザ拡張として`Obsidian Web Clipper`が提供されています。他の拡張機能と同様にChromeウェブストアから検索しインストールするとブラウザ上の拡張機能ボタンが表示されて、現在見ているサイトの取り込みができます。

生成AIのAPIを利用して、取り込み時にtag提案や本文の要約を行うことも可能。tag提案の設定を実施しました。

tagの提案には1分半～2分程度掛かります。生成AIの処理中に別タブへフォーカスを移動すると推論がキャンセルされるため、処理完了まで待つ必要がある点に注意。また取り込み前にLM Studio Bionicを起動しておく必要がありました。同時実行（`Max Concurrent Predictions`）を1に設定しているので、Bionicで問い合わせをしている最中はwebsite取り込み不可となります。

## 🛠️ LM Studio Bionicの設定

- `Local Model API` > `Local API server`: `ON`に設定。

CORSの設定については`ON`にする必要があるという解説もありましたが、試してみたところ`OFF`でもエラーになりませんでした。外部APIを利用する場合には設定が必要と思われます。

## 🛠️ ブラウザ拡張の設定

設定変更したものについて解説します。

### 一般設定

- `保管庫`: Vault名を指定します。`Notebook`を設定。

### インタープリター

- `インタープリターを有効化`: `ON`に設定。
- `自動実行`: `ON`に設定。
- `プロバイダーを追加`: 以下のように設定してLM Studio Local Serverを追加。
	- `プロバイダー`: `カスタム`を選択。
	- `プロバイダー名`: `LM Studio Local Server`を入力。
	- `ベースURL`: `http://localhost:1234/v1/chat/completions`を入力。
	- `APIキー`: `lmstudio`と入力（空欄でなければなんでも良いらしい）。
- `モデル`: 以下のように設定。
	- `プロバイダー`: `LM Studio Local Server`を選択。
	- `モデル名`: `Gemma 4 26B A4B QAT`を入力。
	- `モデルID`: `Gemma 4 26B A4B QAT`を入力。
- `詳細設定` > `デフォルトインタープリターコンテキスト`: `{{context}}`を設定。

### テンプレート

デフォルトテンプレートを編集。
- `場所` > `ノートの場所`: `22_WebClips`。
- `コンテンツ` > `プロパティ`: 以下のように設定を変更。
	- title: {{title}} （変更なし）
	- source: {{url}}（変更なし）
	- author: {{author|split:", "|wikilink|join}}（変更なし）
	- published: {{published}}（変更なし）
	- created: {{date}}（変更なし）
	- description: {{description}}（変更なし）
	- `type`: `snapshot`
	- `category`: `webclips`
	- `tags`: `{{"検索に利用できそうなタグ情報を4-6ワード抽出,小文字,スペース禁止"}}`


## 🔗 参考資料

- [【保存版】Obsidian Web Clipperの使い方｜「後で読む」を卒業しWeb記事を知識に変える技術](https://www.goodsystem.jp/ai/obsidian-web-clipper-guide.html)
- [Obsidian Web Clipper × AI でWebページを自動要約＆ストックしてみた](https://dev.classmethod.jp/articles/try-obsidian-web-clipper-ai-summary/)
- [Obsidian Web ClipperでOllamaを使ってローカルLLMで記事を要約する方法](https://dev.classmethod.jp/articles/obsidian-web-clipper-ollama-local-llm/)
