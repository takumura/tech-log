---
title: "自宅環境のデータバックアップ設計"
date: "2022-10-16"
category: "環境設定"
tag:
  - backup
  - windows 10
  - windows 11
  - synkron
---

必要なdataのbackupを簡単に行うため、folder構成とbackup手順を考えます。

## folder構成

共有dataの保存用に正と副のストレージを用意します。

- 正： 常時稼働マシン(windows 10)のUSB3接続ストレージ。4TBを記憶域でミラーリング
- 副 #1： メイン開発マシン(windows 11)に搭載したバックアップ専用ストレージ。ミラーリング等は行わず、単一のディスク(4TB)を利用
- 副 #2： 不定期に副 #1から__iCloudDrive__のデータだけをバックアップ。単一のディスク(2TB)を利用

正から副へ、定期的に同期処理を行うことでdataをbackupします。共有folderの構成は以下のように設定。

- __Shared Data__ : top folder。以下のフォルダを正副同期する
  - __Backup__ : driverやtoolなどの過去データや、passwordファイルなどの重要データを保管する
  - __Documents__ : 家族共用のデータや個人データをフォルダ分けして保管する。個人フォルダ内は覗けないように権限で管理。
  - __iCloudDrive__ : iCloudドライブとの同期用フォルダ。家族の写真や動画データをiCloudにアップロードして保管している。
  - __Multimedia__ : 音楽データや動画データを保管する。

## backup

正から副へのbackupには[synkron](https://sourceforge.net/projects/synkron/)を利用。Backup、Documents、iCloudDrive、Multimediaの4つのフォルダ毎にバックアップ設定を作成

- 過去の利用状況から、すべてのフォルダに同時に変更が入ることは少なかったので4つに分割
- 変更があったフォルダだけ同期すると、一回の同期時間が短くなる
