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
> Samba4のsysvol（グループポリシー）をrsyncで別サーバへ同期する手順を確認します。

## 🧩 手順

グループポリシーの同期には`rsync`を利用します。

```console frame="none"
$ apt-get install rsync
```

続いてsshの公開鍵を作成します。同期先のrootユーザで/rootフォルダ以下で実行。

```console frame="none"
---
# ssh-keygen -t rsa -N "" -f .ssh/rsync-gpo
```

作成した公開鍵を`scp`コマンドで同期元サーバにコピーします。

```console frame="none"
---
# scp .ssh/rsync-gpo.pub takumuralocal@vm-ad02:~/
```


以下のコマンドを同期元で実行することで、グループポリシーを同期できます。

```console frame="none"
---
# rsync -e "ssh -p 30123" -naAXvu /usr/local/samba/var/locks/sysvol/ root@vm-ad02:/usr/local/samba/var/locks/sysvol/
```

一時的にrootへのログオンとパスワード認証をオンにしておけばテストできます。-nを付けると動作検証、外すと実際に同期されます。設定を即時反映させるときは以下のコマンドを実行します。

```console frame="none"
$ gpupdate /force
```

## 🔗 関連リンク

- [[🏃Debian 7.4.0（wheezy）にSamba4をinstallする]]
