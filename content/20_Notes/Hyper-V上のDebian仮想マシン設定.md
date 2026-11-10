---
created: 2026-10-05
updated: 2026-10-05
type: evergreen
category: article
tags:
  - reference
  - tech/linux/debian/trixie
  - tech/hyper-v
  - tech/setup
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> 練習用に、Debian 13（trixie）をHyper-V仮想マシンへ導入するための設定を確認します。実機Laptopと同じ条件で試す構成にしています。

## 🧩 仮想マシンの設定

新規の仮想マシンを作成し、以下を設定します。

- `SCSIコントローラー`からDVDドライブを追加し、debianのインストーラーisoファイルをマウント。
- `ファームウェア`で、作成したDVDドライブをブートエントリの先頭にします。
- `セキュリティ`でセキュアブートを無効に設定。
- メモリはLaptopに合わせて4GB。
- プロセッサはLaptopに合わせて4個。
- ネットワークアダプタはネットワークに接続可能なDefault Switch。
- `統合サービス`は6種類すべて有効。
- `チェックポイント`を有効にし、標準チェックポイントを使用。
- `自動開始アクション`は`何もしない`。
- `自動停止アクション`は`電源オフ`。

## 🧩 スナップショット運用

インストール完了後にスナップショットを作成し、以後セットアップ作業を進める毎に定期的にスナップショットを取得します。

> [!tip]
> 一回で綺麗にセットアップできなかったため、仮想マシンで手順を確立してから実機Laptopへ適用する方針です。

## 🔗 関連リンク

- [[Debian 13（trixie）インストール手順]]
- [[🏃Debian 13（trixie）をHyper-V仮想マシンにinstall]]
- [[🏃Debian 13（trixie）Hyper-Vの拡張セッションを利用]]

