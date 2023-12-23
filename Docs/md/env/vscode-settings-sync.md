---
title: "VSCode: Settings Syncで環境設定を共有する"
date: "2023-12-23"
category: "環境設定"
tag:
  - 環境設定
  - vscode
  - Backup and Sync
---

VSCodeの設定保存＆同期は[July 2020 (version 1.48)](https://code.visualstudio.com/updates/v1_48)から標準機能になりました。詳細は[Settings Sync in Visual Studio Code](https://code.visualstudio.com/docs/editor/settings-sync)にて確認することができます。以前の拡張機能: `Settings Sync`を利用した共有方法は[拡張機能を利用する](doc/env/vscode-settings-sync#拡張機能を利用する)<!--rehype:class=internal-link-->に残しておきます。

## 保存&同期の設定方法

VSCodeの左メニュ `manage` から `Backup and Sync Settings`を選択
<img src="assets/images/vscode-settings-sync/vscode-settings-sync-4.png" alt="Backup and Sync Settings" title="Backup and Sync Settings">

同期したい設定を選択して`Sign in`ボタンを選択します。今回はすべての設定を同期してみます
<img src="assets/images/vscode-settings-sync/vscode-settings-sync-5.png" alt="Backup and Sync Settings sign in" title="Backup and Sync Settings signin">

アカウントをMicrosoftとGithubから選べるようになっています。今回はGithubを選択してみます
<img src="assets/images/vscode-settings-sync/vscode-settings-sync-6.png" alt="Backup and Sync Settings sign in with" title="Backup and Sync Settings signin with">

ブラウザ経由でGithubにSign inします
<img src="assets/images/vscode-settings-sync/vscode-settings-sync-7.png" alt="Backup and Sync Settings sign in with github" title="Backup and Sync Settings signin with github">

<img src="assets/images/vscode-settings-sync/vscode-settings-sync-8.png" alt="Backup and Sync Settings sign in with github" title="Backup and Sync Settings signin with github">

数秒で同期完了のメッセージが表示されます。簡単ですね。
<img src="assets/images/vscode-settings-sync/vscode-settings-sync-9.png" alt="Backup and Sync Settings sign in with github" title="Backup and Sync Settings signin with github">


## 保存&同期の確認

設定の同期状態を確認するには、VSCodeの左メニュ `manage` から `Settings Sync is On`を選択
<img src="assets/images/vscode-settings-sync/vscode-settings-sync-10.png" alt="Show Setting Sync" title="Show Setting Sync">

コマンドパレットから`Settings Sync: Show Synced Data`を選択
<img src="assets/images/vscode-settings-sync/vscode-settings-sync-11.png" alt="Settings Sync: Show Synced Data" title="Settings Sync: Show Synced Data">

Sync ActivityとSynced machineのリストが表示されます。
<img src="assets/images/vscode-settings-sync/vscode-settings-sync-12.png" alt="Settings Sync status" title="Settings Sync status">

以前の拡張機能を利用した設定同期ではgistを利用していましたが、公式の機能では別のどこかに格納されているようでした。

<details open>
  <summary>拡張機能を利用する（2019-11-01 作成）</summary>

## 拡張機能を利用する

拡張機能: `Settings Sync`を導入することで、VSCodeの設定、スニペット、テーマ、ファイルアイコン、キーバインディング、ワークスペース、拡張機能を複数のマシンで同期できます。

データはgistで共有されることになるので、設定のバックアップにもなりそうです。

### 手順

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

### 自動作成されたgist

Settings Syncは`couldSettings`という名前のシークレットgistを自動的に作成していました。手動設定を行えば、自分で作成したgistに環境設定情報をアップロードさせることもできるようです。

gistには、以下の5つのファイルが登録されていました。

- cloudSettings
- extensions.json
- keybindings.json
- keybindingsMac.json
- settings.json

</details>