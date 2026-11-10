---
created: 2025-10-19
updated: 2026-10-05
type: snapshot
category: article
tags:
  - activity
  - tech/linux/debian/trixie
  - tech/setup
publish: "true"
---
# 🏃 活動概要
> [!ABSTRACT] Overview
> Debian 13（trixie） のマシンを開発環境として利用できるようにするためのセットアップ活動記録です。手順の正本は各reference Noteへ、個別問題はtroubleshooting Noteへ分離しました。

## 🧩 aptパッケージの最新化

aptの更新packageを確認、更新しました。パッケージのアップグレードはありませんでした。

```console frame="none"
$ sudo apt update
$ sudo apt upgrade
$ sudo apt dist-upgrade
```

dist-upgrade時に不要なpackageの削除に関する指示が出た場合は、それに従い以下のコマンドを実行。

```
sudo apt autoremove
```

## 🧩 不要な開放ポートの確認

nmapでopenなportを確認。

```console frame="none"
$ sudo apt-get install nmap
```

```console frame="none"
$ nmap -v localhost
Starting Nmap 7.95 ( http://nmap.org ) at 2025-10-18 17:13 JST
Initiating Ping Scan at 17:13
Scanning localhost (127.0.0.1) [2 ports]
Discovered open port 631/tcp on 127.0.0.1
Completed Connect Scan at 17:13, 0.02s elapsed (1 total hosts)
Initiating Connect Scan at 17:13
Scanning localhost (127.0.0.1) [1000 ports]
Discovered open port 631/tcp on 127.0.0.1
Completed SYN Stealth Scan at 17:13, 0.04s elapsed (1000 total ports)
Nmap scan report for localhost (127.0.0.1)
Host is up (0.00028s latency).
Other addresses for localhost (not scanned): ::1
Not shown: 999 closed ports (conn-refused)
PORT     STATE SERVICE
631/tcp  open  ipp

Read data files from: /usr/bin/../share/nmap
Nmap done: 1 IP address (1 host up) scanned in 0.06 seconds
```

631/tcpは[[ipp(Internet Printing Protocol)]]（CUPS）による開放。そのままでも特に問題なさそうなので、今回はそのままにしておきました。

## 🧩 GNOME設定

[[Debian 13（trixie） GNOME初期設定]]の手順に沿って実施。

> [!warning]
> RDP接続時のマウスカーソル表示、設定画面で固まる問題については [[🛠️Debian 13(trixie) - デスクトップ共有とRDPの課題]]を参照してください。

## 🧩 Appのインストール

- git: [[Debian 13（trixie）github連携]]の手順に沿って実施。
- obsidian: [[Debian 13（trixie）Obsidianをインストール]]の手順に沿って実施。
- vscode: [[Debian 13（trixie）VSCodeをインストール]]の手順に沿って実施。
- brave: [[Debian 13（trixie）Braveをインストール]]の手順に沿って実施。

## 🧩 ファイル共有

[[Debian 13（trixie）でWindowsとファイル共有]]の手順に沿って実施。

## 🧩 Flatpak
> [!warning]
> Flatpakを使ってAppをインストールする前に、`app名 flatpak issue`で検索。sandboxingによる影響でAppがうまく動かず、設定が大変という印象を受けました。時期尚早と判断し、一旦Flatpakでのappインストールを見送ります。

考察は[[Flatpak導入前にsandboxingの影響を確認]]を参照。

[Debian Quick Setup | Flatpak](https://flatpak.org/setup/Debian)を参考にインストールを実施。

```console frame="none"
$ apt-get install flatpak
$ flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
```

OS再起動後にflatpakコマンドが使用可能になりました。

## 💡 振り返り / 次回へのアクション

Gnome Keyringの設定でとにかく躓きました。そこが上手くいけば、他や既存の知識で問題なく進めることができました。