---
created: 2026-10-05
updated: 2026-10-05
type: evergreen
category: article
tags:
  - reference
  - tech/linux/debian/trixie
  - tech/setup
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> Debian 13（trixie）を新規マシン（実機・仮想マシン）へインストールする際の共通手順です。個別マシンの実施記録は各Activity Noteを参照してください。

## 🧩 事前準備（インストールメディア）

- [[https://www.debian.org/distrib/netinst|debianの公式site]]より`小さな CD または USB メモリ`向けイメージを取得。
- Rufusポータブルを使用して、イメージファイルをUSBメモリに書き込みます。
	- 1GB以下のサイズなので、4GBのUSBメモリでも容量に余裕がありました。

## 🧩 インストーラーでの共通設定

グラフィカルインストールを選択し、GUIで作業を進めます。

1. 言語の設定ですべて`日本語`を指定。
2. ネットワーク設定で接続先を指定（実機=無線LAN、仮想マシン=ネットワークアダプタ）。
	- アクセスポイントへの接続やipの設定などもすべて自動で問題なし。
3. ホスト名とドメイン（`local`）を指定。
4. ユーザ登録で、rootユーザのパスワードは空白のまま、一般ユーザのみ登録。
	- こうすることでrootユーザへのsuはできなくなり、一般ユーザがsudoできるように設定されます。
5. diskのpartitioningで`disk全体を使い、LVMをsetupする`を選択。
6. softwareの選択で、以下を選択。
	- `Debian デスクトップ環境`
		- `GNOME`
	- `Standard system utilities`

上記の指定でインストールが開始し、問題なく完了します。

## 🧩 install後の確認

現在のversionとlocaleを確認。

```console frame="none"
$ more /etc/debian_version
$ uname -r
$ locale
```

インストール完了後は再起動を実施し、[[Debian 13（trixie） GNOME初期設定]]の手順を実施。

## 🔗 関連リンク

- [[🏃Debian 13（trixie）をHyper-V仮想マシンにinstall]]
- [[Hyper-V上のDebian仮想マシン設定]]
- [[🏃Debian 13（trixie）をDELL LATITUDE E5250にinstall]]

## 🔗 参考資料

- [Debian GNU/Linux インストールガイド](https://www.debian.org/releases/stable/amd64/index.ja.html)
- [Debian 13 trixie : インストール](https://www.server-world.info/query?os=Debian_13&p=install)
- [Debian 13 "Trixie" リリース！〜Gnome 48 edition インストール、初期設定、基本設定、Gnome 48+Wayland上での正しい日本語入力fcitx5-mozc環境構築](https://www.linux-setting.tokyo/2025/08/debian-13-trixie-gnome-48-edition.html)

