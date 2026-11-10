---
created: 2025-10-14
updated: 2026-10-01
type: evergreen
category: article
tags:
  - reference
  - tech/windows
  - tech/scoop
  - tech/setup
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> scoopによるWindows11のAppセットアップに関するリファレンスです。

## 🧩 詳細

Appの導入・更新を管理するのにscoopを使用します。

## 🧩 scoopの導入

導入手順の詳細は[[scoop利用リファレンス]]を参照。

新規にセットアップしたWindowsに対して、以下のpowershell scriptを実行することで、appのインストールが行われます。

1. https://gist.github.com/takumura/f897ab722e0d55523243dcfe7a51d4c1#file-install-scoop-ps1
2. https://gist.github.com/takumura/f897ab722e0d55523243dcfe7a51d4c1#file-env-setup-common-ps1
3. https://gist.github.com/takumura/f897ab722e0d55523243dcfe7a51d4c1#file-env-setup-dev-ps1

スクリプトはgistで管理し、随時更新します。

## 🧩 scoopで管理するApps

### ユーティリティ

- 7zip
- extras/appbuster
- extras/avidemux
- extras/crystaldiskinfo
- extras/crystaldiskmark
- extras/geekuninstaller
- extras/gpu-z
- extras/hwmonitor
- innounp
- extras/keepass
	- `scoop\persist\keepass` フォルダ以下にkeyファイルを配置。kdbxファイルはOneDriveフォルダに保管。
- sysinternals/process-explorer
- qtifw
- extras/rufus
- extras/unigetui

### メディアツール

- ffmpeg
- extras/mkvtoolnix
- extras/mpc-hc-fork
- extras/vlc

### 開発系

- curl
- exiftool
- extras/fiddler
- extras/fork
- git
- nvm
- extras/winmerge
- yarn

## 🧩UniGetUIの導入

WinGetやScoopのGUIツールである[UniGetUI](https://www.marticliment.com/unigetui/)を導入。テスト導入したいappやportable版を使っていて、scoopで管理できるappを簡単に検索できないか検証中。

WinGetで導入できるものも併せてリストアップされるが、当面はScoopのみを使用しWinGetのApp検索やインストールは行わないこととします。

## 🧩 Scoopで管理できないAppについて

インストーラーやポータブルパッケージを使用するものについては[[Windows11のAppセットアップ（Scoop管理外）]]にまとめます。

## 🔗 関連リンク

- [[Windows11の環境構築手順]]
- [[Windowsで利用しているツール]]