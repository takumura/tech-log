---
created: 2026-10-05
updated: 2026-10-05
type: evergreen
category: atomic
tags:
  - idea
  - tech/linux/debian/trixie
  - tech/setup
publish: "true"
---
# 💡 着想
> [!LIGHTBULB] Overview
> FlatpakでAppをインストールする前には、必ず `app名 flatpak issue` で検索してから導入しましょう。

## 🧩 詳細

sandboxingによる影響でAppがうまく動かず、設定が大変になるケースが多いようです。Debian 13での導入時にFlatpak利用を見送ったのはこの判断によります。

導入する場合は、対象Appのsandbox制約（ファイルアクセス、デバイスアクセス、Extension）を確認してから決めます。時期尚早と判断できる場合は、aptまたはAppImage等の simpler な配布形式を優先します。

## 🔗 関連リンク

- [[🏃Debian 13（trixie） 開発環境向けセットアップ]]
- [[Debian 13（trixie）Obsidianをインストール]]

## 🔗 参考資料

- [Debian Quick Setup | Flatpak](https://flatpak.org/setup/Debian)
