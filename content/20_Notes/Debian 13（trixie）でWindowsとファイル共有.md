---
created: 2025-11-08
updated: 2026-10-01
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
> WindowsのNASにあるファイルをDebian13から参照できるようにします。

## 🧩 設定

一時的なアクセスはGnomeの`ファイル`アプリから可能。
- `ファイル`アプリを起動。
- `ネットワーク`タブを選択。
- 下段のサーバワークアドレス欄に`smb://media01`を入力し`接続`ボタンを押下。
- ユーザ名とパスワードを入力します。ドメインは`workgroup`のままでokです。

接続時にパスワードの保存方法を選択できます。
- `ログアウトするまでパスワードを記憶する`を選択した場合は、次回ログイン時に再度パスワードを聞かれます。
- `期限なしで記憶する`を選択した場合は、Gnome Keyringに情報が保存されます。

自動マウントはされませんが、一度アクセスするとターミナルからも`run/user/1000/gvfs/smb-share:server=....`のようなパスでアクセスできるようになります。

## 💡 振り返り / 次回へのアクション

常に/mnt/share等の固定パスからアクセスしたいような用途がなければ、fstabの設定をしなくても特に問題なさそうです。
