---
created: 2026-10-26
updated: 2026-10-26
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
> Brave browserを、Debian 13をインストールしたLaptopで使用できるようにします。

## 🧩 Braveのインストール

[公式セットアップガイド](https://brave.com/linux/)に従ってbraveのリポジトリとsigning keyをセットアップし、aptを使って導入します。

> [!note]
> セットアップガイドでは、Flatpackによる導入よりdeb package(apt)での導入を推奨しています。

```sh frame="none"
> sudo apt install curl
> sudo curl -fsSLo /usr/share/keyrings/brave-browser-archive-keyring.gpg https://brave-browser-apt-release.s3.brave.com/brave-browser-archive-keyring.gpg
> sudo curl -fsSLo /etc/apt/sources.list.d/brave-browser-release.sources https://brave-browser-apt-release.s3.brave.com/brave-browser.sources
> sudo apt update
> sudo apt install brave-browser
```

## 🧩 Braveの設定

スタートボタンでApp一覧を表示し、Braveを起動。併せてDock to Pinに設定しておきます。起動時の設定から、`Braveをデフォルトのブラウザとして設定`します。

### Brave Rewardの設定

アドレスバー右上の`BATマーク`から`Brave Rewards`を開き、プライベート広告の有効化とbitFlyer連携を実施。

### Brave設定 > 同期

メインとなるPCのBraveからコピーした同期コードを適用して、ブックマークと`保存したタブグループ`を共有します。

### Brave設定 > デザイン

- ツールバーのカスタマイズで以下を設定。
	- サイドバーを`off`。
	- Leo AIを`off`。
	- ウォレットを`off`。
	- ブックマークパネルを`on`。
	- タスクマネージャを`on`。
	- デベロッパーツールを`on`。
- アドレスバー入力中に自動でサイト候補を表示を`off`。
- ワイドアドレスバーを使用するを`on`。
- 垂直タブを使用を`on`。
	- タイトルバーを表示を`on`。
	- タブホバーモードを`プレビュー付きカード`に設定。

### Brave設定 > 検索エンジン

デフォルトの検索エンジンをgoogleに変更。

### Brave設定 > 拡張機能

以下の拡張機能を導入します。
- Raindrop.io
- [[Obsidian Web Clipper（ブラウザ拡張）]]

### Brave設定 > 自動入力とパスワード

- パスワードマネージャーの機能を`off`。
- 支払の機能を`off`。
- 連絡先情報の機能を`off`。

## 🔗 参考資料

- [Installing Brave on Linux](https://brave.com/linux/)

