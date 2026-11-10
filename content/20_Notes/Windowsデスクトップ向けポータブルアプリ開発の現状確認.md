---
created: 2020-02-23
updated: 2020-02-23
type: snapshot
category: article
tags:
  - review
  - tech/windows/uwp
  - tech/lang/javascript/electron
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> 作業時間や手順を管理するためのWindows10向けデスクトップアプリケーションを作りたくなりました。2020/2月時点で、どんな開発方法があるのか確認しました。

## 🧩 検索してヒットした情報

まず最初にかずきさんのde:code 2019プレゼンテーションを確認。

- [Windows 10 対応のデスクトップアプリを 作る技術（事前公開版）](https://www.slideshare.net/okazuki0130/windows-10-147881407)

続いてMicrosoft Docs

- [Windows PC 用のデスクトップ アプリの構築](https://docs.microsoft.com/ja-jp/windows/apps/desktop/)

MSIXについて

- [MSIX ドキュメント](https://docs.microsoft.com/ja-jp/windows/msix/)

MSIXは管理者権限不要でインストール可能とあるが、インストール作業自体は必要。インストール不要なexe形式のアプリを作ろうと思った場合は、dotnet core + wpfで[自己完結型](https://docs.microsoft.com/ja-jp/dotnet/core/deploying/index#publish-self-contained)にするのが良さそうです。

## 🧩 Electronについて

[公式サイト](https://www.electronjs.org/)のキャッチコピーは`Build cross-platform desktop apps with JavaScript, HTML, and CSS`。VSCodeがElectronを利用していることを考えると、十分に機能的なappを作成できるように思えます。

## 🧩 何から手を付けるか

Electronに将来性を感じます。そしてMSのテクノロジーが不確定で、この先まだまだ変更があるように感じます。なのでまずはElectron + Vue.jsの勉強から始めるのが良いのではないか？と思いました。

## 🔗 関連リンク

- [[🏃NuxtにStorybookを導入する]]

## 🔗 参考資料

- [.NET Core 3.0のPublish Single File概要](https://qiita.com/Nuits/items/3136c999721e5e3fae90)
