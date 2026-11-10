---
created: 2026-10-08
updated: 2026-10-08
type: evergreen
category: atomic
tags:
  - term
  - tech/obsidian
publish: "true"
---
# 📌 定義
> [!NOTE] Definition
> `metadataCache`はObsidianがファイルごとに内部リンクを解決して持つ索引です。GUIのBacklinksパネル、Obsidian CLIの`backlinks`、MCPの`graph.backlinks`はいずれもこの索引を読みます。バックリンクの正（ground truth）は索引であり、本文に書いた一覧ではありません。

## 🧩 詳細

### 主なプロパティ

- `resolvedLinks`: 存在するファイルへのリンク（forward方向のマップ）。被リンクはこれを逆引きして取得。
- `unresolvedLinks`: 存在しないノートへのリンク。
- `embeds`: `![[...]]` による埋め込み。
- `blockCache`: block参照。

### 索引の挙動（実測）

- code fence 内の wikilink は索引に含まれません（GUIと同じ挙動）。
- alias（`aliases` frontmatter）は解決に使用されます。
- Obsidianが起動している間のみ参照可能（CLI/MCPはObsidian起動が前提）。

### 参照方法

```sh frame="none"
cmd /c obsidian eval code="app.metadataCache.resolvedLinks"
```

## 🔗 関連リンク

- [[Obsidian バックリンク検索のツール選択]]
- [[🛠️Hermes Agent skill - frontmatterとobsidian evalのquoting]]
