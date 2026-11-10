---
created: 2025-05-06
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
> 本VaultにおけるNoteの更新方針（Type）と役割（Category）を定義します。

## 📌 1. NoteのType（更新方針）

[Mutable note](https://minerva.mamansoft.net/Notes/Mutable+note) と [Immutable note](https://minerva.mamansoft.net/Notes/Immutable+note) の考え方を参考に、以下の2つに区分します。

- **Evergreen（随時更新・最新正本型）**
	- 常に最新化された情報のみを「正」として扱うNote
	- 用語定義や着想など、継続的にブラッシュアップが必要なもの
- **Snapshot（時点記録・履歴保持型）**
	- 作成時点の状態や思考のプロセスを記録として残すNote
	- 日記や活動記録、問題解決のログなど

## 📌 2. NoteのCategory（役割）

情報の性質に応じて以下のカテゴリに分類します。

### A. 運用規定（Governance）

Vaultの運用ルール、テンプレート、管理用の設定ファイルを扱うカテゴリ。

- **Governance** (`Evergreen`): ルール、ガイドライン、テンプレート等。

### B. 行動管理（Action）

個人の活動、計画、および日々の記録を扱うカテゴリ。

- **Journal** (`Snapshot`)
	- 日々の記録。外部には公開しません。
- **ToDo** (`Snapshot`)
	- タスク・進捗管理。技術系のNoteにはfrontmatterに`public: true`を付けて外部に公開します。
- **Objective** (`Snapshot`)
	- 目標・マイルストーン。外部には公開しません。

### C. 知識・思考 （Knowledge）

蓄積された知見、思考のプロセス、およびそれらを繋ぐ構造を扱うカテゴリです。
- **Atomic Note** (`Evergreen`)
	- 最小単位の知識（用語定義 `term`, 着想 `idea`）。
	- 技術系のNoteにはfrontmatterに`public: true`を付けて外部に公開します。
- **Article Note** (`Snapshot`/`Evergreen`)
	- まとまった記述・記録（活動記録 `activity`, 振り返り `review`, 問題解決 `troubleshooting`など）。
	- 技術系のNoteにはfrontmatterに`public: true`を付けて外部に公開します。
- **Hub Note** (`Evergreen`)
	- 目次（MOC）やインデックス。
	- 技術系のNoteにはfrontmatterに`public: true`を付けて外部に公開します。
- **Web Clips** (`Snapshot`)
	- 外部のwebsiteから抽出したデータ。
	- データの取り込みにはObsidian Web Clipper（ブラウザ拡張）を利用
	- 知見は、適宜`Atomic Note`や`Article Note`へ昇華させ、`Snapshot`から`Evergreen`へと移行します。
	- 外部には公開しません。

## 🧩 3. 分類マトリックス

| 役割    | Type      | Category   | Tag               | 説明              |
| :---- | :-------- | :--------- | :---------------- | :-------------- |
| 運用規定  | evergreen | governance | `rule`            | 運用規定・管理ルール      |
| 行動管理  | snapshot  | journal    | `journal`         | 日々の記録           |
| 行動管理  | evergreen | todo       | `todo`            | タスク・進捗管理        |
| 行動管理  | snapshot  | objective  | `objective`       | 目標・マイルストーン      |
| 知識・思考 | evergreen | atomic     | `term`            | 用語定義            |
| 知識・思考 | evergreen | atomic     | `idea`            | 着想・思考メモ         |
| 知識・思考 | snapshot  | article    | `activity`        | 活動記録            |
| 知識・思考 | evergreen | article    | `article`         | 自分の言葉による知識まとめ   |
| 知識・思考 | evergreen | article    | `reference`       | 外部リファレンス・マニュアル  |
| 知識・思考 | snapshot  | article    | `review`          | 振り返り            |
| 知識・思考 | snapshot  | article    | `troubleshooting` | 問題解決            |
| 知識・思考 | evergreen | hub        | `hub`             | 目次・インデックス (Hub) |
| 知識・思考 | snapshot  | webclips   | `webclips`        | 外部サイトのデータ       |

## 🧩 4. 補足

Noteに付与するdomain tagは、マトリックスのTag列に定義済みのbase tagに追加して使用可とします。
**domain tagの例**: `book`, `life`, `manga`, `movie`, `marvel`, `tech/ai/agent/hermes_agent`

## 🔗 関連リンク

- [[フォルダ構成]]
