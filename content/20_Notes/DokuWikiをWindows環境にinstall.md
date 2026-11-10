---
created: 2013-06-11
updated: 2026-10-01
type: evergreen
category: article
tags:
  - reference
  - tech/dokuwiki
  - tech/setup
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> 開発に使用しているWindows環境にWebMatrixを使用してDokuWikiをinstallします。Wikiの更新はローカルで行い、完成したものをAzure Websitesへ発行するという運用を想定しています。

## 🧩 WebMatrixのinstall

http://www.microsoft.com/web/webmatrix/ からWebMatrixWeb.exeをdownloadします。exeを実行するとWindows Platform Installerが起動し、同時に以下がinstallされました。
- WebMatrix3
- SQL Server Compact 4.0 SP1 CTP1、Compact 4.0 Tools、Scripting Tools
- ASP.NET Web Pages2
- SQL Server 2012 共有管理オブジェクト
- SQL Server 2012 Native Client
- SQL Server 2012 Data-Tier Application Framework 11.0
- SQL Server 2008 R2 管理オブジェクト
- Web Deploy 3.0
- IIS 8.0 Express
- MySQL Connector/Net

  ![[20130611_dokuwiki_install_01.jpg|700]]

  ![[20130611_dokuwiki_install_02.jpg|700]]

  ![[20130611_dokuwiki_install_03.jpg|700]]

  ![[20130611_dokuwiki_install_04.jpg|700]]

  ![[20130611_dokuwiki_install_05.jpg|700]]

## 🧩 WebMatrixで空のphp site作成

WebMatrixを起動し、テンプレートから空のphp siteを作成します。

`既定のサイトの場所`はoptionから指定できます。
    ![[20130611_dokuwiki_install_06.jpg|700]]

`テンプレートギャラリー`を選択。
    ![[20130611_dokuwiki_install_07.jpg|700]]

`空のサイト`を選択し、次へ。
    ![[20130611_dokuwiki_install_08.jpg|700]]

マイクロソフトのライセンス条項に同意。
    ![[20130611_dokuwiki_install_09.jpg|700]]

インストール正常終了。
    ![[20130611_dokuwiki_install_10.jpg|700]]

動作確認のため、index.phpに`phpinfo()`を追記し、phpが動作していることを確認。
    ![[20130611_dokuwiki_install_11.jpg|700]]

PHPの情報が想定通り表示されました。
    ![[20130611_dokuwiki_install_12.jpg|700]]

## 🧩 DokuWikiのsetup

http://www.splitbrain.org/projects/dokuwiki/ から2013/05/27時点の最新dokuwiki source: `dokuwiki-2013-05-10.tgz`（Weatherwax）を取得。解凍したファイルを空のphpサイト上に展開。

[公式サイトのinstall手順](https://www.dokuwiki.org/ja:install)を参考にして、install.phpからsetupを実施。処理終了後にinstall.phpを削除。
    ![[20130611_dokuwiki_install_13.jpg|700]]

ライセンスを選択して保存。
    ![[20130611_dokuwiki_install_14.jpg|700]]
