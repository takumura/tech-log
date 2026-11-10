---
created: 2025-07-06
updated: 2026-10-01
type: snapshot
category: article
tags:
  - activity
  - tech/nas/qnap
  - tech/activedirectory
publish: "true"
---
# 🏃 活動概要
> [!ABSTRACT] Overview
> QNAPのQTSで、ActiveDirectory DCの設定ができるか調査しました。

## 🧩 詳細

firmware: `QTS 4.1.0`で確認。[[QNAP TS-239 ProをQTS 4.1.0 RCにupdate]]したので、samba4のドメインコントローラ機能に関する設定方法を探りました。結論から言うと、下位のQNAP機器ではドメインコントローラ機能は利用できません。

## 🧩 installされているsambaのversion確認

sshにてloginし、以下のコマンドを実行。

```console frame="none"
[/usr/local/samba/sbin] $ ./smbd -V
Version 3.6.23
```

versionが4ではないので、当然ドメインコントローラの機能は利用できません。

## 💡 振り返り / 次回へのアクション

- すごい悲しくなりました。
- 上位のQNAP機器では、`アプリケーション`の欄にドメインコントローラという機能が追加され、そこからDCの設定ができるようです。
- QTSの利用はあきらめて、[[🏃Debian 7.4.0（wheezy）をQNAP TS-239 Proにinstall]]することにしました。

## 🔗 参考資料

- http://www.slideshare.net/qnapchris/qts-41-presentation
