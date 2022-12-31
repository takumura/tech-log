---
title: "(旧)マシン構成"
date: "2022-10-15"
category: "Historical / 環境設定"
tag:
  - dm1-3000
  - ml110G6
  - ts-239 pro
  - mac mini
---

過去に利用していたマシン情報の整理

## HP Pavilion dm1-3000

以前mainで使用していたlaptop pc。ACアダプタを繋げっぱなしにしていたせいで、バッテリー充電できなくなってしまいました。。。

## HP ML110G6 (1台目)

公式サイト: <https://support.hpe.com/hpesc/public/docDisplay?docId=emr_na-c01926955>

仮想化ホスト用サーバ。ほぼ24時間稼働だが、夏場は熱暴走が心配なので停止させていました。

VMWare ESXi -> Hyper-V Server 2010 -> Windows 8.1 pro + Client Hyper-V -> Windows 10 pro + Client Hyper-Vという変遷を経て、2021年に稼働停止。

| Parts | Spec |
| --- | --- |
| CPU | Xeon L3426 1.86GHz |
| Memory1 | UMAX Cetus DCDDR3-16GB-1333 [DDR3 PC3-10600 8GB] |
| Memory2 | KVR1333D3E9SK2/8G [DDR3 PC3-10600 ECC unbuffered 4GB] |
| Memory3 | UMAX Cetus DCDDR3-16GB-1333 [DDR3 PC3-10600 8GB] |
| Memory4 | KVR1333D3E9SK2/8G [DDR3 PC3-10600 ECC unbuffered 4GB] |
| HDD1 | crucial RealSSD C300 128GB |
| HDD2 | HGST HDS722020ALA330 2TB |
| HDD3 | HGST HDS722020ALA330 2TB |
| HDD4 | Seagate ST2000DL003 2TB |
| HDD5 | Seagate ST2000DL003 2TB |
| LAN1 | Onboard(Broadcom Gigabit LAN adapter) |
| LAN2 | PCI VIA Velocity VT6122 Gigabit Ethernet controller |

## HP ML110G6 (2台目)

FreeNASをインストールしてiSCSIストレージサーバにしていたが電気代高騰により予備機になった。2018年にハードオフで売却。

| Parts | Spec |
| --- | --- |
| CPU | Celeron G1101 2.26GHz |
| Memory1 | HYNIX [PC3-10600 DDR3-1333 CL9 ECC 2GB]: 1台目のdefault memory |
| Memory2 | |
| Memory3 | HYNIX [PC3-10600 DDR3-1333 CL9 ECC 2GB]: 2台目のdefault memory |
| Memory4 | |
| HDD1 | HGST HDP725050GLA360 500GB |
| HDD2 | HGST HDP725050GLA360 500GB |
| LAN1 | Onboard(Broadcom Gigabit LAN adapter) |

## QNAP TS-239 Pro

公式サイト: <https://www.qnap.com/en-me/product/ts-239%20pro>

data backup用storageとして購入。3TB storage x2をmirroring(Raid1)し、ext4でformatして使用。ほぼ24時間稼働。OSをDebian Wheezyに入れ替え、samba4のdomain controllerにしていました。

電源プラグの接触が怪しくなり、2018年にハードオフで売却。

| Parts | Spec |
| --- | --- |
| CPU | Intel Atom N270 1.6GHz |
| Memory | 1GB |
| HDD1 | HGST HDS723030ALA640 3TB |
| HDD2 | HGST HDS723030ALA640 3TB |

## Mac mini(Late 2009)

公式サイト: <https://support.apple.com/kb/SP577?locale=ja_JP>

一時期、main pcをMacに移行しようとして購入。結局Windowsに戻ったため、現在はiTunesでiPhoneとの同期専用マシンになっていました。2018年にメルカリで売却。
