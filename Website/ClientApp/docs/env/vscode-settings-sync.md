---
title: 'VSCode: Settings Syncで環境設定を共有する'
date: '2019-11-01'
category: '環境設定'
tag: ["vscode", "git", "settings.json"]
---

拡張機能: `Settings Sync`を導入することで、VSCodeの設定、スニペット、テーマ、ファイルアイコン、キーバインディング、ワークスペース、拡張機能を複数のマシンで同期できます。

データはgistで共有されることになるので、設定のバックアップにもなりそうです。

## 手順

まずはSettings Syncの拡張機能画面で、設定方法の解説を確認。

```plaintext
Shortcuts
	1. Upload Key : Shift + Alt + U
	2. Download Key : Shift + Alt + D

Configure Settings Sync
	Settings Sync Configuration page will be opened automatically on code start and requires two things to setup:

	1. GitHub Token
	2. GitHub Gist Id

	GitHub Token needs to be retrived by your GitHub account while Settings Sync creates GIST if you are first time user.

	Following are the steps you need to perform to configure.

	- Click on Login with GitHub .
	- Login GitHub on Browser and close the browser tab once you get Success message.
	- If you are using Settings Sync first time GIST will be created automatically when you upload your settings.
	- If you already have GitHub Gist, new window will be opened to allow you to select the GitHub Gist or Skip to create new Gist.
```

  \
特に気になる記述や疑問がなかったので、拡張機能: `Settings Sync`をインストール。完了すると`Welcome to Settings Sync`のタブが表示されたので、`LOGIN WITH GITHUB`を選択。

<img src="assets/images/vscode-settings-sync/vscode-settings-sync-1.png" alt="Welcome to Settings Sync" title="Welcome to Settings Sync">

`Authorize Settings Sync`のページがブラウザで表示されたので、`Authorize shanalikhan`する。
<img src="assets/images/vscode-settings-sync/vscode-settings-sync-2.png" alt="Github OAuth Authorization" title="Github OAuth Authorization">

設定完了の表示に切り替わり、準備が完了しました。

`Shift + Alt + U` もしくは、コマンドパレットから`Sync: アップデート・アップロードの設定`を選択すると、環境設定情報がGistにアップロードされました。

アップロード後、変更なしにもう一度アップロードしようとしたところ、確認ダイアログが表示されました。親切ですね。
<img src="assets/images/vscode-settings-sync/vscode-settings-sync-3.png" alt="Dialog" title="Dialog">

## 自動作成されたgist

Settings Syncは`couldSettings`という名前のシークレットgistを自動的に作成していました。手動設定を行えば、自分で作成したgistに環境設定情報をアップロードさせることもできるようです。

gistには、以下の5つのファイルが登録されていました。

-   cloudSettings
-   extensions.json
-   keybindings.json
-   keybindingsMac.json
-   settings.json

<div class="gist">
	<script src="https://gist.github.com/takumura/bbff68078afb2d0846773965d1678c7c.js"></script>
</div>
