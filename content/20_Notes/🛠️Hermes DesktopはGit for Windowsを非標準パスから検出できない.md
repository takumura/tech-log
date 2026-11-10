---
created: 2026-09-07
updated: 2026-10-11
type: snapshot
category: article
tags:
  - troubleshooting
  - tech/ai/agent/hermes_agent
  - tech/setup
  - tech/scoop
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> Hermes DesktopはGit for Windowsを既定パスからのみ検出します。Scoop等で非標準パスへインストールしたGitは認識されず、初回起動のbootに失敗しました。Hermesが想定するディレクトリへJunctionを作成することで解消できます。

## ❓ 問題 / 背景

初回起動時に以下のエラーが発生する場合があります。
> [!failure]
> Desktop boot failed: Git for Windows is required for Hermes on Windows

### 原因

Scoop等を使用してGitをインストールしている場合、非標準のパスにインストールされていると認識できないことがあります。

## ✅ 対応策

Hermesが想定するディレクトリへJunctionを作成することで解消可能。以下のコマンドを実行。

```sh frame="none"
New-Item -ItemType Directory -Force "$env:LOCALAPPDATA\hermes\git" | Out-Null
New-Item -ItemType Junction -Path "$env:LOCALAPPDATA\hermes\git\bin" -Target "C:\Apps\scoop\apps\git\current\bin" | Out-Null
```

## 🔗 関連リンク

- [[🏃ローカルAI Hermes Desktopの導入]]
- [[Hermes Desktopセットアップガイド]]
- [[Windows11のAppをscoopで管理する]]

## 🔗 参考資料

- [Desktop boot fails when Git for Windows is installed to non-default path](https://github.com/NousResearch/hermes-agent/issues/45435)
