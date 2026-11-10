---
created: 2026-01-12
updated: 2026-10-01
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
> 拡張セッションを利用するための設定（Hyper-V専用機能なのでLaptopへのセットアップは不要）を確認します。

## 🧩 仮想マシン側設定

### xrdpのインストール

aptを使ってxrdpをインストール。

```console frame="none"
$ sudo apt install xrdp
```

/etc/xrdp/xrdp.iniの設定を書き換えました。

```sh frame="code" title="/etc/xrdp/xrdp.ini L23"
; port=3389
port=vsock://-1:3389
```

Debian仮想マシンをシャットダウンして変更を適用。

## 🧩 ホストマシン側設定

ホストマシンのターミナルを管理者で起動し、以下のコマンドを実行。

```console frame="none"
> Set-VM -VMName [Debianの仮想マシン名] -EnhancedSessionTransportType HvSocket
```

## 🧩 動作確認

Debian仮想マシンを起動し、Hyper-Vマネージャから接続。拡張セッションが有効にならなかったので、追加の設定を確認しました。

/etc/xrdp/xrdp.iniの設定を変更。

```sh frame="code" title="/etc/xrdp/xrdp.ini L48"
; security_layer=negotiate
security_layer=rdp
```

この変更で拡張セッションでの接続はできるようになりました。クリップボード共有が有効になり、ホストマシンのWindowsでコピーしたテキストをDebain側に張り付けられるようになりました。

Debian側でコピーした内容のホストマシンでの貼り付けもできるようになり、Obsidianでメモを取るのが楽になりました。

## 🔗 参考資料

- [Hyper-V上で拡張セッションOK（=Win間とのコピペ可能）なDebianを立ち上げる](https://qiita.com/kamaboco/items/ea02e6ccc01fb9a1bb85)
- [Hyper-V Enhanced Session for Debian](https://gist.github.com/ikr4-m/67023682f949c2c22b0e51d0acb68b05)
