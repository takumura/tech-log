---
created: 2026-09-06
updated: 2026-10-11
type: evergreen
category: article
tags:
  - reference
  - tech/obsidian
  - tech/ai/mcp
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> Obsidian-MCP（Semantic Notes Vault MCP）で利用可能なツール群を確認します。

## 🧩 詳細

### 1. `vault` (File Management)

ファイル操作に関する基盤ツール13個。一部のパラメータ名が直感的でないため注意が必要。

| ツール名                     | 説明              | Request Parameters (Value Example)                            | ステータス       | エラー理由 / 回避策                                                         |
| ------------------------ | --------------- | ------------------------------------------------------------- | ----------- | ------------------------------------------------------------------- |
| `vault.list`             | ディレクトリ一覧取得      | `directory: "20_Notes/Test_Folder"`                           | ✅ Success   | -                                                                   |
| `vault.read`             | ファイル内容の読み取り     | `path: "20_Notes/Test_Folder/file.md"`                        | ✅ Success   | -                                                                   |
| `vault.create`           | 新規ファイルの作成       | `content: "# Title", path: ".../new.md"`                      | ✅ Success   | -                                                                   |
| `vault.update`           | 内容の上書き更新        | `content: "New text", path: ".../file.md"`                    | ✅ Success   | -                                                                   |
| `vault.delete`<br>（無効化済） | ファイルの削除         | `path: "20_Notes/Test_Folder/old.md"`                         | ✅ Success   | -                                                                   |
| `vault.search`           | 高度なテキスト検索       | `query: "target text", mode: "plain"`                         | ✅ Success   | -                                                                   |
| `vault.copy`             | ファイルの複製         | `path: ".../src.md", destination: ".../dest.md"`              | ✅ Success   | -                                                                   |
| `vault.move`             | ファイルの移動・改名      | `path: ".../src.md", destination: ".../dest.md"`              | ✅ Success   | -                                                                   |
| `vault.combine`          | ファイル結合 （Inline） | `paths: ["file1.md", "file2.md"]`                             | ✅ Success   | -                                                                   |
| `vault.concatenate`      | 追記による連結         | `mode: "append", path1: ".../target.md", path2: ".../src.md"` | ✅ Success*  | *`path1`, `path2` を使用すること。                                          |
| `vault.rename`           | ファイル名の変更        | `path: ".../file.md", newName: "new_name.md"`                 | ❌ **Error** | **致命的な不一致**: エージェント側から `new_name` と送ると失敗するため、`copy` + `delete` を使用。 |
| `vault.split`            | ファイルの分割         | `path: ".../file.md", splitBy: "structure"`                   | ❌ **Error** | `splitBy` の値が enum （auto, structure等）に厳密に依存。                        |

### 2. `edit` (Content Editing)

テキストの内容を精密に編集するためのツール5個。

| ツール名                     | 説明         | Request Parameters (Value Example)                          | ステータス          | エラー理由 / 回避策                 |
| ------------------------ | ---------- | ----------------------------------------------------------- | -------------- | --------------------------- |
| `edit.append`            | 末尾へのテキスト追記 | `path: ".../file.md", content: "\n# Added"`                 | ✅ Success      | -                           |
| `edit.patch`             | 構造的な部分置換   | `path: ".../file.md", target: "# Header", newText: "# New"` | ✅ Success      | 見出し等の構造をターゲットにします。          |
| `edit.window`            | ファイル全体の上書き | `path: ".../file.md", content: "Full Text..."`              | ⚠️ **Partial** | `path` の指定が必須。ファイル全体の置換に使用。 |
| `edit.at_line`<br>（無効化済） | 指定行への編集    | `path: ".../file.md", lineNumber: 5, mode: "replace"`       | ❌ **Error***   | `from_buffer` との併用が必要な設計。   |
| edit.from_buffer         | 不明         |                                                             | skip           | `from_buffer` との併用が必要な設計。   |

### 3. `view` (Reading & UI)

情報の閲覧および、Obsidianエディタとの連携に関するツール4個。

| ツール名                    | 説明           | Request Parameters (Value Example)     | ステータス      | 回避策 / 備考                |
| ----------------------- | ------------ | -------------------------------------- | ---------- | ----------------------- |
| `view.file`             | ファイルのプレビュー   | `path: "20_Notes/Test_Folder/file.md"` | ✅ Success  | テキスト内容を直接表示。            |
| `view.active`           | アクティブなファイル取得 | （引数なし）                                 | ✅ Success* | エディタでフォーカスされているファイルを取得。 |
| `view.window`           | 表示範囲のプレビュー   | `path: ".../file.md", lineNumber: 1`   | ✅ Success  | 特定の行にフォーカスした内容を表示。      |
| `view.open_in_obsidian` | Obsidianで開く  | `path: "20_Notes/Test_Folder/file.md"` | ✅ Success  | エディタ上でファイルを開画（アクティブ化）。  |

### 4. `workflow` (Logic)

エージェントの思考を支援するツール1個。

| ツール名               | 説明        | Request Parameters (Value Example) | ステータス     | 回避策 / 備考       |
| ------------------ | --------- | ---------------------------------- | --------- | -------------- |
| `workflow.suggest` | 次のアクション提案 | （引数なし）                             | ✅ Success | コンテキストに基づいた示唆。 |

### 5. `system`

ObsidianとMCPサーバの起動情報に関するツール2個。

| ツール名              | 説明                                                | Request Parameters (Value Example) | ステータス     | 回避策 / 備考                                |
| ----------------- | ------------------------------------------------- | ---------------------------------- | --------- | --------------------------------------- |
| `system.info`     | MCPサーバーの稼働状況、接続されているVault、バージョン情報などのシステム情報を取得します。 | なし（引数なしで実行可能）                      | ✅ Success | 詳細な構造化データが必要な場合は `raw: true` を指定してください。 |
| `system.commands` | Obsidian内で実行可能なコマンド（プラグイン含む）の一覧を取得します。            | なし（引数なしで実行可能）                      | ✅ Success | コマンドは膨大なため、特定のカテゴリに絞り込む等の使い方が想定されます。    |

### 6. `graph` (Link Analysis)

ノート間のつながりを解析するための高度なツール11個。

| ツール名                      | 説明                | Request Parameters (Value Example)                | ステータス      | 回避策 / 備考                                 |
| ------------------------- | ----------------- | ------------------------------------------------- | ---------- | ---------------------------------------- |
| `graph.traverse`          | 指定ノードを起点とした探索     | `sourcePath: "file.md"`                           | ✅ Success  | -                                        |
| `graph.neighbors`         | 隣接するノートの取得        | `sourcePath: "file.md"`                           | ✅ Success  | -                                        |
| `graph.path`              | 2ノード間の最短経路確認      | `sourcePath: ".../A.md", targetPath: ".../B.md"`  | ✅ Success  | -                                        |
| `graph.statistics`        | ノートの接続統計          | `sourcePath: "file.md"`                           | ✅ Success  | -                                        |
| `graph.backlinks`         | 被リンク（Incoming）の取得 | `sourcePath: "file.md"`                           | ✅ Success  | -                                        |
| `graph.forwardlinks`      | 発リンク（Outgoing）の取得 | `sourcePath: "file.md"`                           | ✅ Success  | -                                        |
| `graph.search-traverse`   | クエリによるグラフ探索       | `sourcePath: ".../A.md", searchQuery: "#tag"`     | ✅ Success* | *クエリに一致しない場合でも正常終了。                      |
| `graph.advanced-traverse` | 高度なアルゴリズム探索       | `sourcePath: ".../A.md", searchQueries: ["#tag"]` | ✅ Success* | **重要**: `searchQueries` は配列形式で指定。        |
| `graph.tag-traverse`      | タグを辿るグラフ探索        | `startPath: "Folder", searchQuery: "#tag"`        | ✅ Success* | **重要**: `startPath` と `searchQuery` が必須。 |
| `graph.tag-analysis`      | タグの頻度・分布分析        | `startPath: "file.md"`                            | ✅ Success  | -                                        |
| `graph.shared-tags`       | 共通タグの特定           | （引数なし）                                            | ✅ Verified | -                                        |

### 7. `bases` (Database Operations)

Obsidian内のデータベース（Base）を管理するためのツール6個。

| ツール名                     | 説明          | Request Parameters (Value Example)               | ステータス          | 回避策 / 備考                                           |
| ------------------------ | ----------- | ------------------------------------------------ | -------------- | -------------------------------------------------- |
| `bases.list`<br>（無効化済）   | Base一覧取得    | -                                                | ✅ Success      | -                                                  |
| `bases.read`<br>（無効化済）   | Base設定の読み取り | `path: "21_Hub/Life.base"`                       | ✅ Success      | -                                                  |
| `bases.create`<br>（無効化済） | 新規Base作成    | `path: ".../new.base", config: { views: [...] }` | ✅ Success*     | *`template` ではなく `config` を使用。                     |
| `bases.query`<br>（無効化済）  | Baseデータの検索  | `path: "...", filters: []`                       | ⚠️ **Partial** | Obsidian本体と異なり、階層化tagがサポートされていない。                  |
| `bases.view`<br>（無効化済）   | Baseのビュー表示  | `path: "...", viewName: "表"`                     | ⚠️ **Partial** | `viewName` の指定が必須。Obsidian本体と異なり、階層化タグがサポートされていない。 |
| `bases.export`<br>（無効化済） | データの書き出し    | `path: "...", format: "csv"`                     | ⚠️ **Partial** | Obsidian本体と異なり、階層化タグがサポートされていない。                   |

## 🔗 関連リンク

- [[🏃Obsidian MCP設定]]
- [[Obsidian MCP - basesは階層化タグをサポートしない]]
- [aaronsb/obsidian-mcp-plugin](https://github.com/aaronsb/obsidian-mcp-plugin/tree/main)
