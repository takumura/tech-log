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
> Debian上でSamba4をソースからbuildする手順を確認します。

## 🧩 必要packageのinstall

[Sambaの導入ガイド](http://wiki.samba.org/index.php/Binary_Distribution_Packages)によると、[wheezy-backports](https://packages.debian.org/de/wheezy-backports/samba)から`Samba4.1.6`が導入できるようですが、今回はソースからbuildします。

`Samba4`に必要なpackageを[samba wiki](http://wiki.samba.org/index.php/Samba_4/OS_Requirements)から確認し、apt-getします。
```console frame="none" wrap
$ apt-get install build-essential libacl1-dev libattr1-dev libblkid-dev libgnutls-dev libreadline-dev python-dev python-dnspython gdb pkg-config libpopt-dev libldap2-dev dnsutils libbsd-dev attr krb5-user docbook-xsl libcups2-dev acl libpam0g-dev
```

実行中に`Congiguring Kerberos Authentication`のプロンプトが表示されるので、localのDNSドメインとして`METAL`を入力。続けて`Kerberos server`として、ADサーバ名を入力。

## 🧩 build

Debianのsiteから、2014/4/21時点の最新（4.1.7）を取得、展開します。

```console frame="none"
$ cd /tmp
$ wget http://ftp.samba.org/pub/samba/stable/samba-4.1.7.tar.gz
$ tar -zxvf samba-4.1.7.tar.gz
```

解凍した`samba-4.1.7`ディレクトリ下で、`configure`と`make`を行います。処理が重くなりそうですが、推奨されている`enable-debug`と`enable-selftest option`を付けました。

```console frame="none"
$ ./configure --enable-debug --enable-selftest
$ make
$ make install
```

## 🔗 関連リンク

- [[🏃Debian 7.4.0（wheezy）にSamba4をinstallする]]
