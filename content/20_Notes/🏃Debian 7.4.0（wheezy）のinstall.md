---
created: 2014-06-30
updated: 2026-10-01
type: snapshot
category: article
tags:
  - activity
  - tech/linux/debian/wheezy
  - tech/setup
publish: "true"
---
# 🏃 活動概要
> [!ABSTRACT] Overview
> Debian7.4.0（wheezy）の最低限のbase systemをinstallしました。

## 🧩 install手順

1. [debianの公式site](http://www.debian.org/CD/http-ftp)より、最新の安定板DVD imageを取得。debian-7.4.0のamd64版を使用。
2. 取得したDVD-1から起動し、Expert Installを選択。
3. 言語の設定で`日本語`を選択、場所の選択`アジア` > `日本`を選択。localeは`default (ja_JP.UTF-8)`と`en_US.UTF-8`を選択し、system localeは`en_US-UTF8`を選択。

 > [!important]
localeに`ja_JP.UTF-8`を選択すると、最小構成install後のapt-get messageなどが文字化けしました。不便なのでまずは`en_US.UTF8`が無難と思われます。

4. keyboardの設定`日本語`を選択。
5. 追加moduleの設定は今回は行いませんでした。
6. networkの設定で`手動`を選択し、ip address、net mask、default gateway、name serverを適切に設定。
7. host名を適切に設定。ドメインは一旦空のままにしておきます。
8. ユーザとパスワードの設定で`shadow password: 有効`、`rootでのlogin: 許可`を選択。
9. rootユーザのパスワード設定と一般ユーザ登録。一般ユーザはドメインユーザと混同しないようにしました。
10. 時間の設定で`NTP server: ntp.nict.jp`を設定。時間帯を`Asia/Tokyo`に設定。
11. diskのpartitioningで`disk全体を使い、LVMをsetupする`を選択。volume group名`VG1`を設定。
12. installするkernelで`linux-image-amd64`を選択。
13. package managerの設定で`network mirror: ftp.jp.debian.org`に設定。`non-free softwareの使用: はい`に設定。softwareの選択で`Standard system utilities`と`SSH server`を選択。

## 🧩 install後の設定作業

現在のversionを確認。

```console frame="none"
---
# more /etc/debian_version
7.4
---
# uname -r
3.2.0-4-amd64
```

設定の確認。

```console frame="none"
---
# locale
LANG=en_US.UTF-8
LANGUAGE=
LC_CTYPE="en_US.UTF-8"
LC_NUMERIC="en_US.UTF-8"
LC_TIME="en_US.UTF-8"
LC_COLLATE="en_US.UTF-8"
LC_MONETARY="en_US.UTF-8"
LC_MESSAGES="en_US.UTF-8"
LC_PAPER="en_US.UTF-8"
LC_NAME="en_US.UTF-8"
LC_ADDRESS="en_US.UTF-8"
LC_TELEPHONE="en_US.UTF-8"
LC_MEASUREMENT="en_US.UTF-8"
LC_IDENTIFICATION="en_US.UTF-8"
LC_ALL=
```

aptの更新packageを確認、更新しました。

```console frame="none"
---
# apt-get update
---
# apt-get upgrade
---
# apt-get dist-upgrade 
```

tmuxをinstall。

```console frame="none"
---
# apt-get install tmux
```

## 🧩 samba4のsetup後に追記

nmapでopenなportを確認。

```console frame="none"
$ apt-get install nmap

$ nmap -v localhost
Starting Nmap 6.00 ( http://nmap.org ) at 2014-04-23 01:51 JST
Initiating SYN Stealth Scan at 01:51
Scanning localhost (127.0.0.1) [1000 ports]
Discovered open port 22/tcp on 127.0.0.1
Discovered open port 53/tcp on 127.0.0.1
Discovered open port 111/tcp on 127.0.0.1
Discovered open port 445/tcp on 127.0.0.1
Discovered open port 139/tcp on 127.0.0.1
Discovered open port 25/tcp on 127.0.0.1
Discovered open port 135/tcp on 127.0.0.1
Discovered open port 636/tcp on 127.0.0.1
Discovered open port 3268/tcp on 127.0.0.1
Discovered open port 1024/tcp on 127.0.0.1
Discovered open port 3269/tcp on 127.0.0.1
Discovered open port 464/tcp on 127.0.0.1
Discovered open port 88/tcp on 127.0.0.1
Discovered open port 389/tcp on 127.0.0.1
Completed SYN Stealth Scan at 01:51, 0.06s elapsed (1000 total ports)
Nmap scan report for localhost (127.0.0.1)
Host is up (0.000018s latency).
Other addresses for localhost (not scanned): 127.0.0.1
Not shown: 986 closed ports
PORT     STATE SERVICE
22/tcp   open  ssh
25/tcp   open  smtp
53/tcp   open  domain
88/tcp   open  kerberos-sec
111/tcp  open  rpcbind
135/tcp  open  msrpc
139/tcp  open  netbios-ssn
389/tcp  open  ldap
445/tcp  open  microsoft-ds
464/tcp  open  kpasswd5
636/tcp  open  ldapssl
1024/tcp open  kdm
3268/tcp open  globalcatLDAP
3269/tcp open  globalcatLDAPssl

Read data files from: /usr/bin/../share/nmap
Nmap done: 1 IP address (1 host up) scanned in 0.14 seconds
           Raw packets sent: 1000 (44.000KB) | Rcvd: 2014 (84.616KB)
```

smtp(25)とrpcbind(111)は不要そうなのでstopしました。

```console frame="none"
$ /etc/init.d/exim4 stop
Stopping MTA: exim4_listener.
$ /etc/init.d/rpcbind stop
Stopping rpcbind daemon....
```

不要なpackageを削除しました。

```console frame="none" wrap
---
# apt-get purge exim4 exim4-base exim4-config exim4-daemon-light exim4-daemon-heavy rpcbind nfs-common
---
# apt-get autoremove
```

## 💡 振り返り / 次回へのアクション

- promptをcolor表示するため、.bashrcを設定します。

## 🔗 参考資料

- [Debian 不安定版 (unstable) sid のインストール方法](http://d.hatena.ne.jp/igapyon/20120912)
- [Debian 言語設定](http://it-study.blogspot.jp/2010/11/debian.html)
- [さくらのVPSにDebian Wheezyを入れたら最低限やっておくこと](http://phase-d.com/blog/2013/06/debian_first_todo)
- [Debian 7.0 Wheezy - 日本語環境にする](http://www.server-world.info/query?os=Debian_7.0&p=japanese)
