---
created: 2023-12-23
updated: 2023-12-23
type: snapshot
category: article
tags:
  - review
  - tech/ide/vscode
  - tech/scm/github
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> VSCodeの設定保存＆同期を行う方法について。
> 
> VSCodeの設定保存＆同期は[July 2020 (version 1.48)](https://code.visualstudio.com/updates/v1_48)から標準機能になりました。詳細は[Settings Sync in Visual Studio Code](https://code.visualstudio.com/docs/editor/settings-sync)にて確認することができます。
> 
> 以前の拡張機能: `Settings Sync`を利用した共有方法は[[#旧手順 - 拡張機能を利用する（2019-11-01 作成）]]に残しておきます。

## 🧩 詳細

1. VSCodeの左メニュ `manage` から `Backup and Sync Settings`を選択。
   ![[20231223_vscode-settings-sync-4.png]]

2. 同期したい設定を選択して`Sign in`ボタンを選択します。今回はすべての設定を同期してみます。
   ![[20231223_vscode-settings-sync-5.png]]

3. アカウントをMicrosoftとGithubから選べるようになっています。今回はGithubを選択してみます。
   ![[20231223_vscode-settings-sync-6.png]]

4. ブラウザ経由でGithubにSign inします。
   ![[20231223_vscode-settings-sync-7.png]]

   ![[20231223_vscode-settings-sync-8.png]]

5. 数秒で同期完了のメッセージが表示されます。
   ![[20231223_vscode-settings-sync-9.png]]


### 保存&同期の確認

設定の同期状態を確認するには、VSCodeの左メニュ `manage` から `Settings Sync is On`を選択。
   ![[20231223_vscode-settings-sync-10.png]]

コマンドパレットから`Settings Sync: Show Synced Data`を選択。
   ![[20231223_vscode-settings-sync-11.png]]

Sync ActivityとSynced machineのリストが表示されます。
   ![[20231223_vscode-settings-sync-12.png]]

以前の拡張機能を利用した設定同期ではgistを利用していましたが、公式の機能では別のどこかに格納されているようでした。

## 旧手順 - 拡張機能を利用する（2019-11-01 作成） 

### 拡張機能を利用する

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

特に気になる記述や疑問がなかったので、拡張機能: `Settings Sync`をインストール。完了すると`Welcome to Settings Sync`のタブが表示されたので、`LOGIN WITH GITHUB`を選択。
   ![[20231223_vscode-settings-sync-1.png]]

`Authorize Settings Sync`のページがブラウザで表示されたので、`Authorize shanalikhan`する。
   ![[20231223_vscode-settings-sync-2.png]]

設定完了の表示に切り替わり、準備が完了しました。

`Shift + Alt + U` もしくは、コマンドパレットから`Sync: アップデート・アップロードの設定`を選択すると、環境設定情報がGistにアップロードされました。

アップロード後、変更なしにもう一度アップロードしようとしたところ、確認ダイアログが表示されました。親切ですね。
   ![[20231223_vscode-settings-sync-3.png]]

### 自動作成されたgist

Settings Syncは`couldSettings`という名前のシークレットgistを自動的に作成していました。手動設定を行えば、自分で作成したgistに環境設定情報をアップロードさせることもできるようです。

gistには、以下の5つのファイルが登録されていました。

- `cloudSettings`
- `extensions.json`
- `keybindings.json`
- `keybindingsMac.json`
- `settings.json`


## 🔗 参考資料

- [July 2020 (version 1.48) - VSCode](https://code.visualstudio.com/updates/v1_48)

