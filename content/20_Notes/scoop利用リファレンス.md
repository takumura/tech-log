---
created: 2022-12-11
updated: 2022-12-11
type: evergreen
category: article
tags:
  - reference
  - tech/scoop
  - tech/setup
  - tech/windows
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> scoopのセットアップ、利用方法を確認します。

## 🧩 インストール

### 環境変数の設定

環境変数: `SCOOP`を設定することで、scoopのインストール先フォルダを指定できます。
- `SCOOP = "c:\apps\scoop"`

### powershellによるscoopインストール

[公式サイト](https://scoop.sh/)には`インストールはPowerShellスクリプトで行う`と書いてあるので、その通りに実行します。

```sh frame="none"
> Invoke-Expression (New-Object System.Net.WebClient).DownloadString('https://get.scoop.sh')
Initializing...
Downloading scoop...
Extracting...
Creating shim...
Downloading main bucket...
Extracting...
Adding c:\apps\scoop\shims to your path.
'lastupdate' has been set to '2019-11-01T17:22:42.8161465+09:00'
Scoop was installed successfully!
Type 'scoop help' for instructions.
```

scoopで管理されるAppはこのフォルダ以下に配置されます。

## 🧩 Bucket の設定

デフォルトではmain bucketが利用可能です。`bucket add`コマンドにより、bucketを追加できます。追加可能な bucketは`scoop\apps\scoop\current\buckets.json`で設定されており、`bucket known`コマンドで見る事もできます。

```sh frame="none"
> scoop bucket known
main
extras
nightlies
nirsoft
php
nerd-fonts
nonportable
java
games
jetbrains
```

以前から利用しているAppがextrasにありそうだったので、追加しました。

```sh frame="none"
> scoop bucket add extras
Checking repo... ok
The extras bucket was added successfully.
```

gitがインストールされていないとbucketの追加に失敗します。その場合はgitを先にインストールします。

```sh frame="none"
scoop install git
```

## 🧩 よく使うコマンド

### scoop search

指定したAppがBucket(collections of apps)にあるか検索します。

```sh frame="none"
> scoop search nodejs
'main' bucket:
    nodejs-lts (12.13.0)
    nodejs (13.1.0)

> scoop search keepass
'extras' bucket:
    keepass-plugin-keeagent (0.10.1)
    keepass-plugin-keeanywhere (1.5.1)
    keepass-plugin-keepassnatmsg (2.0.6)
    keepass-plugin-keepassrpc (1.9.0)
    keepass-plugin-keetraytotp (0.99-Beta)
    keepass-plugin-sequencer (0.1.1)
    keepass-plugin-yafd (1.2.2.0)
    keepass (2.43)
    keepassxc (2.5.0)
```

### 🧩 scoop install

指定したAppをインストールします。

```sh frame="none"
> scoop install 7zip
Updating Scoop...
Updating 'main' bucket...
Checking repo... ok
The main bucket was added successfully.
Scoop was updated successfully!
Installing '7zip' (19.00) [64bit]
7z1900-x64.msi (1.7 MB) [===============================================================================================] 100%
Checking hash of 7z1900-x64.msi ... ok.
Extracting 7z1900-x64.msi ... done.
Linking ~\scoop\apps\7zip\current => ~\scoop\apps\7zip\19.00
Creating shim for '7z'.
Creating shortcut for 7-Zip (7zFM.exe)
'7zip' (19.00) was installed successfully!
```

### scoop update

`scoop update`コマンドでscoop自体とインストール可能なAppの情報（app manifest）を更新できます。セミコロンで続けて`scoop update *`とすることで、インストール済みのすべてのAppに対して、バージョンアップのチェックおよびAppの更新ができます。

```sh frame="none"
> scoop update; scoop update *
Updating Scoop...
Updating 'extras' bucket...
 * 4366eadd vscodium: Update to version 1.40.0                           2 hours ago
 * 3ade6589 vscodium-portable: Update to version 1.40.0                  2 hours ago
 * 88e85c64 vivaldi: Update to version 2.9.1705.41                       2 hours ago
Updating 'main' bucket...
 * 124c0c6a ffmpeg-nightly: Update to version 20191108-e700038           2 hours ago
 * 20998cde annie: Update to version 0.9.6                               2 hours ago
 * 41fcafae terraform-provider-ibm: Update to version 0.19.0             3 hours ago
 * 94629c47 jx: Update to version 2.0.971                                3 hours ago
 * b017d181 faas-cli: Update to version 0.10.3                           3 hours ago
Scoop was updated successfully!
Latest versions for all apps are installed! For more information try 'scoop status'
```

### scoop uninstall

追加でインストールするAp は`C:\Apps`以下にまとめるルールにしていたので、scoopをインストールし直すことにします。

```sh frame="none"
> scoop uninstall scoop
WARN  This will uninstall Scoop and all the programs that have been installed with Scoop!
Are you sure? (yN): y
Uninstalling '7zip'
Removing shim for '7z'.
WARN  Couldn't remove ~\scoop\apps\7zip: 項目 C:\Users\takum\scoop\apps\7zip\19.00\7-zip.dll を削除できません: パス '7-zip.dll' へのアクセスが拒否されました。.Exception
Uninstalling 'winmerge'
Removing shim for 'WinMergeU'.
Couldn't remove ~\scoop\apps: 項目 C:\Users\takum\scoop\apps\7zip\19.00\7-zip.dll を削除できません: パス '7-zip.dll'
へのアクセスが拒否されました。
```

7zipインストール後にエクスプローラ統合の設定をしたために`7-zip.dll`が削除できなくなっていました。設定を解除して再起動後、アンインストールをやり直します。

```sh frame="none"
scoop uninstall scoop
WARN  This will uninstall Scoop and all the programs that have been installed with Scoop!
Are you sure? (yN): y
Uninstalling '7zip'
WARN  Shim for '7z' is missing. Skipping.
Removing ~\scoop\shims from your path.
Scoop has been uninstalled.
```

今度は正常にアンインストール処理が完走しました。

## 🧩 App Manifest について

公式が提供していないApp Manifestは自分で作ることも可能です。詳細な方法は[Creating an app manifest](https://github.com/lukesampson/scoop/wiki/Creating-an-app-manifest)に書かれています。

## 🔗 参考資料

- [scoop wiki - GitHub](https://github.com/lukesampson/scoop/wiki)
- [installing-scoop-to-custom-directory](https://github.com/ScoopInstaller/Scoop/wiki/Quick-Start#installing-scoop-to-custom-directory)
