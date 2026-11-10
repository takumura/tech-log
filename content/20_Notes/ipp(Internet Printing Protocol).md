---
created: 2026-10-05
updated: 2026-10-05
type: evergreen
category: atomic
tags:
  - term
  - tech/linux/debian
  - tech/network
  - tech/protocol
publish: "true"
---
# 📌 定義
> [!NOTE] Definition
> **ipp (Internet Printing Protocol)** は、ネットワーク経由でプリンタを制御するためのprotocolです。IANAによるwell-known portは **631/tcp**（631/udpも使用）です。

## 🧩 Debian上の実体

DebianではCUPS（Common Unix Printing System）がippポートをlistenしており、ローカル環境で631/tcpがopenになるのは既定の動作。CUPSのWeb管理UI・印刷キュー制御がこのポート経由でアクセスされます。

## 🔗 関連リンク

- [[🏃Debian 13（trixie） 開発環境向けセットアップ]]
