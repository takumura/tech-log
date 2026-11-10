---
created: 2026-09-08
updated: 2026-10-11
type: snapshot
category: article
tags:
  - activity
  - tech/ai/agent/hermes_agent
  - tech/transition
publish: "true"
---
# 🏃 活動概要
> [!ABSTRACT] Overview
> LM Studio Bionic から Hermes Agent Desktop へ個人のナレッジとワークフローを移行するための計画。単なる「チャットツール」から自律的にタスクを実行する「エージェント・ワークフロー」への進化を目指します。

## 🧩 移行の4つのフェーズ

### ステップ1：資産の棚卸しとエクスポート

既存の Bionic 環境における情報を整理し、Hermes で利用可能な形式に準備します。
- **カスタム指示 (System Prompt)**: 振る舞いのルールや出力形式の指定。
- **プロジェクトファイル**: 現在進行中のコードやデータセットなどのローカルディレクトリ。
- **ナレッジベース**: 過去の重要なチャット履歴、参照していたメモ書き。

### ステップ2：知識の移管（Knowledge Transfer）

整理した情報を Hermes の独自の仕組みに変換し、パーソナル・コンテキストとして定着させます。
1. **「指示」 $\rightarrow$ `Skills` へ**:
	- 定型的な作業手順（例: コードレビュー, ドキュメント作成）を Skill として構造化。
2. **「好み・属性」 $\rightarrow$ `Memory` へ**:
	- 名前、OS、回答スタイルなどの**宣言的な事実**を `memory` に登録し、セッションを超えた継続性を確保。

### ステップ3：ワークスペースの統合（Workspace Integration）

Hermes がローカル環境（Obsidian Vault等）を直接操作できる状態にします。
- **Project 設定**: 作業ディレクトリを Hermes の Project として認識させます。
- **ツール検証**: `terminal` などのツールが、開発環境（Python, Git等）に対して正しく動作するか確認。

### ステップ4：エージェント・ワークフローの構築

**質問**から**タスク依頼**へのパラダイムシフト。
- **Browser Use**: Web調査と情報取得の自動化。
- **Code Execution (`execute_code`)**: コードを書いて、その場で実行して結果を確認するループの実装。

## 🚀 次のアクション（Next Steps）

- [x] **Memory の登録**: プロフィール情報の確定 ✅ 2026-09-07
- [x] **Obsidian 連携の習得**: `01_Rules`を読み込み、管理ルールを Skill 化する。 ✅ 2026-09-08
- [x] **Skill 作成の実践**: 具体的な定型タスクを一つ選び、Skill として定義してみる。 ✅ 2026-09-08

Hermes Agentからの提案により、以下の3つのskillが作成されました。

### 学習済みのスキル一覧

| スキル名                      | 説明 (Trigger) | 主な役割                                                      |
| :------------------------ | :----------- | :-------------------------------------------------------- |
| `obsidian-rule-enforcer`  | ルール遵守の番人     | ノート作成・編集時に、Type/Category/Tags/アイコンがルール通りかチェックし、修正案を提示します。 |
| `obsidian-note-organizer` | 整理整頓のエージェント  | 散らかったノートをスキャンし、適切なカテゴリへの分類やフォルダ移動の提案を行います。                |
| `obsidian-summary-maker`  | 知識の構造化担当     | ノートから要約を作成したり、MOC（目次）を構築して情報の繋がりを可視化します。                  |

## 🔗 関連リンク

- [[🏃ローカルAI Hermes Desktopの導入]]
- [[Hermes Desktopセットアップガイド]]
