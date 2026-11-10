---
created: 2013-05-12
updated: 2026-10-01
type: evergreen
category: article
tags:
  - reference
  - tech/nas/qnap
  - tech/activedirectory
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> QNAPのQTSで、ActiveDirectory連携を設定する手順を確認します。

## 🧩 詳細

firmware: `3.7.2 Build 20120719`で確認。samba3の機能によってActiveDirectoryと連携し、ユーザやフォルダセキュリティの設定を行います。

## 🧩 ドメインへの参加手順

コントロールパネルの`ネットワークサービス` > `Microsoftネットワーク`から`Microsoftネットワーク向けのファイルサービスを有効にする`を選択。

quick configuration wizardを使用して、ドメインに登録します。
- 完全なDNSドメイン名: metal.local（フルドメイン名）
- NetBIOSドメイン名: METAL（完全なDNSドメイン名。入力時に自動補完）
- DNSドメインサーバ: 現在のドメインサーバのaddressを入力
- ドメイン管理者ユーザ名:（ドメイン管理ユーザ）
- ドメイン管理者パスワード:（ドメイン管理ユーザのパスワード）

	![[20130512_qnap_qts4_ad_01.jpg|700]]

## 🧩 フォルダセキュリティ

コントロールパネルの`特権の設定` > `共有フォルダ`の画面から、共有フォルダへのユーザアクセス権限の設定を変更します。
	![[20130512_qnap_qts4_ad_02.jpg|700]]

また`高度な許可`タブから`Windows ACLサポートを有効にする`をチェックすると、Windowsエクスプローラからのみ、権限設定を行えるようになります。
