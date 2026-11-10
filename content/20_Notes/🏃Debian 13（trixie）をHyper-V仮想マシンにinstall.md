---
created: 2025-10-19
updated: 2026-10-05
type: snapshot
category: article
tags:
  - activity
  - tech/linux/debian/trixie
  - tech/hyper-v
  - tech/setup
publish: "true"
---
# 🏃 活動概要
> [!ABSTRACT] Overview
> LaptopへのDebian 13セットアップ準備のため、Hyper-V仮想マシンで練習しました。Debianのセットアップだけで想像以上に労力がかかることが分かったため、実機ではなくVMでsnapshotを取りながら手順を確立する方針にしました。

## 🧩 実施記録

[[Hyper-V上のDebian仮想マシン設定]]の構成で新規仮想マシンを作成。ホスト名は `vm-ldev01`、ドメインは `local`。

- 仮想マシンを起動し、グラフィカルインストールでインストールを実施。
- 手順は[[Debian 13（trixie）インストール手順]]に沿って実施。
	- 無線LANの指定は実機Laptopの設定引き写しで、VM側はDefault Switch経由の自動設定で問題なし。
- インストール完了後にスナップショットを作成。
- 以後セットアップ作業を進める毎に定期的にスナップショットを取得。

## 🔗 関連リンク

- [[Hyper-V上のDebian仮想マシン設定]]
- [[Debian 13（trixie）インストール手順]]
- [[🏃Debian 13（trixie）Hyper-Vの拡張セッションを利用]]
