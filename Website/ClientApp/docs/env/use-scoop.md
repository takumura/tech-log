---
title: "scoopでWindowsアプリを管理する"
date: "2019-11-01"
category: "環境設定"
tag: ["tool", "scoop"]
---

scoop を利用して、開発環境の自動セットアップ、および最新版への定期的なアップデートなどの管理を上手に行えるのか試してみます。

## インストール

まず初めに[公式サイト](https://scoop.sh/)と[GitHub リポジトリ](https://github.com/lukesampson/scoop)を確認しました。インストールは PowerShell スクリプトで行うと書いてあるので、その通りに実行しました。

```ps
> Invoke-Expression (New-Object System.Net.WebClient).DownloadString('https://get.scoop.sh')
Initializing...
Downloading scoop...
Extracting...
Creating shim...
Downloading main bucket...
Extracting...
Adding ~\scoop\shims to your path.
'lastupdate' has been set to '2019-11-01T17:22:42.8161465+09:00'
Scoop was installed successfully!
Type 'scoop help' for instructions.
```

ログインしているアカウントのユーザフォルダ以下に`scoop`フォルダが作成されました。scoop で管理される App はこのフォルダ以下に配置されるようです。

## Bucket の設定

デフォルトでは main backet が利用可能です。`bucket add`コマンドにより、bucket を追加することができます。追加可能な bucket は`scoop\apps\scoop\current\buckets.json`で設定されており、`bucket known`コマンドで見る事もできます。

```ps
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

以前から利用している App が extras にありそうだったので、追加しました。

```ps
> scoop bucket add extras
Checking repo... ok
The extras bucket was added successfully.
```

git がインストールされていないと bucket の追加に失敗します。その場合は git を先にインストールします。

```ps
scoop install git
```

## よく使うであろうコマンド

### scoop search

指定した App が Bucket(collections of apps)にあるか検索する。

```ps
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

### scoop install

指定した App をインストールする。

```ps
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

## scoop update

`scoop udpate`コマンドで scoop 自体とインストール可能な App の情報（app manifest）を更新できます。セミコロンで続けて`scoop update *`とすることで、インストール済みのすべての App に対して、バージョンアップのチェックおよび App の更新ができます。

```ps
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

## アンインストール

追加でインストールする App は`C:\Apps`以下にまとめるルールにしていたので、scoop をインストールし直すことにします。

```ps
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

7zip インストール後にエクスプローラ統合の設定をしたために`7-zip.dll`が削除できなくなっていました。設定を解除して再起動後、アンインストールをやり直します。

```ps
scoop uninstall scoop
WARN  This will uninstall Scoop and all the programs that have been installed with Scoop!
Are you sure? (yN): y
Uninstalling '7zip'
WARN  Shim for '7z' is missing. Skipping.
Removing ~\scoop\shims from your path.
Scoop has been uninstalled.
```

今度は正常にアンインストール処理が完走しました。

## カスタムディレクトリに scoop をインストール

公式 wiki の[Installing Scoop to Custom Directory](https://github.com/lukesampson/scoop/wiki/Quick-Start#installing-scoop-to-custom-directory)を参考にして、`C:\Apps\scoop`以下に scoop をインストールします。

```ps
$env:SCOOP='C:\Apps\scoop'
[environment]::setEnvironmentVariable('SCOOP',$env:SCOOP,'User')
Invoke-Expression (New-Object System.Net.WebClient).DownloadString('https://get.scoop.sh')
```

## App Manifest について

公式が提供していない App Manifest は自分で作ることも可能です。詳細な方法は[Creating an app manifest](https://github.com/lukesampson/scoop/wiki/Creating-an-app-manifest)に書かれています。

## 関連項目

[scoop wiki - GitHub](https://github.com/lukesampson/scoop/wiki)
