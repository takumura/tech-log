---
created: 2026-10-08
updated: 2026-10-08
type: evergreen
category: article
tags:
  - reference
  - tech/obsidian
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> 被リンク（バックリンク）を把握する方式を比較し、Hermes Agent が使うべきツールを確認します。

## 🧩 方式比較

| 方式                                | GUI一致       | fence内   | embed | unresolved               | 出力                           | 決定性                     |
| :-------------------------------- | :---------- | :------- | :---- | :----------------------- | :--------------------------- | :---------------------- |
| 本文に手書き                            | ❌ <br>乖離しうる | -        | ❌     | ❌                        | -                            | -                       |
| Obsidian-MCP<br>`graph.backlinks` | ✅           | ✅<br>除外  | ✅     | ✅<br>`includeUnresolved` | verbose<br>（約2倍トークン）         | `scoreThreshold` <br>あり |
| Obsidian-CLI<br>`backlinks`       | ✅           | ✅ <br>除外 | ✅     | ❌                        | TSV/JSON<br>`counts`/`total` | 確定的                     |
| `search_files`<br>regex           | ❌           | ❌<br>誤検出 | ❌     | ❌                        | -                            | -                       |

## 🧩 ツールの優先順位

1. **単発の被リンク照会**: 
   Obsidian CLI。理由はGUI の Backlinks パネルと実測で完全一致、しきい値による非決定性が無いため。

	```bash frame="none"
	cmd /c obsidian backlinks path="20_Notes/SDelete.md" counts
	cmd /c obsidian backlinks file="SDelete" total
	cmd /c obsidian backlinks path="20_Notes/SDelete.md" format=json
	```
	
2. **グラフ探索・多段トラバーサル・タグネットワーク**:
	Obsidian-MCP `graph`（`neighbors` / `traverse` / `tag-traverse`）。MCPの強みは**辿る**こと。

3. **unresolved link が必要な場合のみ**:
	MCP `graph.backlinks`（`includeUnresolved`）。CLIは存在しないノートを返しません。

4. **Obsidian未起動時**:
	検索にフォールバックせず、Obsidian の起動を促す（CLI/MCPはObsidian起動が前提）。起動できない場合のみ `search_files` を参考値として使用。

5. **本文へのバックリンク記載は行わない**:
	索引の二重管理と乖離を避けるため。

## 🧩 補足

- `vault.search` と `graph.traverse` は補完関係。search は語頻度で語の異なるノートに届かず、traverse は未リンクノートに届かない。どちらも単独では信用できない結果となりました。
- `.base` の `file.backlinks` フィールドは永続ビュー用途に有効（ad-hoc照会には不向き）。
- 食い違い検証の ground truth: `obsidian eval code="app.metadataCache.resolvedLinks"`

## 🔗 関連リンク

- [[metadataCache]]
- [[🛠️Hermes Agent skill - frontmatterとobsidian evalのquoting]]

## 🔗 参考資料

- [Obsidian CLI - Help](https://help.obsidian.md/cli)
