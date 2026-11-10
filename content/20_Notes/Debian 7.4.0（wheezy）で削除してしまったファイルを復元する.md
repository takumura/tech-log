---
created: 2016-11-20
updated: 2026-10-01
type: evergreen
category: article
tags:
  - reference
  - tech/linux/debian/wheezy
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> 操作を誤ってDebian上のディスクに保存していた画像ファイルを削除してしまいました。どうにか復元できないか調査しました。

## 🧩 詳細

### extundeleteのインストール

aptコマンドを使用して`extundelete`というコマンドをインストール。

```console frame="none"
$ apt-get install extundelete
```

### extundeleteによる復元

以下のコマンドを実行。無事削除してしまったファイルを復元することができました。

```console frame="none"
$ extundelete --restore-all --after $(date +%s -d '1 hour ago') /dev/disk/by-uuid/7eb292cd-ddd4-49ef-8173-df0f50bb998c
```

## 🔗 参考資料

- https://extundelete.sourceforge.net/
