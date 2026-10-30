---
created: 2025-08-30
updated: 2026-10-30
type: evergreen
category: governance
tags:
  - rule
  - tech/obsidian
publish: "true"
---
# 📌 定義
> [!NOTE] Definition
> 本Vaultにおけるファイル名やNote記法など、Noteの作成に関するルールを定義する。

## 📌 1. ファイル名

- テンプレートファイルには、ファイル名の先頭に`📋`を付ける。
- Hub Noteには、ファイル名の先頭に`🗺️`を付ける。
- Troubleshooting Noteには、ファイル名の先頭に`🛠️`を付ける。

## 📌 2. Frontmatter

Frontmatterに定義するプロパティは以下とする。

- created (optional): Noteの作成日を設定する。
- updated (optional): Noteを更新した日付を設定する。Note編集時に随時更新する。[[📋insert updated date on frontmatter|Templaterのテンプレート]] 作成済み。
- type (mandatory): `evergreen` または `snapshot`。詳細は [[Note分類ルール]] を参照。
- category (mandatory): `atomic`, `journal`, `todo` など。詳細は [[Note分類ルール]] を参照。
- tags (mandatory): `rule`, `idea`, `term` など。詳細は [[Note分類ルール]] を参照。

### type、category、tagsのルール

- アルファベット小文字を使用する。
- 空白は使用しない。空白の代わりに`-`を使用する。

## 📌 3. Note本文

### 見出しのルール

- 見出しはLevel4（H1～H4）までとし、あまり階層が深くならないようにする。階層が深くなる場合はNoteの分割を検討する。
- 見出し（H1～H4）の次行がcallout以外の場合は必ず改行する。
	- 22_WebClipsのデータは外部サイトからのデータであるためルール対象外とする。
-  **アイコンの使用**: 見出しH1とH2には、内容に応じて以下のアイコンを付与する：
	- `🎯`: 目標
	- `📌`: 定義
	- `🗺️`: Hub
	- `📈`: 進捗 / マイルストーン
	- `💡`: 着想 / 気付き / 振り返り
	- `🔍`: 概要
	- `🧩`: 詳細
	- `💎`: 要点
	- `📝`: 記録
	- `🚀`: Todo / タスク
	- `🛠️`: 設定
	- `❓`: 問題
	- `✅`: 解決策
	- `🎨`: テーマ / パレット
	- `🔗`: 参考資料 / 関連リンク

### リストのルール

- サブリストには空白2個ではなく tab1個を使用する。

### 括弧のルール

- 丸括弧`（）`は日本語の文章では**全角**を、英語などの半角文字で表現する文章では**半角**を使用する。

## 📌 4. その他

- テンプレート化可能なものは、随時`02_Assets/Templates/Templater`フォルダ以下にテンプレートを作成し、フォーマットの統一を図る。
- mindmap pluginを利用するNoteには `mindmap` タグを設定する。

## 🔗 関連リンク

- [[フォルダ構成]]
- [[Note分類ルール]]
- [[Obsidianで利用しているプラグイン]]