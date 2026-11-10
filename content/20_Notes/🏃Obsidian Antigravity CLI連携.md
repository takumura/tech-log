---
created: 2026-08-22
updated: 2026-08-28
type: snapshot
category: article
tags:
  - activity
  - tech/ai
  - tech/obsidian
  - tech/setup
publish: "true"
---
# 🏃 活動概要
> [!ABSTRACT] Overview
> Antigravity CLIのセットアップ手順と、Geminiとの連携設定における試行錯誤の記録です。

## 🧩 詳細

Antigravity CLIを利用してObsidianのNote管理に生成AIを活用したかったので、Geminiと相談してセットアップを進めました。

### Antigravity CLIのセットアップ

```shell frame="none"
PS C:\Users\picas> irm https://antigravity.google/cli/install.ps1 | iex
ERROR: logging before google.Init: I0822 22:08:00.268786       1 installer.go:27] Running Antigravity CLI setup...
ERROR: logging before google.Init: I0822 22:08:00.346317       1 installer_windows.go:45] Configuring Windows user PATH registry environment...
ERROR: logging before google.Init: I0822 22:08:00.346831       1 installer_windows.go:117] Successfully added %LOCALAPPDATA%\agy\bin to User PATH registry variable.
ERROR: logging before google.Init: I0822 22:08:00.346831       1 installer_windows.go:148] Broadcasting environment update system-wide...
ERROR: logging before google.Init: I0822 22:08:00.954677       1 installer_windows.go:167] Environment update broadcast completed.


Warning: C:\Users\picas\AppData\Local\agy\bin is not present in your active Environment PATH.
Please restart your active terminal session, or add it manually if needed.


✅ Antigravity CLI binary placed successfully at C:\Users\picas\AppData\Local\agy\bin\agy.exe
Note: The binary is installed, but it is not in your active PATH. Please follow the instructions above to add it, then restart your terminal session.
```

画面にエラーと表示されて一瞬ヒヤッとしましたが、ログ書き出しがエラーになっているだけのようでセットアップはできていました。
環境変数`path`の変更を有効にするため新たなターミナルを開き`agy`コマンドでAntigravity CLIを起動。Geminiの指示通り初回起動とGoogleアカウント認証を行いました。

``````md frame="code" title="Gemini 3.6 Flash(拡張)"
Step 3: 初回起動とGoogleアカウント認証ターミナルで agy と入力して起動します。
```PowerShell
agy
```
1. ログイン: メニューが表示れたら 1. Google OAuth を選択して Enter を押します。
2. ブラウザ認証: ブラウザが起動するので、お使いのGoogleアカウントでログインして認証を許可します。 
3. 初期設定: ターミナルに戻り、カラーテーマの選択と利用規約への同意を行えば準備完了です。  
``````

私のObsidian Vault（Notebook=このVault自身）は`D:\github-repos\Obsidian-Notebook`フォルダ内にあり、gitで管理しています。Antigravity CLIにはこのフォルダで起動して、mdファイルを操作してもらうようにします。

## 💡 振り返り / 次回へのアクション

セッションの中断・再開方法にセッションIDが必要になる場合があることが分かりました。セッションIDの管理が必要です。Antigravity CLIとIDEでトークンを共有しているため、トークン消費にも気を使う必要があります。ローカルAIの併用も検討します。

## 🔗 関連リンク

[[Antigravity CLI リファレンス]]
