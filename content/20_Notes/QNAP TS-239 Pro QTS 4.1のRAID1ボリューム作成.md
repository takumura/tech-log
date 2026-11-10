---
created: 2013-05-16
updated: 2026-10-01
type: evergreen
category: article
tags:
  - reference
  - tech/nas/qnap
  - tech/device/raid
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> QNAPのQTSで、RAID1ボリュームを作成する手順を確認します。

## 🧩 詳細

firmware: `QTS 4.1.0`で確認。[[🗺️QNAP TS-239 Pro]]に接続したHDD2台を用いてRAID1ボリュームを作成します。

## 🧩 設定手順

`コントロールパネル` > `ストレージマネージャ` > `ボリューム管理`の画面で、接続しているHDDが表示されていることを確認し、`作成`ボタンを押下。
	![[20130516_qnap_create_raid1_volume_01.jpg|700]]

`すべてのサービスを一時的に停止します`の確認ダイアログで`OK`ボタンを押下。
	![[20130516_qnap_create_raid1_volume_02.jpg|700]]

ボリュームのタイプで`RAID1ミラーリングディスクボリューム`を選択し`次へ`ボタンを押下。
	![[20130516_qnap_create_raid1_volume_03.jpg|700]]

接続しているHDD2台を選択し、ファイルシステム: `EXT4`、暗号化: `いいえ`を設定して`作成`ボタンを押下。
	![[20130516_qnap_create_raid1_volume_04.jpg|700]]

ディスクが初期化される事に関するダイアログで`OK`ボタンを押下。
	![[20130516_qnap_create_raid1_volume_05.jpg|700]]

作成中...
	![[20130516_qnap_create_raid1_volume_06.jpg|700]]

作成が完了すると、論理ボリュームにミラーリングディスクボリュームが表示されるので、`フォーマット`ボタンを押して初期化を行い、利用可能な状態にします。
	![[20130516_qnap_create_raid1_volume_07.jpg|700]]
