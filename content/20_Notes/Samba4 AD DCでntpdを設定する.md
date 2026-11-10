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
> Samba AD DCでntpdを稼働させる条件と設定を確認します。

## 🧩 前提条件

ntpサーバが稼働していない場合、しばらくマシンを稼働していると時刻がズレはじめました。また、Hyper-Vの仮想マシン上でsambaを実行していると、Hyper-V server停止後に再起動した際に大きく時刻がズレることがありました。

起動状態を保存しているのが原因かと思い、Hyper-V serverの停止時に仮想マシンがシャットダウンされるように設定しても、結果は変わらずでした。

### 解決策

ntpdを稼働させ、時刻を正しく同期させる必要がありました。また、Samba AD DCでntpdを利用する場合は、署名されたntp(signed ntp)をサポートするバージョン（4.2.6以降）を利用する必要があります。また、udp 123番ポートを使用するので、iptablesの設定を確認してください。

## 🧩 ntpdの設定

Debian Wheezyのapt-getでinstallされるntpのversionは、`4.2.6`なので本versionで問題ありません。

```console frame="none"
$ apt-cache show ntp
Package: ntp
Version: 1:4.2.6.p5+dfsg-2
Installed-Size: 1181
Maintainer: Debian NTP Team <pkg-ntp-maintainers@lists.alioth.debian.org>
Architecture: i386
...

$ apt-get install ntp
```

`/usr/local/samba/var/lib/ntp_signed`ソケットに対して、ntpd実行user（=ntp）が読み取り可能な必要があります。そうなっていなかったのでgroup userを変更。

```console frame="none"
$ ls -ld /usr/local/samba/var/lib/ntp_signd/
drwxr-s--- 2 root staff 4096 Jun 23 01:06 /usr/local/samba/var/lib/ntp_signd/

$ chgrp ntp /usr/local/samba/var/lib/ntp_signd/

$ ls -ld /usr/local/samba/var/lib/ntp_signd/
drwxr-s--- 2 root ntp 4096 Jun 23 01:06 /usr/local/samba/var/lib/ntp_signd/
</code>
```

`/etc/ntp.conf`を以下のように変更し、再起動を実施。

```shell frame="code" title="ntp.conf"
---
# Local clock (this is not the localhost address!)
server 127.127.1.0
fudge  127.127.1.0 stratum 10


---
# The source, where we are receiving the time from
server ntp.nict.jp     iburst prefer


driftfile       /var/lib/ntp/ntp.drift
logfile         /var/log/ntp
ntpsigndsocket  /usr/local/samba/var/lib/ntp_signd/


---
# Access control
---
# Default restriction: Only allow querying time (incl. ms-sntp) from this machine
restrict default kod nomodify notrap nopeer mssntp

---
# Allow everything from localhost
restrict 127.0.0.1

---
# Allow that our time source can only provide time and do nothing else
restrict server ntp.nict.jp   mask 255.255.255.255    nomodify notrap nopeer noquery
```

```console frame="none"
$ /etc/init.d/ntp restart
[ ok ] Stopping NTP server: ntpd.
[ ok ] Starting NTP server: ntpd.
```

PDCではない、メンバーサーバの`ntp.conf`は以下のように設定します。

```shell frame="code" title="ntp.conf"
---
# Local clock (this is not the localhost address!)
server 127.127.1.0
fudge  127.127.1.0 stratum 10


---
# The source, where we are receiving the time from
server nas01.metal.local iburst prefer
server ntp.nict.jp     iburst


driftfile       /var/lib/ntp/ntp.drift
logfile         /var/log/ntp
ntpsigndsocket  /usr/local/samba/var/lib/ntp_signd/


---
# Access control
---
# Default restriction: Only allow querying time (incl. ms-sntp) from this machine
restrict default kod nomodify notrap nopeer mssntp

---
# Allow everything from localhost
restrict 127.0.0.1

---
# Allow that our time source can only provide time and do nothing else
restrict server nas01.metal.local   mask 255.255.255.255    nomodify notrap nopeer noquery
restrict server ntp.nict.jp   mask 255.255.255.255    nomodify notrap nopeer noquery
```

## 🧩 動作確認

windowsクライアントの状態は`w32tm`コマンドで確認します。

```console frame="none"
> w32tm /resync
再同期コマンドをローカル コンピューターに送信しています
コマンドは正しく完了しました。

> w32tm /query /verbose /status
閏インジケーター: 0 (警告なし)
階層: 4 (二次参照 - (S)NTP で同期)
精度: -6 (ティックごとに 15.625ms)
ルート遅延: 0.0511475s
ルート分散: 0.1193777s
参照 ID: 0xC0A8185A (ソース IP:  192.168.24.90)
最終正常同期時刻: 2014/07/06 15:44:19
ソース: vm-ad02.metal.local
ポーリング間隔: 10 (1024s)

フェーズ オフセット: 0.2011545s
クロック レート: 0.0156248s
State Machine: 2 (同期)
タイム ソース フラグ: 2 (認証済み )
サーバーのロール: 0 (なし)
最終同期エラー: 0 (コマンドは正しく完了しました。)
最終正常同期時刻からの時間: 12.4726069s

> w32tm /query /peers
ピア数: 1

ピア: vm-ad02.metal.local
状態: アクティブ
残り時間: 99.4920890s
モード: 3 (クライアント)
階層: 3 (二次参照 - (S)NTP で同期)
ピアポーリング間隔: 8 (256s)
ホストポーリング間隔: 9 (512s)
```

Hyper-Vの仮想クライアントマシンについて、どうしても起動時に時刻がズレており、ntpdで調整するにはズレが大きすぎるためローカルクロックが使われてしまうという問題がありました。暫定対応として、ntpdの実行スクリプトにてstart時にntpdateしてからntpdを開始するようにしました。

## 🔗 関連リンク

- [[🏃Debian 7.4.0（wheezy）にSamba4をinstallする]]

## 🔗 参考資料

- [Samba wiki - Time Synchronisation](https://wiki.samba.org/index.php/Time_Synchronisation#Configuring_Time_Synchronisation_on_Samba_Member_Servers)
