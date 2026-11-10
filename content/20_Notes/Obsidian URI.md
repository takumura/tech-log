---
created: 2026-08-28
updated: 2026-08-28
type: evergreen
category: atomic
tags:
  - term
  - tech/obsidian
  - tech/protocol
publish: "true"
---
# 📌 定義
> [!NOTE] Definition
> Obsidian の内部操作を外部アプリケーションやコマンドラインから実行するためのカスタムURLスキーム（`obsidian://`）です。

## 💎 要点

URI スキームを使用することで、特定の Vault を開く、特定のノートを開く、新しいノートを作成するといった操作を、ブラウザの URL やターミナル、ショートカット等から呼び出します。

## 🧩 基本構文

```text
obsidian://<command>?<parameter>=<value>
```

## 🧩 主要なコマンド

| コマンド           | 説明                   | 例                                            |
| :------------- | :------------------- | :------------------------------------------- |
| `open`         | 特定の Vault を開く        | `obsidian://open?vault=MyVault`              |
| `new`          | 新しいノートを作成する          | `obsidian://new?vault=MyVault&name=Untitled` |
| `advanced-uri` | （プラグイン使用時）より高度な操作が可能 | -                                            |

## 🧩 活用例

- **ショートカットの作成**: 特定の Vault を起動するためのデスクトップアイコン。
- **タスク管理ツールとの連携**: 他のアプリから直接 Obsidian のノートへジャンプするリンク。
- **自動化スクリプト**: CLI から Obsidian の操作をトリガーします。
