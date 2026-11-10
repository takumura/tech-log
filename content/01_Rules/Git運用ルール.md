---
created: 2026-08-22
updated: 2026-08-27
type: evergreen
category: governance
tags:
  - rule
  - tech/obsidian
publish: "true"
---
# 📌 定義
> [!NOTE] Definition
> 本VaultにおけるGitの利用方針を定義します。

## 📌 Git管理ポリシー

本Vault内のデータは、環境設定（`.obsidian` フォルダ）を除くすべてのファイル（Markdown、画像等の添付ファイル）を **GitHubのプライベートリポジトリ** にプッシュして履歴・バージョン管理を行っています。

## 📌 コミットメッセージのルール

コミット時のメッセージは、全端末（Windows、iPhone等）共通で以下のフォーマットを使用します。
```text
from {{hostname}}: {{date}}
```

`hostname`は `desktop` や `iphone` など、更新を行った端末名を指定して識別可能とします。

- **具体例**: `from iphone: 2026-08-22 23:50:12`

> [!WARNING] AI作業時のコミット運用
> AIは自動で `git commit` / `git push` を実行しません。AIとの共同作業完了後、人間が変更内容を確認した上でコミット・プッシュを行うこと。

## ✅ 複数端末での同期と競合対策

Obsidian Gitプラグインによるコンフリクトを未然に防ぐため、以下の運用を徹底します。

- **起動時の最新化 (Pull)**: Obsidian起動時に自動で最新の変更を取得(Pull)するよう設定します。
- **編集後のプッシュ (Push)**: 端末を離れる際や別の端末で開く前には、必ずコミット＆プッシュを完了させておきます。
