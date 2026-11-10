---
created: 2015-01-25
updated: 2026-10-01
type: snapshot
category: article
tags:
  - activity
  - tech/linux/debian/wheezy
  - tech/nas/qnap
  - tech/setup
publish: "true"
---
# 🏃 活動概要
> [!ABSTRACT] Overview
> QTS4.1のドメインコントローラ機能がQNAP TS-239 Proには提供されませんでした。私がTS-239 Proに求める機能はファイルサーバとドメインサーバだったので、これを機会にQTSからDebian環境に移行することを検討しました。

## 🧩 用意するもの

- USB memory A:
	- Debianのinstall data。DVD等の光学デバイスが使えないのでUSBを利用します。
- USB memory B:
	- Debianの起動data（/boot）の格納用。内部のflash storageを書き換えなければ、USB memory Aを抜いて起動するとQTSを再設定できます。
- USB keyboard:
	- TS-239 Proに接続してinstall時に使用します。
- D-subが使えるDisplay:
	- TS-239 Proに接続してinstall時に使用します。

## 🧩 installの準備

### Debian install用のUSB memory Aを作成

[公式site](https://www.debian.org/CD/http-ftp)からi386用のDVD imageを取得。TS-239 ProのCPU: `N270`は64bitに対応していないので、amd64のimageは使用できません。今回は以前に取得していた`debian-7.4.0-i386-DVD-1.iso`を使用しました。

[Disk Imager for Windows](https://launchpad.net/win32-image-writer)を使用して、取得したimageをUSBに書き込みました。

### その他の準備作業

必要なdataのbackupを取得。心配な場合は内蔵flash storageのbackupも取得したほうが良いかもしれません（今回は実施しませんでした）。

ドメインに参加している場合は、installを開始する前にドメインから抜けておきます。

## 🧩 Debianのinstall手順

### 起動diskの設定

USB Keyboard、Display、USB memory A、BをTS-239 Proに接続した状態で起動し、Delete Keyを押してBIOS設定画面を表示させました。`Boot` > `Hard Disk Drives`の画面に移動し、内蔵flash storageよりもUSB memoryが先に読み込まれるようにしました。設定変更後、saveして再起動。

### Debianのinstall

Debianのinstall画面が表示されるので、[[🏃Debian 7.4.0（wheezy）のinstall]]の手順を参考にしてinstallを進めました。
- networkの設定で、NICが二つ検出されるのでeth0をprimary network interfaceに設定。自動設定は行わず`ip`、`net mask`、`default gateway`、`name server`を適切に設定。
- `ディスクのパーティショニング`で手動を選択。
	- 既存のmd deviceはすべて不要なので削除。
	- USB memory B（背面に接続。`SCSI11`に割り当たっていた）にboot partition（ext2 1GB `/boot`）を作成
	- `sdb`、`sdc`に1.1GBのraidの物理ディスク（`swap領域`）を作成。残りをraidの物理ディスク（`root領域`）に割り当てました。
	- `software RAIDの設定`でRAID1デバイス: `md0`を作成（ext4 3TB `/`）。
	- `software RAIDの設定`でswap用のRAID1デバイス: `md1`を作成（md1 `swap`）。
	* `インストールするカーネル`に`linux-image-3.2.0-4-686pae`を選択。
	* taskselのsoftware選択で`Standard system utilities`と`SSH server`を選択。省電力設定用のアプリケーションは後で手動installすることにしました。
	* `grubのインストール`で、`master boot record`ではなく、boot用USB memoryのmaster boot record（`/dev/sdd`）にinstall。

## 🧩 install後の設定

以下の設定を順に実施。
- [[🏃Debian 7.4.0（wheezy）のinstall]]のinstall後の設定作業
- [[Debian 7.4.0（wheezy）にSSHで接続]]
- [[Debian 7.4.0（wheezy）でiptablesを設定する]]
- [[🏃Debian 7.4.0（wheezy）にSamba4をinstallする]]

FSMOの設定を変更し、TS-239 Proをmasterに設定。
- [[Debian 7.4.0（wheezy）のSamba4 DCにFMSOの役割を転送]]

## 🧩 nicのdriver更新

[Intel Ethernet Drivers and Utilities](http://sourceforge.net/projects/e1000)のsiteからdriverを取得します。今回は`e1000e-3.0.4.1.tar.gz`を利用しました。

取得したmoduleを解凍し、`make install`しました。

```console frame="none"
$ mv e1000e-3.0.4.1.tar.gz /tmp
$ cd /tmp
$ tar -zxvf e1000e-3.0.4.1.tar.gz
$ cd ./e1000e-3.0.4.1/src
$ make install
$ rmmod e1000e
$ insmod /lib/modules/3.2.0-4-686-pae/kernel/drivers/net/ethernet/intel/e1000e/e1000e.ko
$ modprobe e1000e
$ reboot

$ modinfo e1000e | grep version
version:        3.0.4.1-NAPI
srcversion:     D19AC2F37A5BFE64F62B051
vermagic:       3.2.0-4-686-pae SMP mod_unload modversions 686
```

## 🧩 共有フォルダの設定

`/etc/fstab`の設定を変更し、rootフォルダに`user_xattr`と`acl`の設定を追加。

```sh frame="code" title="fstab"
---
# /etc/fstab: static file system information.
#
---
# Use 'blkid' to print the universally unique identifier for a
---
# device; this may be used with UUID= as a more robust way to name devices
---
# that works even if disks are added and removed. See fstab(5).
#
---
# <file system> <mount point>   <type>  <options>       <dump>  <pass>
---
# / was on /dev/md0 during installation
UUID=7eb292cd-ddd4-49ef-8173-df0f50bb998c /               ext4    user_xattr,acl,errors=remount-ro 0       1
---
# /boot was on /dev/sdd1 during installation
UUID=63cc0a02-ede0-403b-9d46-bc05a6fa49c6 /boot           ext2    defaults        0       2
---
# swap was on /dev/md1 during installation
UUID=6fe23c81-4618-4944-8b2f-f5f61187846f none            swap    sw              0       0
/dev/sdd1       /media/usb0     auto    rw,user,noauto  0       0
/dev/sde1       /media/usb1     auto    rw,user,noauto  0       0
```

`/usr/local/samba/bin/net`コマンドでDomain Adminに`SeDiskOperatorPrivilege`を追加。

```console frame="none"
$ ./net rpc rights grant 'METALM\Domain Admins' SeDiskOperatorPrivilege -Uadministrator
Enter administrator's password:
Successfully granted rights.
```

共有フォルダとして使用する`/data/shared`を作成。

```console frame="none"
$ cd /
$ mkdir /data
$ chmod 770 /data
$ cd /data
$ mkdir shared
$ chmod 770 ./shared
```

`/usr/local/samba/etc/smb.conf`を修正し、shared用の共有フォルダ設定を追加。

```sh frame="code" title="smb.conf"
---
# Global parameters
[global]
        dns forwarder = 192.168.24.1
        workgroup = METAL
        realm = METAL.LOCAL
        netbios name = NAS01
        server role = active directory domain controller
        
        idmap_ldb:use rfc2307 = yes
        socket options = TCP_NODELAY
        max protocol = SMB3

[netlogon]
        path = /usr/local/samba/var/locks/sysvol/metal.local/scripts
        read only = No

[sysvol]
        path = /usr/local/samba/var/locks/sysvol
        read only = No

[shared]
        path = /data/shared
        read only = No
        force user = root
        create mask = 0770
        directory mask = 0770
```

> [!failure]
hosts allow = 192.168.24.0/24を設定したところ、RPC errorが発生。ドメインユーザやグループの名前がWindows側から正しく取得できなくなったため、設定を削除しました。追加調査を後日実施します。

### 共有のaccess設定

Windowsマシンに`SeDiskOperatorPrivilege`を持つアカウントでlogin。`コンピュータの管理`を開き、`操作` > `別のコンピューターへ接続`を選択し、TS-239 Proへ接続。

`システムツール` > `共有フォルダ` > `共有`にてshared folderを右クリック > `プロパティ`を選択。`共有のアクセス設定`にてNAS操作用group: `Nas Operators`を`full control`に設定しました。合わせて`Everyone`の設定を削除。

### フォルダのsecurity設定

WindowsマシンにDomain Administratorでlogin。`nas01\shared`フォルダにaccessし右クリック > `プロパティ`を選択。`security`の編集を行い、AdministratorとNas Operatorを`full control`に設定。

server上で権限を見ると作成時のroot:rootのままだが、拡張ACLを表す+が末尾に追加されていました。
```console frame="none"
$ls -al /data
total 16
drwxr-xr-x   3 root root 4096 May 25 20:31 .
drwxr-xr-x  23 root root 4096 May 26 19:52 ..
drwxrwx---+  4 root root 4096 May 26 00:55 shared
```

## 🧩 省電力用の設定

### taskselでinstallされるアプリケーションの確認

taskselでinstallされるアプリケーションは以下の通り。
- wireless-tools（不要）
- acpi-support
- cpufrequtils
- acpi （install済み）
- wpasupplicant（不要）
- powertop
- acpid
- apmd
- pcmciautils（不要）
- pm-utils
- anacron
- avahi-autoipd
- bluetooth（不要）

以下のApplicationをinstallしました。

```console frame="none"
$ apt-get install cpufrequtils powertop apmd acpi-support acpid pm-utils 
```

### powertopの実行

```console frame="none"
$ powertop
```

Tunablesで設定できる項目は、すべてgoodにしました。

## 💡 振り返り / 次回へのアクション

- 起動時にpowertopをautotune状態で起動させました。powertop2.5からはoptionで指定できるようなのですが、apt-getでinstallされるversionは2.0なので工夫が必要です。

## 🔗 参考資料

- [Install Debian on a QNAP TS-869 Pro](http://benlinton.com/posts/qnap_ts_869_pro_debian_install)
- [USBメモリへのディスクイメージの書き込み（Microsoft Windowsの場合）](http://vinelinux.org/docs/vine6/install-guide/disk-imager.html)
- [tasksel - laptop](https://wiki.debian.org/tasksel#A.22laptop.22_task)
- [samba wiki - Setup and configure file shares](http://wiki.samba.org/index.php/Setup_and_configure_file_shares)
- [linuxでintelのギガビットイーサカードを使いたい。 ～e1000とe1000eドライバを更新する](http://roserogue.blogspot.jp/2010/11/linuxintel-e1000e1000e.html)
- [Installing Intel Network Card Drivers under Debian](http://www.thomas-krenn.com/en/wiki/Installing_Intel_Network_Card_Drivers_under_Debian)
- [Chapter 42. Sambaパフォーマンスチューニング](http://www.samba.gr.jp/project/translation/Samba3-HOWTO/speed.html)
- [日本 Samba ユーザー会 - smb.conf](http://www.samba.gr.jp/project/translation/4.0/htmldocs/manpages/smb.conf.5.html)
