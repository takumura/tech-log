---
type: evergreen
category: hub
tags:
  - hub
  - term
  - tech/dokuwiki
publish: "true"
---
# 🗺️ 概要
> [!ABSTRACT] Overview
> Dokuwikiについて、およびDokuwiki関連のNoteをまとめたhubです。

## 📌 定義
> [!NOTE] Definition
> [Wikipedia](https://ja.wikipedia.org/wiki/DokuWiki)より引用
>
> **DokuWiki**（ドクウィキ）は、[PHP](https://ja.wikipedia.org/wiki/PHP_\(%E3%83%97%E3%83%AD%E3%82%B0%E3%83%A9%E3%83%9F%E3%83%B3%E3%82%B0%E8%A8%80%E8%AA%9E\) "PHP （プログラミング言語）")で書かれた、[ウィキ](https://ja.wikipedia.org/wiki/%E3%82%A6%E3%82%A3%E3%82%AD "ウィキ")ソフトウェアである。各データはテキストファイルとして保存されるので、[データベース](https://ja.wikipedia.org/wiki/%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9)を必要としない。[GPL 2](https://ja.wikipedia.org/wiki/GNU_General_Public_License "GNU General Public License") ライセンスで配布されている。

## 🧩 詳細

以前tech blogを作成するのに利用していた。サービスプラットフォームとして[[Azure App Service]] （旧 Windows Azure Websites）を利用した。現在はサイト停止中。

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
        - file.tags.contains("tech/dokuwiki")
        - file.name != "🗺️DokuWiki"
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
      file.name: 280

```

## 🔗 参考資料

- [DokuWiki 公式サイト](https://www.dokuwiki.org/ja:dokuwiki)
