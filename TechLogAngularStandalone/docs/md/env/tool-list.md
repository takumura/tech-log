---
title: "Windowsの環境セットアップ"
date: "2019-11-08"
category: "環境設定"
tag:
  - 環境設定
  - setup
  - tool
  - install
---

Windowsの環境セットアップ手順についてまとめます。Scoopを利用できるものはセットアップを自動化し、そうでないものは個別にインストールしています。

## scoopを用いた環境セットアップスクリプト

**env-setup-common.ps1**

``` powershell
## plese run following command if error occured for running powershell script.
## set-executionpolicy unrestricted -s cu

# install scoop to "c:\Apps\scoop" folder
$env:SCOOP='C:\Apps\scoop'
[environment]::setEnvironmentVariable('SCOOP',$env:SCOOP,'User')
Invoke-Expression (New-Object System.Net.WebClient).DownloadString('https://get.scoop.sh')

# install git to add bucket
scoop install git

# add extras bucket
scoop bucket add extras

# utils
scoop install 7zip keepass curl winmerge fiddler
```

**env-setup-dev.ps1**

``` powershell
# dev utils
scoop install git fork

# programming
scoop install dotnet-sdk nodejs

# editor
scoop install vscode
```

### 7zip

圧縮・解凍ソフト。Scoopを利用してインストールできます。完了後に、`scoop\apps\7zip\current\7zFM.exe`のメニュ > `ツール` > `オプション` > `7-Zip` から `シェルコンテキストメニュに7zipを登録`のチェックを入れて、右クリックメニュから7zipを使えるようにします。

### keepass

パスワード管理ツール。

### curl

URLシンタックスを用いてファイル送受信を行うコマンドラインツール

### git

バージョン管理ツール

### git-fork

グラフィカルgitクライアント。一緒に仕事をしている人が超絶お勧めしているので試してみる予定。Scoopを利用してインストールできるか検討中。

### WinMerge

差分比較、マージツール。Scoopを利用してインストールできます。

### fiddler

HTTPトラフィック監視ツール。Scoopを利用してインストールできるか検討中。

### Simple VHD Manager

VHD（仮想ハードディスク）ファイルの管理ツール。Scoopを利用してインストールできるか検討中。公式bucketsにはapp manifestが存在しないため、自分で作る必要がある。

### .NET Core

開発環境。Scoopを利用してインストールできるか検討中。

### Nodejs

開発環境。Scoopを利用してインストールできるか検討中。LTS版をインストールする予定。

### Visual Studio Code

軽量コードエディター。Scoopを利用してインストールできるか検討中。

### chrome

ブラウザ。Scoopを利用してインストールできるか検討中。公式bucketsにはapp manifestが存在しないため、自分で作る必要がある。

## 個別にインストールするAppについて

### Synkron

フォルダ同期ツール

### Visual Studio

開発環境

## 関連項目

- [Example Setup Scripts](https://github.com/lukesampson/scoop/wiki/Example-Setup-Scripts)
- [Chrome.json](https://github.com/Ash258/scoop-Ash258/blob/master/bucket/Chrome.json)
- [SimpleVHDManager.json](https://github.com/Ash258/scoop-Ash258/blob/master/bucket/SimpleVHDManager.json)
