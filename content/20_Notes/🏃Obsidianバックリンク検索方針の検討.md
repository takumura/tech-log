---
created: 2026-10-08
updated: 2026-10-08
type: snapshot
category: article
tags:
  - activity
  - tech/obsidian
  - tech/ai/agent/hermes_agent
publish: "true"
---
# 🏃 活動概要
> [!ABSTRACT] Overview
> バックリンク検索の3方式（本文記載 / Obsidian-MCP / Obsidian-CLI）を実測比較し、AGENTS.md とスキル定義を Obsidian CLI 優先へ統一した記録です。

## 🧩 詳細

### 検討のきっかけ

「Obsidian関連スキルの中で、バックリンク検索にObsidian-MCPを最優先と指示しているものがあるか」の確認。

### 状況確認

明示的な優先指示はスキルには無く、`AGENTS.md`（ツール選択ポリシー）のみ存在していました。スキル側は `obsidian-mcp`のcapability列挙にとどまり、優先方針は記述されていませんでした。

### 実測比較

ground truthをObsidianの索引（[[metadataCache]] = GUI の Backlinks パネル）として、CLI / MCP / grep を比較。要点を以下にまとめます。詳細は[[Obsidian バックリンク検索のツール選択]]を参照。

| 観点                     | 本文記載    | MCP `graph.backlinks`   | CLI `backlinks`           |
| :--------------------- | :------ | :---------------------- | :------------------------ |
| GUI一致                  | ❌ 手動・乖離 | ✅                       | ✅                         |
| code fence内 wikilink   | -       | ✅ 除外                    | ✅ 除外                      |
| embed `![[...]]`（229件） | ❌       | ✅                       | ✅                         |
| unresolved link        | ❌       | ✅ `includeUnresolved`   | ❌                         |
| 出力                     | -       | verbose（約2倍トークン）        | TSV/JSON、`counts`/`total` |
| 決定性                    | -       | `scoreThreshold` しきい値あり | 確定的                       |

**比較データ（三者完全一致）**

- `20_Notes/SDelete.md`: 3件（unresolved 0、embed 0）
- `01_Rules/Note分類ルール.md`: 7件
- `20_Notes/UltraDefrag.md`: 3件
- `11_Journal/2026/2026-08-26.md`: grepはfence内2件を誤検出、MCPは除外（GUI挙動と一致）

本Vaultで`aliases` プロパティは未使用。

### 決定した方針

1. **単発のバックリンク照会**: Obsidian CLI（`obsidian backlinks path="..." counts`）
2. **グラフ探索・多段トラバーサル・タグ検索**: Obsidian-MCP `graph`（`neighbors` / `traverse` / `tag-traverse`）
3. **本文へのバックリンク記載**: 非推奨（索引の二重管理・乖離を回避。既存ノートは維持し、追加のみ禁止）
4. **Obsidian未起動時**: ユーザーに起動を促す。起動できない場合のみ `search_files` を参考値として使用

### 反映先

- `AGENTS.md`:
	- `探索とナビゲーション`を4項目へ分割（CLI優先 / MCPは探索専用 / 未起動時は起動を促す / 本文記載禁止）。
	- 改善ログに `[2026-10-08]` を追記。
- `obsidian-mcp`: capability 列挙を優先方針と接続。
- `obsidian-cli`: `## Backlinks` セクション追（`counts` / `total` / `format=json`、制約、起動確認）。
- `obsidian-skill-guide`: `### 4. 🔗 Link & Backlink Analysis` 追加。

## 💡 振り返り / 次回へのアクション

- unresolved link が必要なケースのみ MCP の `graph.backlinks` を使うことにします。
- 作業中に2つの課題を検出: [[🛠️Hermes Agent skill - frontmatterとobsidian evalのquoting]]

## 🔗 関連リンク

- [[🏃Obsidian MCP設定]]
- [[🏃ローカルAI Hermes Desktopの導入]]
- [[Obsidian バックリンク検索のツール選択]]
- [[metadataCache]]
- [[🛠️Hermes Agent skill - frontmatterとobsidian evalのquoting]]

