---
created: 2017-01-30
updated: 2026-10-01
type: snapshot
category: article
tags:
  - activity
  - tech/linux/debian/wheezy
publish: "true"
---
# 🏃 活動概要
> [!ABSTRACT] Overview
> 2016/12に発生していたSecurityパッチを放置していたので、`samba 4.5.4`へのアップグレードを実施しました。

## 🧩 詳細

samba version4.5.4をダウンロードし、ビルドとインストールを実施。

```console frame="none"
root@vm-ad02:/tmp# wget https://ftp.samba.org/pub/samba/stable/samba-4.5.4.tar.gz
root@vm-ad02:/tmp# tar -zxvf samba-4.5.4.tar.gz
root@vm-ad02:/tmp/samba-4.5.4# ./configure
root@vm-ad02:/tmp/samba-4.5.4# make
root@vm-ad02:/tmp/samba-4.5.4# /etc/init.d/samba-ad-dc stop
root@vm-ad02:/tmp/samba-4.5.4# make install
root@vm-ad02:/tmp/samba-4.5.4# /usr/local/samba/bin/samba-tool dbcheck --cross-ncs
root@vm-ad02:/tmp/samba-4.5.4# /etc/init.d/samba-ad-dc start
```

## 💡 振り返り / 次回へのアクション

以前は`./configure`時に`--enable-debug`と`--enable-selftest`のオプションをつけていたのですが、samba wikiの記述から無くなっていたので、今回はこれらを付けずに実行しました。

また、samba-tool dbcheckで大量にerrorとなったので--fixをつけて実行し、エラーを解消しました。コンソールのログには以下のように表示されました

```console frame="none"
# Checked 3513 obj
```
