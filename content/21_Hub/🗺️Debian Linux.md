---
type: evergreen
category: hub
tags:
  - hub
  - term
  - tech/linux/debian
publish: "true"
---
# 🗺️ 概要
> [!ABSTRACT] Overview
> Debian Linuxについて、およびDebian関連のNoteをまとめたhubです。

## 📌 定義
> [!NOTE] Definition
> [Wikipedia](https://ja.wikipedia.org/wiki/Debian)より引用
>
> **Debian**（発音: [dɛbiən](https://ja.wikipedia.org/wiki/%E5%9B%BD%E9%9A%9B%E9%9F%B3%E5%A3%B0%E8%A8%98%E5%8F%B7 "国際音声記号") **デビアン**）または**Debian Project**は[Linuxディストリビューション](https://ja.wikipedia.org/wiki/Linux%E3%83%87%E3%82%A3%E3%82%B9%E3%83%88%E3%83%AA%E3%83%93%E3%83%A5%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3)のひとつである**Debian GNU/Linux**を中心とするプロジェクトである。
>
>[GNUプロジェクト](https://ja.wikipedia.org/wiki/GNU%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88 "GNUプロジェクト")の精神の尊重と、同プロジェクトによるプロダクトの積極的な採用などが特徴である。システム全体を単に[Linux](https://ja.wikipedia.org/wiki/Linux "Linux")と呼ぶ事が多いのに対し、Debianでは「[GNU/Linux](https://ja.wikipedia.org/wiki/GNU/Linux "GNU/Linux")」という呼称を積極的に使っている。

## 🧩 詳細

以前ActiveDirectoryのドメインサーバとして使用していました。

7.4.0(wheezy)時点では、Linux Integration Service(LIS) のバージョンがv3.4と古く、動的memoryなどの機能が働きませんでした。なのでHyper-V上で稼働させるなら、別のdistributionの方が 効率良く資源を活用できそうです。

2025-07-25時点ではDebian 11（Bullseye）とDebian 12（Bookworm）がLTSバージョンとしてサポートされています。Debian 11からは`LIS`と`hyperv-daemons`が標準でインストールされている模様。なので何も考えずにHyper-V上で効率よく運用できるようになっていました。

2025-08-09にDebian 13.0（trixie）が公開されました。[[マシン・デバイス一覧### 🧩 DELL LATITUDE E5250|DELL LATITUDE E5250]]にインストールしてLinuxの開発環境として利用しようとしています。

## 🔗 関連リンク

```base
views:
  - type: table
    name: 表
    filters:
      and:
        - category != "journal"
        - file.ext == "md"
        - '!file.name.startsWith("📋")'
        - file.tags.containsAny("tech/linux/debian", "tech/linux/debian/wheezy", "tech/linux/debian/trixie")
        - file.name != "🗺️Debian Linux"
    order:
      - file.name
      - type
      - category
      - tags
    sort:
      - property: type
        direction: DESC
      - property: category
        direction: ASC
      - property: file.name
        direction: ASC
    columnSize: {}

```

## 🔗 参考資料

- https://www.debian.org/
- https://www.debian.or.jp/
- [Debian - Wikipedia](https://ja.wikipedia.org/wiki/Debian)
