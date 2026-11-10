---
created: 2026-11-02
updated: 2026-11-02
type: evergreen
category: article
tags:
  - reference
  - tech/setup
  - tech/windows
  - tech/scoop
  - tech/scm/git
  - tech/ssh
  - tech/hyper-v
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> Windows11の環境構築手順を標準化します。

## 🧩 移行準備

現環境で移行に必要なデータの準備を行います。

### browser bookmark

- Edgeに登録している生活用のbookmarkをexport。
- braveに登録しているbookmarkは同期設定済み。

### その他

- synkron portable
- Hyper-Vの設定

## 🧩 新環境セットアップ

### Windows 11のインストール

- Windows11のインストールメディア（USB）を作成。
- USBメディアを使用してOSをインストール。
- インターネットに接続し、Microsoftアカウントにサインイン。
- ライセンス認証を実施。

### ネットワークドライブの割り当て

最初は特別なツールを入れずとも内容が確認できるように、txt形式でファイルを作成。
- IPアドレス
- DNS
- ネットワークドライブのパスとログインユーザ情報

> [!todo]
> ネットワークドライブ割り当て用のbatファイルを準備する必要があります

- [ ] ネットワークドライブ割り当て用のbatファイル作成

### デバイスドライバの更新

- まずはEdgeのお気に入りをインポート。
- MSIのページ（Edgeのお気に入りにリンクがある）から、マザーボードの各種ドライバを更新します。
- NVIDIAのStudioドライバー最新版をインストール。

### scoopによるappインストール

[[Windows11のAppをscoopで管理する]]と[[scoop利用リファレンス]]にインストールやセットアップ手順をまとめているので参照します。

### scoop管理外のappセットアップ

[[Windows11のAppセットアップ（Scoop管理外）]]にインストールやセットアップ手順をまとめているので参照します。

### Hyper-Vの設定

`設定` > `アプリ` > `オプション機能` > `Windowsのその他の機能`からHyper-Vをインストールし、再起動。
再起動後、旧マシンでエクスポートした設定をインポートするだけで問題なく環境復元できました。

### バックアップの設定

詳細は[[自宅環境のデータバックアップ設計]]を参照。


## 🧩 開発環境向けセットアップ

- Dev Driveの作成
	- [[Windows11のDev Driveを利用する]]
- Visual Studio Code（初期セットアップ時にインストーラーでインストール済み）
- Visual Studio 2022（初期セットアップ時にインストーラーでインストール済み）
- git（初期セットアップ時にscoopでインストール済み）
- Node
	- [NVM for Windows](https://github.com/coreybutler/nvm-windows)を使ってセットアップ
    ```sh frame="none"
    > nvm install lts
    Downloading node.js version 16.15.0 (64-bit)...
    Extracting...
    Complete


    Installation complete. If you want to use this version, type

    nvm use 16.15.0

    # 管理者コンソールで実行すること
    > nvm use 16.15.0
    Now using node v16.15.0 (64-bit)
    ```
- Hermes Desktop
	- [[🏃ローカルAI Hermes Desktopの導入]]を参照。
- Strata
	- [[Strata terminalセットアップリファレンス]]を参照。

## 🧩 旧マシンからの移行作業

1. 旧マシン上で、すべての変更をcommit & pushします。
2. 新マシンで[[GithubのSSHキー作成]]の手順を実施。
	- sshキーは作成済みのものを流用すれば良い。
3. 新デスクトップで順次クローンします。

`OpenSSH Authentication Agent`サービスが`無効`になっていた場合は`自動`に変更します。

## 🔗 関連リンク

- [[🏃新開発環境を構築する]]
- [[Windowsで利用しているツール]]

## 🔗 参考資料

- [Why git can't remember my passphrase under Windows - stackoverflow](https://stackoverflow.com/questions/370030/why-git-cant-remember-my-passphrase-under-windows)

