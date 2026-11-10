---
created: 2025-10-13
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
> 長らくWin10をインストールして年賀状作成や、娘のプログラミング勉強に使用していた[[マシン・デバイス一覧### 🧩 DELL LATITUDE E5250|DELL LATITUDE E5250]]。Win10のサポート終了に合わせてDebian 13（trixie）をインストールし、Linuxの開発用マシンとして活用することにしました。

## 🧩 実施記録

ほとんど悩むことなくスムーズにインストールが完了。インストール作業の中でWindowsのデータを消去し、Linuxデータのみの状態に指定。起動も問題なし。

- 使用イメージ: debian-13.1.0のamd64版（10/12時点で最新）
- メディア: Rufusポータブルで4GB USBメモリへ書き込み（1GB以下のサイズだったので余裕があった）
- 作成したUSBメモリからE5250をbootし、グラフィカルインストールを実施。マウス、タッチパッド共に動作確認。
- ホスト名: `lt01`、ドメイン: `local`
- 手順は[[Debian 13（trixie）インストール手順]]に沿って実施。

## 🧩 install後の確認

現在のversionを確認。

```console frame="none"
$ more /etc/debian_version
13.1
$ uname -r
6.12.48+deb13-amd64
```

locale設定の確認。

```console frame="none"
$ locale
LANG=ja_JP.UTF-8
LANGUAGE=
LC_CTYPE="ja_JP.UTF-8"
LC_NUMERIC="ja_JP.UTF-8"
LC_TIME="ja_JP.UTF-8"
LC_COLLATE="ja_JP.UTF-8"
LC_MONETARY="ja_JP.UTF-8"
LC_MESSAGES="ja_JP.UTF-8"
LC_PAPER="ja_JP.UTF-8"
LC_NAME="ja_JP.UTF-8"
LC_ADDRESS="ja_JP.UTF-8"
LC_TELEPHONE="ja_JP.UTF-8"
LC_MEASUREMENT="ja_JP.UTF-8"
LC_IDENTIFICATION="ja_JP.UTF-8"
LC_ALL=
```

インストール完了後は再起動を実施し、[[Debian 13（trixie） GNOME初期設定]]の手順を実施。

## 🔗 関連リンク

- [[Debian 13（trixie）インストール手順]]
- [[🏃Debian 13（trixie）をHyper-V仮想マシンにinstall]]
- [[🏃Debian 13（trixie） 開発環境向けセットアップ]]

