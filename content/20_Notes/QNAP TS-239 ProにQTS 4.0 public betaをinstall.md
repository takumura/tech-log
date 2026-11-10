---
created: 2013-05-15
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

QNAP Firmware3系からQTS 4への変更で、interfaceが大きく変更された。変更点などを確認します。

## 🧩 前提

QNAP TS-239 Pro firmware version: `3.7.2 Build 20120719`にて確認。

## 🧩 手順

QNAPのfacebookからQTS4.0 public betaをdownloadします。
- [QTS 4.0 Beta for more Turbo NAS models!](https://www.facebook.com/notes/qnap/qts-40-beta-for-more-turbo-nas-models/10151589367457590)

念のため、dataをbackupした後で、downloadしたimage fileでfirmwareをversion upします。
    ![[20130515_qnap_qts4_install_01.jpg|700]]

再起動が完了するまで待機（約5分程度）し、再度TS-239へ接続します。IEでは以下のような警告が表示されました。だがIEを使用したことで、特に気になる部分はありませんでした。
    ![[20130515_qnap_qts4_install_02.jpg|700]]

login画面が表示されました。QTS4.0にversion upされていることを確認。
    ![[20130515_qnap_qts4_install_03.jpg|700]]

## 💡 所感

login後の画面が大きく変更されていました。詳細は後日確認。
    ![[20130515_qnap_qts4_install_04.jpg|700]]

起動直後のprocess。`Photo Station`、`Music Station`が有効化されており、`Qmultimedia`にmedia fileがあるとindex作成の処理が実行される模様。
    ![[20130515_qnap_qts4_install_05.jpg|700]]

右下部のdash boardから、statusを確認できました。非常に見やすくなっています。
    ![[20130515_qnap_qts4_install_06.jpg|700]]

4.0 Public Betaの時点では、interfaceの動作が非常に重く操作するのが辛い状況でした。4.0.2以降では、体感的に多少はsmoothに操作できるようになったと感じます（若しくは操作感に慣れたか？）。
