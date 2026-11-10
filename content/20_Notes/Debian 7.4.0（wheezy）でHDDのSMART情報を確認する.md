---
created: 2017-01-30
updated: 2026-10-01
type: evergreen
category: article
tags:
  - reference
  - tech/linux/debian/wheezy
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> Debian LinuxでHDDのSMART情報を取得する方法を確認します。

## 🧩 詳細

HDDのSMART情報を取得するために`smartctl`を利用します。`apt`コマンドを使ってインストール。

```console frame="none"
$ apt-get install smartmontools
```

hddの情報は `fdisk -l `で取得できます。

```console frame="none"
$ fdisk -l
Disk /dev/sdb: 3000.6 GB, 3000592982016 bytes
255 heads, 63 sectors/track, 364801 cylinders, total 5860533168 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x00000000
  
   Device Boot      Start         End      Blocks   Id  System
/dev/sdb1               1  4294967295  2147483647+  ee  GPT

WARNING: GPT (GUID Partition Table) detected on '/dev/sdc'! The util fdisk doesn't support GPT. Use GNU Parted.

Disk /dev/sdc: 3000.6 GB, 3000592982016 bytes
255 heads, 63 sectors/track, 364801 cylinders, total 5860533168 sectors
Units = sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0xd06853f8

   Device Boot      Start         End      Blocks   Id  System
/dev/sdc1               1  4294967295  2147483647+  ee  GPT
```

SMART情報は`smartctl -a /dev/sdx` で確認できます。特にエラーは出ていないようでした。
