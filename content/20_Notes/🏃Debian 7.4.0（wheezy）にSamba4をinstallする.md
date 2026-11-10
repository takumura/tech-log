---
created: 2015-07-12
updated: 2026-10-11
type: snapshot
category: article
tags:
  - activity
  - tech/linux/debian/wheezy
  - tech/samba
publish: "true"
---
# 🏃 活動概要
> [!ABSTRACT] Overview
> Debian 7.4.0（wheezy）にて確認。`Samba4`をinstallし、WindowsServerで稼働済みのActiveDirectoryドメインにドメインコントローラとして参加します。

## 🧩 Samba4のbuild（必要packageを含む）

[[Debian 7.4.0（wheezy）でSamba4をソースからbuildする]]にまとめました。

## 🧩 既存ドメインへドメインコントローラとして参加する

[[Samba4を既存ドメインのドメインコントローラとして参加させる]]にまとめました。

## 🧩 設定の確認とservice起動

sambaの起動前にDNSの`A record`と`CNAME`を設定しました。
```console frame="none" wrap
[/usr/local/samba]$ ./bin/samba-tool dns add 192.168.24.5 metal.local vm-ad02 A 192.168.24.90 -Uadministrator
Password for [METAL\administrator]:
Record added successfully
```

```console frame="none" wrap
[/usr/local/samba]$ ./bin/ldbsearch -H /usr/local/samba/private/sam.ldb '(invocationid=*)' --cross-ncs objectguid
---
# record 1
dn: CN=NTDS Settings,CN=VM-AD01,CN=Servers,CN=Default-First-Site-Name,CN=Sites,CN=Configuration,DC=metal,DC=local
objectGUID: ee9b2fcf-e55e-453d-807b-a2c3bf88cd47

---
# record 2
dn: CN=NTDS Settings,CN=VM-AD02,CN=Servers,CN=Default-First-Site-Name,CN=Sites,CN=Configuration,DC=metal,DC=local
objectGUID: 83bb11e6-bb7d-43cd-bf58-9999187e687b
```

```console frame="none" wrap
[/usr/local/samba]$ ./bin/samba-tool dns add 192.168.24.5 _msdcs.metal.local 83bb11e6-bb7d-43cd-bf58-9999187e687b CNAME vm-ad02.metal.local -Uadministrator
Password for [METAL\administrator]:
Record added successfully
```

`/etc/resolv.conf`を修正し、自身のDNSサーバのIP addressを指すように設定しました。

```sh frame="code" title="resolv.conf"
domain metal.local
nameserver 127.0.0.1
```

`/usr/local/samba/etc/smb.conf`に`dns forwarder`を設定しました。

```sh frame="code" title="smb.conf"
---
# Global parameters
[global]
        dns forwarder = 192.168.24.1
        workgroup = METAL
        realm = metal.local
        netbios name = VM-AD02
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
```

sambaを起動し、無事に起動していることを確認。

```console frame="none" wrap
[/usr/local/samba]$ ./sbin/samba
```

[samba wiki](http://wiki.samba.org/index.php/Samba4/InitScript)を参考に起動scriptを作成しました。

```console frame="none"
$ wget "http://anonscm.debian.org/gitweb/?p=pkg-samba/samba.git;a=blob_plain;f=debian/samba.samba-ad-dc.init;h=3132d2e367675f822342a5b7bc2e50c046aa3b8f;hb=HEAD" -O /etc/init.d/samba-ad-dc
$ sed -i 's|/usr/sbin|/usr/local/samba/sbin|g' /etc/init.d/samba-ad-dc
$ sed -i 's|/etc/samba|/usr/local/samba/etc|g' /etc/init.d/samba-ad-dc
$ chmod 755 /etc/init.d/samba-ad-dc
$ update-rc.d samba-ad-dc defaults
```

samba-ad-dcのscriptに問題があるようなので、[RaspberryPi（Debian）にSAMBA4（v4.1.3）をインストールする（ActiveDirectoryのDCを構築する）](http://sheepdogjam.cocolog-nifty.com/blog/2014/01/raspberrypi-deb.html)を参考に修正を行いました。

```sh frame="code" title="samba-ad-dc"
#30行目
---
# SERVER_ROLE=`samba-tool testparm --parameter-name="server role"  2>/dev/null | tail -1`
SERVER_ROLE=`/usr/local/samba/bin/samba-tool testparm --parameter-name="server role" 2>/dev/null | tail -1`

#70行目
#　start-stop-daemon --stop --quiet --pidfile $SAMBAPID
start-stop-daemon --stop --quiet --name samba $SAMBAPID
```

変更を反映したら再起動を行い、起動時にsambaが自動的に開始することを確認しました。

## 🧩 機能確認

domain forestの機能levelの確認。

```console frame="none"
$ ./bin/samba-tool domain level show
Domain and forest function level for domain 'DC=metal,DC=local'

Forest function level: (Windows) 2008 R2
Domain function level: (Windows) 2008 R2
Lowest function level of a DC: (Windows) 2008 R2
```

FSMOの確認。

```console frame="none"
$ ./bin/samba-tool fsmo show
InfrastructureMasterRole owner: CN=NTDS Settings,CN=VM-AD01,CN=Servers,CN=Default-First-Site-Name,CN=Sites,CN=Configuration,DC=metal,DC=local
RidAllocationMasterRole owner: CN=NTDS Settings,CN=VM-AD01,CN=Servers,CN=Default-First-Site-Name,CN=Sites,CN=Configuration,DC=metal,DC=local
PdcEmulationMasterRole owner: CN=NTDS Settings,CN=VM-AD01,CN=Servers,CN=Default-First-Site-Name,CN=Sites,CN=Configuration,DC=metal,DC=local
DomainNamingMasterRole owner: CN=NTDS Settings,CN=VM-AD01,CN=Servers,CN=Default-First-Site-Name,CN=Sites,CN=Configuration,DC=metal,DC=local
SchemaMasterRole owner: CN=NTDS Settings,CN=VM-AD01,CN=Servers,CN=Default-First-Site-Name,CN=Sites,CN=Configuration,DC=metal,DC=local
```

## 🧩 ntpdの設定

[[Samba4 AD DCでntpdを設定する]]にまとめました。

## 🧩 グループポリシーの同期

[[Samba4のグループポリシーをrsyncで同期する]]にまとめました。

## 🔗 参考資料

- [Samba wiki - Build Samba](http://wiki.samba.org/index.php/Build_Samba)
- [Samba wiki - Join a domain as a DC](http://wiki.samba.org/index.php/Join_a_domain_as_a_DC)
- [RaspberryPi（Debian）にSAMBA4（v4.1.3）をインストールする（ActiveDirectoryのDCを構築する）](http://sheepdogjam.cocolog-nifty.com/blog/2014/01/raspberrypi-deb.html)
- [Ubuntu で Samba4 を試してみる ](http://zettai-non-sugar.blogspot.jp/2013/05/ubuntu-samba4.html)
- [Samba wiki - Time Synchronisation](https://wiki.samba.org/index.php/Time_Synchronisation#Configuring_Time_Synchronisation_on_Samba_Member_Servers)
