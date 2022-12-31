---
title: "Windowsで利用しているツール"
date: "2022-12-11"
category: "環境設定"
tag:
  - setup
  - tool
  - install
---

Scoopやインストーラー、ポータブルパッケージ等を用いてセットアップし、利用しているアプリを整理します。

## scoopを利用してインストールするApp

### git

開発でも使用するが、bucketの追加に利用しているためscoopを利用するなら必須。

### 7zip

圧縮・解凍ソフト。Scoopを利用してインストールできます。完了後に、`scoop\apps\7zip\current\7zFM.exe`のメニュ > `ツール` > `オプション` > `7-Zip` から `シェルコンテキストメニュに7zipを登録`のチェックを入れて、右クリックメニュから7zipを使えるようにします。

### keepass

パスワード管理ツール。

### appbuster

Windows 10/11にインストールされた不要なappを削除できる。<https://www.oo-software.com/en/ooappbuster>

### avidemux

動画編集ツール。<https://avidemux.sourceforge.net/>

### crystaldiskinfo

ディスクの健康状態をチェック

### crystaldiskmark

ディスクのパフォーマンをチェック

### geekuninstaller

レジストリを含めてappを丁寧にアンインストールする

## scoopを利用してインストールするApp (開発用)

### nvm

複数バージョンのnodeをインストール、切り替える事ができる。<https://github.com/coreybutler/nvm-windows>

### git-fork

グラフィカルgitクライアント。一緒に仕事をしている人が超絶お勧めしているので試してみる予定。Scoopを利用してインストールできるか検討中。

### curl

URLシンタックスを用いてファイル送受信を行うコマンドラインツール

### WinMerge

差分比較、マージツール。Scoopを利用してインストールできます。

### fiddler

HTTPトラフィック監視ツール。Scoopを利用してインストールできるか検討中。

## インストーラーを利用してインストールするApp

### Brave

ブラウザ。iPhoneとブックマークを同期するのに利用

### Visual Studio Code

軽量コードエディター。

### Visual Studio

開発環境

### .NET Core

開発環境用ライブラリ

### OneDrive

クラウドファイル共有のクライアント

### spacedesk

ラップトップやiPad、Fire HD 10などのタブレットをサブディスプレイにできる

## ポータブル版を利用するApp

### Synkron

フォルダ同期ツール

### MagicFinder

IOデータのWIFIルータ接続ツール

### ProcessExplorer

機能強化したタスクマネージャー。<https://learn.microsoft.com/en-us/sysinternals/downloads/process-explorer>

### WDIDLE3 for Windows

 Western Digital製HDDの省電力機能`IntelliPark`を無効にする。<http://liliumrubellum.blog10.fc2.com/blog-entry-307.html>

## 以前使用していたツール

### Simple VHD Manager

VHD（仮想ハードディスク）ファイルの管理ツール。

### chrome

ブラウザ。Edgeとエンジンが同じためEdgeに移行した

## 関連項目

- [Example Setup Scripts](https://github.com/lukesampson/scoop/wiki/Example-Setup-Scripts)
- [Chrome.json](https://github.com/Ash258/scoop-Ash258/blob/master/bucket/Chrome.json)
- [SimpleVHDManager.json](https://github.com/Ash258/scoop-Ash258/blob/master/bucket/SimpleVHDManager.json)
