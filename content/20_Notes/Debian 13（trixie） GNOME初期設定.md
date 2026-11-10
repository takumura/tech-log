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
> Debian 13（trixie）install後、開発環境として使うために実施するGNOMEの初期設定を確認します。

## 🧩 ツールボタンの設定

Windowの最小化ボタン、最大化ボタンを有効にします。
1. `windows`キーでメニューを呼び出し、`Tweaks`を起動。
2. `ウィンドウ`タブの`タイトルバーボタン`から`最大化`と`最小化`をonにします。

## 🧩 GNOMEソフトウェアからのインストール

`windows`キーでメニューを呼び出し、`ソフトウェア`を起動。検索で以下をインストール。
- `extension manager`
- `dconf editor`

## 🧩 gnome-shell Extension Managerのセットアップ

ユーザ作成のExtensionをインストール。
- Dash to Dock
- Places Status Indicator
- Preedit Highlight for Japaneses IME

## 🧩 設定の変更

### Wi-Fi

接続しているアクセスポイントの設定で`IPv4`タブからipアドレス、ネットマスク、ゲートウェイを手動でセットします。DNSは自動のままで良いです。

### 電源

`バッテリーの充電`を`バッテリーの寿命を保つ`に変更。`全般` > `バッテリー残量の割合を表示`をonに変更。

### 外観

`スタイル`を`ダーク`に変更。

### アクセシビリティ

`ポインターとクリック`で`ポインターの位置`をonにします。
- 拡張RDP接続時、マウスポインターが表示されて迷子になるため、Ctrlキーでポインタの位置を表示できるようにします。

### システム

- `日付と時刻`で`時計とカレンダー` > `曜日`をonに変更。
- `デスクトップ共有` > `デスクトップ共有`をonに変更。
- `デスクトップ共有` > `ログインの詳細`でパスワードを変更。

## 🧩 リモートデスクトップの設定

ターミナルから以下のコマンドを実行し、デスクトップ共有のモードを`mirror`から`extend`に変更。

```console frame="none"
$ gsettings set org.gnome.desktop.remote-desktop.rdp screen-share-mode 'extend'
```

AndroidやwindowsからRDPクライアントを使用して拡張モードで接続できます。

> [!warning]
> マウスカーソルが正しく表示されない課題があります。詳細は [[🛠️Debian 13(trixie) - デスクトップ共有とRDPの課題]]を参照してください。

## 🔗 関連リンク

- [[Debian 13（trixie）でWindowsとファイル共有]]
- [[Debian 13（trixie）github連携]]
- [[Debian 13（trixie）Obsidianをインストール]]
- [[🏃Debian 13（trixie） 開発環境向けセットアップ]]
