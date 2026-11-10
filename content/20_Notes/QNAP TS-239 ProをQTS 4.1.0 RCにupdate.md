---
created: 2015-01-25
updated: 2026-10-01
type: evergreen
category: article
tags:
  - reference
  - tech/nas/qnap
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> QNAPのQTSをメジャーアップデートして変更点を確認します。

## 🧩 詳細

firmware: `QTS 4`で確認。QTS 4.1.0からsamba4のドメインコントローラ機能が追加されるようです。それを利用するためにFirmwareのupdateを行います。

## 🧩 dataのbackup

念のため必要なdataがあればbackupしておきます。

## 🧩 ドメイン設定の確認

Active Directory認証を行っていた場合は、念のため事前にドメインから外れておきます。
- コントロールパネルの`特権の設定` > `ドメインのセキュリティ`から`ドメインセキュリティなし（ローカルユーザのみ）`を選択。
- ActiveDirectory側の確認も実施します。うまく設定が削除されていない場合は、手動削除を実施。
	- DNSから削除した後は名前解決ができずip addressでの接続になるので要注意。

## 🧩 install用imageの取得

QNAP Forumから`QTS 4.1.0 RC`のimageファイルを取得します。

> [!info]
2014/04/08時点では [公式forum](http://forum.qnap.com/viewtopic.php?f=151&t=91832&sid=47af5993e59b17cbc92e1d128560f9cc)から`TS-239_20140402-4.1.0.zip`を取得できました。ただしforumへloginするためのアカウントが必要です。

## 🧩 firmwareのupdate

コントロールパネルの`システム設定` > `ファームウェア更新`にて、downloadしたzip fileを解凍してできた`TS-239_20140402-4.1.0.img`を使ってsystemの更新を実施。

## 🧩 更新結果

今回は特に大きな問題なく、更新が完了しました。Multimedia StationやMySQL、SSHなどの機能は無効にしていたため、Frimware更新時に何か変更が掛かるか？などの確認はできませんでした。
