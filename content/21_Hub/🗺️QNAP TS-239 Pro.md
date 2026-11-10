---
created: 2015-01-25
updated: 2026-10-04
type: evergreen
category: hub
tags:
  - hub
  - term
  - tech/nas/qnap
publish: "true"
---
# 🗺️ 概要
> [!ABSTRACT] Overview
> QNAP TS-239 Proについて、およびQNAP関連のNoteをまとめたhubです。

# 📌 定義
> [!NOTE] Definition
> 公式サイト: <https://www.qnap.com/en-me/product/ts-239%20pro>

## 🧩 詳細

データバックアップ用storageとして購入。3TB storage x2をmirroring（Raid1）して、ext4でformatして使用。ほぼ24時間稼働。OSをDebian 7（Wheezy）に入れ替え、samba4のドメインコントローラにしていた。電源プラグの接触が怪しくなり、2018年にハードオフで売却。

| Parts  | Spec                     |
| ------ | ------------------------ |
| CPU    | Intel Atom N270 1.6GHz   |
| Memory | 1GB                      |
| HDD1   | HGST HDS723030ALA640 3TB |
| HDD2   | HGST HDS723030ALA640 3TB |

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
        - file.tags.contains("tech/nas/qnap")
        - file.name != "🗺️QNAP TS-239 Pro"
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
    columnSize:
      file.name: 342

```
