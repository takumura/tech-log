---
created: 2026-09-06
updated: 2026-10-11
type: snapshot
category: article
tags:
  - activity
  - tech/obsidian
  - tech/ai/mcp
  - tech/ai/agent/lm_studio_bionic
  - tech/setup
publish: "true"
---
# 🏃 活動概要
> [!ABSTRACT] Overview
> ローカルAIとObsidianの連携のため、MCPコミュニティプラグインを導入した際の作業記録です。

## 🧩 Obsidian - Semantic Notes Vault MCPのインストール

[[Obsidian Semantic Notes Vault MCP のインストールと接続設定#🧩 プラグインのインストール]]にまとめました。

## 🧩 LM Studio Bionic - カスタムMCPの設定

[[Obsidian Semantic Notes Vault MCP のインストールと接続設定#🧩 LM Studio Bionic - カスタムMCPの設定]]にまとめました。

## 🧩 LM Studio Bionic - Semantic Notes Vault MCPの動作確認

Bionicのエージェントに依頼してまずは手探りで`Semantic Notes Vault MCP`のツール実行を依頼。Noteの作成、更新。Noteの検索が行えることを確認。利用可能なツールについて一通り動作確認をしてもらいました。
[[Obsidian MCP tool reference]]参照。

## 💡 振り返り / 次回へのアクション

- MCPの動作確認は簡単なREST Clientでは実行できないのでPostmanや専用のツールが必要になります。
	- [[Obsidian MCP - basesは階層化タグをサポートしない]]参照。

## 🔗 参考資料

- [aaronsb/obsidian-mcp-plugin](https://github.com/aaronsb/obsidian-mcp-plugin/tree/main)
