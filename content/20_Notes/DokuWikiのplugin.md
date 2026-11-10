---
created: 2015-07-12
updated: 2026-10-01
type: evergreen
category: article
tags:
  - reference
  - tech/dokuwiki
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> DokuWikiのplugin設定を確認します。

## 🧩 pluginの追加

[プラグイン](https://www.dokuwiki.org/ja:plugins)から、pluginを検索して追加します。pluginのinstall方法は、個々のpluginの解説を熟読しましょう。

## 🧩 利用していたplugin

これまで以下の挙げるpluginを利用していました。
- [Cache and Revisions Eraser Plugin](https://www.dokuwiki.org/plugin:cacherevisionseraser)
- [Note Plugin](https://www.dokuwiki.org/plugin:note)
- [Command Plugin](https://www.dokuwiki.org/plugin:command)
- [gist Plugin](https://www.dokuwiki.org/plugin:gist)
- [Google Analytics for DokuWiki](https://www.dokuwiki.org/plugin:googleanalytics)
- [upgrade Plugin](https://www.dokuwiki.org/plugin:upgrade)
- [Pagelist Plugin](https://www.dokuwiki.org/plugin:pagelist)
	- 導入したが使用せず。

### Google Analytics Pluginの設定

Plugin siteの導入方法は記述が古かったです。以下の手順で設定。
1. `管理` > `プラグイン管理`にて、`プラグインのダウンロードとインストール`の以下のURLを指定して、githubの最新buildをinstall。
	- http://cloud.github.com/downloads/tatewake/dokuwiki-plugin-googleanalytics/googleanalytics-stable.tar.gz
2. `管理` > `サイト管理`に`Googleanalytics プラグイン設定`の欄が追加されます。
	* Google Analitycs ID: `tracking id`を入力。
	* `Don't count admin/superuser`にチェック。
	* `Don't count logged in users`にチェック。

## 🔗 参考資料

- [CMSレジュメ- DokuWikiプラグイン](http://www.cmsresume.com/dokuwiki/plugin)
- [cowboyhacks - Dokuwikiお勧めプラグイン（バージョン共通）](http://www.cowboyhacks.com/home/book/dokuwiki%E3%81%8A%E5%8B%A7%E3%82%81%E3%83%97%E3%83%A9%E3%82%B0%E3%82%A4%E3%83%B3%E3%83%90%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B3%E5%85%B1%E9%80%9A)
