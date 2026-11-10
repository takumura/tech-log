---
created: 2015-07-12
updated: 2026-10-01
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
> `FSMO`（Flexible Single Master Operation）の役割を持っているサーバをSamba4で稼働しているドメインサーバに移行する方法を確認します。

## 🧩 手順

`FSMO`の役割を持たせたいサーバにloginし、以下のコマンドを実行。
```console frame="none"
$ cd /usr/local/samba/bin/
$ ./samba-tool fsmo seize --role=all
$ ./samba-tool fsmo show
```

## 🔗 参考資料

- [samba wiki - FSMO role transfer](http://wiki.samba.org/index.php/Join_a_domain_as_a_DC#FSMO_role_transfer)
- [Active DirectoryのFSMO役割をほかのDCへ転送する（GUI編）](http://www.atmarkit.co.jp/fwin2k/win2ktips/1172fsmotrans/fsmotrans.html)
