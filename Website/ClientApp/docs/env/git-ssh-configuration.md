---
title: "Git: githubへのssh接続をSourceTreeからwindows 10標準のssh clientに切り替える"
date: "2019-08-15"
category: "環境設定"
tag: ["git", "vscode", "openssh", "windows10"]
---

## 経緯

- これまではSourceTreeを利用してGithub, Bitbucketのリモートリポジトリを操作していました
- 接続にはsshを利用し、SourceTreeに付属のPuttyおよびPageantで鍵の運用をしていました
- [angular-cli-ghpagesを利用する](docs/angular/angular-setup-ghpages){.internal-link}の作業で、origin/gh-pagesにpushする処理でエラーが発生
- VSCodeをPutty(Pageant)を連携する方法を調べたが見つからず、ssh clientの利用方法を見直す必要がありました

## 環境

- Windows 10 May 2019 Update(バージョン1903)
- SourceTree 3.1.3

## 実施した手順

まず初めに、VSCodeからssh接続でremoteにpushする方法について、google検索で情報収集しました。Puttyを利用している記事はヒットせず、openssh clientの設定を行う記事が大半でした。

開発環境はWindows 10 May 2019 Update(バージョン1903)が適用済みで、特に設定不要でssh clientが利用可能になっていました。なのでこれを利用することにします。

途中までSourceTreeで作業をしていたので、鍵の作成や公開鍵のgithubへの登録は完了済みでした。なのでssh clientに秘密鍵を登録して使えるようにします。

### OpenSSH Authentication Agentサービスの設定変更

OpenSSH Authentication Agentサービスは無効状態でした。サービスを起動し、設定を自動起動に変更しました。

### ppkファイルからOpenSSH形式の秘密鍵を生成

Putty(Pageant)が利用している秘密鍵(.ppk)はOpenSSHと互換性のない独自形式です。ssh clientで利用するためにはOpenSSH形式に変換してあげる必要があります。

1. SourceTreeのメニューから`SSH キーの生成/インポート`を選択\
    <img src="assets/images/git-ssh-configuration/git-ssh-configuration-1.png" alt="puttygen.exe" title="puttygen.exe">

2. Loadボタンを押して、githubの秘密鍵(.ppk)を読み込み、メニュの`Conversions` > `Export OpenSSH key`を選択。OpenSSh形式の秘密鍵: `id_rsa`を生成
3. 作成した`id_ras`ファイルを`c:\Users\<username>\.ssh`フォルダに配置

1.で実行されるツール(puttygen.exe)は、私の環境では`c:\Users\<username>\AppData\Local\SourceTree\app-3.1.3\tools\putty\puttygen.exe`にありました。

`c:\Users\<username>\.ssh`も存在していましたが、中身は空でした。

### ssh-agentに秘密鍵を登録

以下のコマンドを実行します。

```cmd
> cd c:\Users\<username>\.ssh
> ssh-add id_rsa
```

パスフレーズを聞かれるので、正しく入力すると登録が完了しました。

これで、gitコマンドを使ってリモートリポジトリを操作できるようになりました。

## SourceTreeの併用について

これまで通りSourceTreeも併用していきたいので、鍵の管理フォルダを`c:\Users\<username>\.ssh`に変更しました。

そして、これまで鍵長2048でキーを作成していることに気が付いたので、鍵長4096のキーにすべて置き換えることにしました。

Bitbucket用、Github用に別々のキーを作成して管理していましたが、今回はAzure DevOpsを含めた3つのgitリポジトリへのアクセスを、共通した1つの鍵で管理することにしました。

```cmd
.ssh> dir

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
-a----       2019/08/15     14:11           3311 id_rsa
-a----       2019/08/15     14:10           2719 id_rsa.ppk
-a----       2019/08/15     15:13            739 id_rsa.pub
-a----       2019/08/15     15:49           4377 known_hosts
```

## 作業時に参照した情報

- [PuTTYを卒業してWindows 10標準のssh client（ベータ）に切り替えた](http://www.freia.jp/taka/blog/windows-native-ssh-client/index.html)
- [Use SSH key authentication](https://docs.microsoft.com/en-us/azure/devops/repos/git/use-ssh-keys-to-authenticate?view=azure-devops)
