---
created: 2014-04-14
updated: 2026-10-01
type: evergreen
category: article
tags:
  - reference
  - tech/nas/qnap
  - tech/iscsi
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> QNAPのQTSで、iSCSI targetを作成する手順を確認します。

## 🧩 詳細

firmware: `3.7.2 Build 20120719`にて確認。QNAP TS-239 ProでiSCSI targetを作成します。

## 🧩設定手順

`ディスク管理` > `iSCSI`を選択。
    ![[20140414_qnap_create_iscsi_target_01.jpg|700]]

`iSCSIターゲットサービスを有効にする`のチェックを入れます。
    ![[20140414_qnap_create_iscsi_target_02.jpg|700]]

`クイックコンフィギュレーションウィザード`を実施。
    ![[20140414_qnap_create_iscsi_target_03.jpg|700]]

`LUNがマッピングされているiSCSIターゲット`を選択し、次へ。
    ![[20140414_qnap_create_iscsi_target_04.jpg|700]]

次へ。
    ![[20140414_qnap_create_iscsi_target_05.jpg|700]]

`ターゲット名`、`ターゲットエイリアス`を入力し、次へ。
    ![[20140414_qnap_create_iscsi_target_06.jpg|700]]

`CHAP認証の使用`のチェックを入れ、`ユーザ名`、`パスワード`、`パスワードの再入力`を設定し、次へ。
    ![[20140414_qnap_create_iscsi_target_07.jpg|700]]

`LUN配分: シンプロビジョニング`、`LUN名`、`容量`を設定し、次へ。
    ![[20140414_qnap_create_iscsi_target_08.jpg|700]]

設定項目を確認し、次へ。
    ![[20140414_qnap_create_iscsi_target_09.jpg|700]]

設定が完了します。
    ![[20140414_qnap_create_iscsi_target_10.jpg|700]]

targetとLUNが有効になっていることが確認できます。
    ![[20140414_qnap_create_iscsi_target_11.jpg|700]]
