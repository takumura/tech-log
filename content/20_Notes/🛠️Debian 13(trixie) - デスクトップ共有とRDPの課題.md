---
created: 2026-10-05
updated: 2026-10-05
type: snapshot
category: article
tags:
  - troubleshooting
  - tech/linux/debian/trixie
  - tech/setup
publish: "true"
---
# 🔍 問題
> [!ABSTRACT] Overview
> Debian 13(trixie)のGNOMEデスクトップ共有（RDP）関連で発生した2つの問題の記録です。

## ❓ 問題1: デスクトップ共有の設定画面で固まる

`設定` > `システム` > `デスクトップ共有`の画面で固まってしまいました。

### ✅ 解決策

再起動で解消。恒久対策は不明。

## ❓ 問題2: RDP接続時にマウスカーソルを表示できない

GNOMEのremote desktop機能で接続するとマウスカーソルが消えてしまいます。原因不明のため継続調査中。

Fire HD 10をRDPによるサブディスプレイとして使う際にマウスカーソルが見えず、実用上問題があります。HDMI > USB-C > UVC接続のUSB camera app表示を試みたのですが、デバイス接続が頻繁に切れて気持ちよく使えませんでした。

### ✅ 回避策

`アクセシビリティ` > `ポインターとクリック`で`ポインターの位置`をonにし、Ctrlキーでポインタ位置を表示できるようにしました。
- [[Debian 13（trixie） GNOME初期設定]]

## 🔗 関連リンク

- [[Debian 13（trixie） GNOME初期設定]]
- [[🏃Debian 13（trixie） 開発環境向けセットアップ]]
- [[🏃Debian 13（trixie）Hyper-Vの拡張セッションを利用]]
