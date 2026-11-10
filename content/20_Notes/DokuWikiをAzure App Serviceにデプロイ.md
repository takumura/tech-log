---
created: 2013-06-11
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
> ローカルのWindows環境で作成したDokuWikiサイトを、Azure App Serviceにデプロイします。

## 🧩 Azureアカウントの登録

Azureアカウントがない場合はアカウントの作成を行います。クレジットカードが必要になります。

## 🧩 Azure Web Sitesの作成

新規のAzure Web siteを作成。
![[20130611_dokuwiki_azure_deploy_01.jpg]]

## 🧩 Azure Web SiteへのDeploy

`リモート` > `発行`を選択し、Azure App Serviceへのデプロイを実施。
![[20130611_dokuwiki_azure_deploy_02.jpg]]

Azureアカウントでsign in後、作成したweb siteを選択すると後は自動でdeployが進んでいきます。
![[20130611_dokuwiki_azure_deploy_03.jpg]]

![[20130611_dokuwiki_azure_deploy_04.jpg]]

![[20130611_dokuwiki_azure_deploy_05.jpg]]

![[20130611_dokuwiki_azure_deploy_06.jpg]]

![[20130611_dokuwiki_azure_deploy_07.jpg]]

![[20130611_dokuwiki_azure_deploy_08.jpg]]

![[20130611_dokuwiki_azure_deploy_09.jpg]]

![[20130611_dokuwiki_azure_deploy_10.jpg]]

## 💡 振り返り / 次回へのアクション

`{site名}/data/pages/wiki/dokuwiki.txt` にアクセスできてしまうため、security設定が必要でした。
	* [[doku>ja:security|https://www.dokuwiki.org/ja:security]]を参考に、security設定を行おうとしたが、IISではhtaccessでのaccess制御ができませんでした。また、IISでのdirectory access拒否も、document root外へのdirectoryの移動も、Azure portalのWeb site設定から行うことはできませんでした。

> [!tips]
> Azure WebsitesではURL書き換えの機能を使用できます。home directoryのweb.configを作成し、rewriteの定義を追加することでデータフォルダやconfフォルダへのアクセスを制限することができました。詳細は[[DokuWikiの環境設定]]を参照してください。

## 🔗 参考資料

- [Apache mod_rewrite ルールのインポート](http://technet.microsoft.com/ja-jp/library/dd939075.aspx)
- [URL の書き換え | DokuWiki](https://www.dokuwiki.org/ja:rewrite)
