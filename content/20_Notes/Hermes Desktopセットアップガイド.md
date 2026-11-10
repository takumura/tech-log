---
created: 2026-09-07
updated: 2026-10-11
type: evergreen
category: article
tags:
  - reference
  - tech/ai/agent/hermes_agent
  - tech/setup
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> Hermes Agent Desktopの初期設定、外部サービス（LM Studio, MCPサーバ）との連携手順を確認します。

## 🧩 LM Studio との連携設定

### API Provider の設定

1. Hermes Desktopの設定画面で、`Providers` > `API keys` を開きます。
2. `LM Studio` を選択し、以下の情報を入力します。
	- API key: `http://localhost:1234/v1`
	- LM Studio base URL override: （空欄のまま）
	![[20260907_hermes_desktop_01.png]]

### モデルの設定

1. `Model` セクションにて以下を設定します。
	- provider: `LM Studio`
	- model: `google/gemma-4-26b-a4b-qat`
2. `Mixture of Agents` は `disable` に設定することを推奨。
	![[20260907_hermes_desktop_02.png]]

	![[20260907_hermes_desktop_03.png]]

## 🧩 Strata との連携設定

1. Hermes Desktopの設定画面で、`Providers` > `API keys` を開きます。
2. `ローカル / カスタムエンドポイント` を選択し、以下の情報を入力。
	- **URL**: `http://localhost:1234/v1`
	- **API key**: （空欄のまま）
3. `接続`ボタンを押下し、接続が確認できるとStrataとの接続設定が保存されます。

モデルの設定方法はLM Studioと同じ手順で問題ありませんでした。

## 🧩 MCP server の追加 (Obsidian-MCP)

Hermes AgentからObsidian Vaultを操作するためのMCPサーバ設定手順。

### mcp.json の編集

`Capabilities`の`MCP`タブを開き、`mcp.json` を以下の内容で構成（または修正）します。

```json
{
  "mcpServers": {
    "Obsidian-MCP": {
      "url": "http://localhost:3001/mcp",
      "headers": {
        "Authorization": "Bearer [API キー]"
      }
    }
  }
}
```

![[20260907_hermes_desktop_05.png]]

MCPサーバとの通信が完了すると、`mcp__Obsidian_MCP__vault`等の名称でツールが登録され、Hermes Agentから利用可能になりました。

```log
2026-09-07 21:27:46,243 INFO tools.mcp_tool: MCP server 'Obsidian-MCP' (HTTP): registered 9 tool(s): mcp__Obsidian_MCP__vault, mcp__Obsidian_MCP__edit, mcp__Obsidian_MCP__view, mcp__Obsidian_MCP__workflow, mcp__Obsidian_MCP__system, mcp__Obsidian_MCP__graph, mcp__Obsidian_MCP__bases, mcp__Obsidian_MCP__list_resources, mcp__Obsidian_MCP__read_resource
```

## 🧩 memory / user / skillの設定

### memoryの設定

エージェントが学んだ環境情報やプロジェクト固有の知識。Hermes Agent自身にmemoryの更新を依頼する方法と、手動で更新する方法があります。

- 設定したmemoryの保存場所: `C:\Users\picas\AppData\Local\hermes\memories\MEMORY.md`

```md title="MEMORY.md"
OS: Windows 11 Pro, has 48GB memory and RTX5060 8GB; Preferred terminal: PowerShell (Windows Terminal).
§
Strictly forbid attributing tool issues to "system specs"; always present raw data. Propose alternative workflows rather than delegating tasks.
§
Language preference: Think in English, respond in Japanese. Use English for technical terms where appropriate. Output should be structured with headers, bullets, and bold text.
§
Obsidian vault path: "D:/github-repos/Obsidian-Notebook/Notebook".
```

### userの設定

ユーザーの好みやコミュニケーションスタイル。

- 設定したmemoryの保存場所: `C:\Users\picas\AppData\Local\hermes\memories\USER.md`

```md title="USER.md"
User name is Taku.
§
User is an IT Engineer.
§
User prefers concise responses, dislikes verbose explanations
§
User prefers respond in polite Japanese, use English for technical terms and internal Chain-of-Thought
§
User prefers warm and empathetic response as a personal AI assistant
§
User prefers accuracy and improvement over blind agreement.
§
User prefers the workflow of using Obsidian CLI (`obsidian base:query`) for retrieving file lists in batch processing to minimize tool calls and maintain efficiency.
§
User prefers that when Obsidian (GUI) is not running for Obsidian CLI work, the agent prompts the user to launch it and waits, rather than silently falling back to text search.
§
User prefers to track the progress for media content refinement task via `.base` files in `Notebook/21_Hub/` using `obsidian base:query`.
```

### skillの設定

繰り返し実行したい作業に関する指示詳細。

- 設定したskillの保存場所: `C:\Users\picas\AppData\Local\hermes\skills`
- 標準スキルはskillsフォルダ以下に、フォルダ分類された状態で配置されています。
- 個人ルールとして、カスタムスキルは`skills/custom`フォルダ以下に配置して、標準スキルと区別できるようにしました。

## 🧩 補足

- プロジェクトの切り替えを行うと、それまで見ていたファイルやターミナルの状態はリセットされます。
- 必要に応じて `mcp.json` を編集して、他のMCPサーバも追加可能です。
- Git for Windowsが非標準パス（Scoop管理）だと初回起動に失敗します。
	- [[🛠️Hermes DesktopはGit for Windowsを非標準パスから検出できない]]参照。

## 🔗 関連リンク

- [[🏃ローカルAI Hermes Desktopの導入]]
- [[🏃Hermes Agent への移行ロードマップ]]
