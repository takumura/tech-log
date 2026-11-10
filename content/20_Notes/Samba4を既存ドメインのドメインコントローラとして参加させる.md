---
created: 2015-07-12
updated: 2026-10-11
type: evergreen
category: article
tags:
  - reference
  - tech/linux/debian/wheezy
  - tech/samba
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> Samba4を既存のActiveDirectoryドメインへドメインコントローラとして参加させる手順を確認します。

## 🧩 手順

[Samba wiki](http://wiki.samba.org/index.php/Join_a_domain_as_a_DC)を確認しながら作業を行います。

`/usr/local/samba/etc`に`smb.conf`がないことを確認します。次に`/etc/krb5.conf`と`/etc/resolv.conf`の設定を行い、既存ドメインへ接続できることを確認します。

```sh frame="code" title="krb5.conf"
[libdefaults]
        default_realm = METAL.LOCAL
        dns_lookup_realm = true
        dns_lookup_kdc = true

[realms]
        METAL = {
                kdc = vm-ad01.metal.local
                admin_server = vm-ad01.metal.local
        }

[domain_realm]
        .metal.local = METAL.LOCAL
        metal.local = METAL.LOCAL
```

`/etc/resolv.conf`にドメインservierのIPを記述します。

```sh frame="code" title="resolv.conf"
nameserver 192.168.24.5
nameserver 192.168.24.1
```

```console frame="none"
$ kinit administrator
Password for administrator@METAL.LOCAL:
```

正しく認証されると、`klist`コマンドで以下のように認証情報が表示されます。

```console frame="none"
$ klist
Ticket cache: FILE:/tmp/krb5cc_0
Default principal: administrator@METAL.LOCAL

Valid starting    Expires           Service principal
21/04/2014 22:41  22/04/2014 08:41  krbtgt/METAL.LOCAL@METAL.LOCAL
        renew until 22/04/2014 22:41
```

`samba-tool`コマンドでドメインに参加します。

```console frame="none"
[/usr/local/samba]$ ./bin/samba-tool domain join metal.local DC -Uadministrator --realm=metal.local

Finding a writeable DC for domain 'metal.local'
Found DC vm-ad01.metal.local
Password for [WORKGROUP\administrator]:

---
# 中略

Joined domain METAL as a DC
```

## 🔗 関連リンク

- [[🏃Debian 7.4.0（wheezy）にSamba4をinstallする]]
