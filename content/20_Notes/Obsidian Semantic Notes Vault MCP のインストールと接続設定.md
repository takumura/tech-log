---
created: 2026-09-06
updated: 2026-10-11
type: evergreen
category: article
tags:
  - reference
  - tech/obsidian
  - tech/ai/mcp
  - tech/ai/agent/lm_studio_bionic
  - tech/setup
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> Obsidianのコミュニティプラグイン`Semantic Notes Vault MCP`のインストールと、LM Studio BionicへのMCP接続設定を確認します。

## 🧩 プラグインのインストール

Obsidianの`設定` > `コミュニティプラグイン` > `閲覧`から`Semantic Notes Vault MCP`を検索してインストールして有効化。

設定は特に変更する必要はありませんでした。APIキーの確認は`Authentication`から行います。

## 🧩 LM Studio Bionic - カスタムMCPの設定

LM Studio Bionicの`設定` > `Integration` > `Connected Apps` の画面で`Manual MCP server setup`の追加を選択。
- **Name**: `Semantic Notes Vault MCP`を設定。
- **Connection**: `Web address`を選択。
- **Server address**: `http://localhost:3001/mcp` を設定。
- **Authentication**: `Access token`を選択。
- **Access token**: `Obsidian - Semantic Notes Vault MCPのAPIキー`を設定。

これらを入力し、`Add MCP`ボタンで追加。設定に問題が無ければ、Connected MCP Serversの画面で正常接続のインジケーターが表示されます。

## 🔗 関連リンク

- [[🏃Obsidian MCP設定]]
- [[Obsidian MCP tool reference]]
