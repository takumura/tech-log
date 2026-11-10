---
created: 2015-07-12
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
> Debian 7.4.0（wheezy）にて確認。[Debian wiki](https://wiki.debian.org/iptables)の手順を参考に、iptableを設定します。

## 🧩 詳細

1. 現在の状況を確認。defaultはすべて許可になっています。

```sh frame="none"
$ iptables -L
Chain INPUT (policy ACCEPT)
target     prot opt source               destination

Chain FORWARD (policy ACCEPT)
target     prot opt source               destination

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination
</code>
```

2.  http、ssh、sambaの設定を追記した`/etc/iptables.test.rules`を作成します。

```sh frame="code" title="iptables.test.rules" 
*filter

# Allows all loopback (lo0) traffic and drop all traffic to 127/8 that doesn't u
se lo0
-A INPUT -i lo -j ACCEPT
-A INPUT ! -i lo -d 127.0.0.0/8 -j REJECT

# Accepts all established inbound connections
-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Allows all outbound traffic
# You could modify this to only allow certain traffic
-A OUTPUT -j ACCEPT

# Allows SSH connection
# THE -dport NUMBER IS THE SAME ONE YOU SET UP IN THE SSHD CONFIG FILE
-A INPUT -p tcp -m state --state NEW --dport [SSHDのport番号] -j ACCEPT

# Now you should read up on iptables rules and consider whether ssh access
# for everyone is really desired. Most likely you will only allow access from ce
rtain IPs

# Allow ping
-A INPUT -p icmp -m icmp --icmp-type 8 -j ACCEPT

# log iptables denied calls (access via 'dmesg' command)
-A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables denied: " --log-level 7

# Allows samba4 ad dc
-A INPUT -m state --state NEW -m tcp -p tcp --dport 42 -j ACCEPT
-A INPUT -m state --state NEW -m tcp -p tcp --dport 53 -j ACCEPT
-A INPUT -m state --state NEW -m udp -p udp --dport 53 -j ACCEPT
-A INPUT -m state --state NEW -m tcp -p tcp --dport 88 -j ACCEPT
-A INPUT -m state --state NEW -m udp -p udp --dport 88 -j ACCEPT
-A INPUT -m state --state NEW -m udp -p udp --dport 123 -j ACCEPT
-A INPUT -m state --state NEW -m tcp -p tcp --dport 135 -j ACCEPT
-A INPUT -m state --state NEW -m udp -p udp --dport 137 -j ACCEPT
-A INPUT -m state --state NEW -m udp -p udp --dport 138 -j ACCEPT
-A INPUT -m state --state NEW -m tcp -p tcp --dport 139 -j ACCEPT
-A INPUT -m state --state NEW -m tcp -p tcp --dport 389 -j ACCEPT
-A INPUT -m state --state NEW -m udp -p udp --dport 389 -j ACCEPT
-A INPUT -m state --state NEW -m tcp -p tcp --dport 445 -j ACCEPT
-A INPUT -m state --state NEW -m tcp -p tcp --dport 464 -j ACCEPT
-A INPUT -m state --state NEW -m udp -p udp --dport 464 -j ACCEPT
-A INPUT -m state --state NEW -m tcp -p tcp --dport 636 -j ACCEPT
-A INPUT -m state --state NEW -m tcp -p tcp --dport 1024 -j ACCEPT
-A INPUT -m state --state NEW -m tcp -p tcp --dport 3268 -j ACCEPT
-A INPUT -m state --state NEW -m tcp -p tcp --dport 3269 -j ACCEPT


# Reject all other inbound - default denay unless explicitly allowed policy:
-A INPUT -j REJECT
-A FORWARD -j REJECT

COMMIT
```

3. 上記の設定を適用。

```sh frame="none"
$ iptables-restore < /etc/iptables.test.rules
$ iptables -L
```

4. iptables-persistentをinstallして、iptablesのruleを適用。

```sh frame="none"
$ apt-get install iptables-persistent
```
   これで、現在適用中のruleが/etc/iptables/rules.v4と/etc/iptables/rules.v6に出力され、ruleが適用されます。ただし、v6はdefaultのすべて許可状態のままです。

5. IPv6を無効にするため、`/etc/sysctl.conf`に追記を行います。

```sh frame="none"
$ cp /etc/sysctl.conf /etc/_sysctl.conf
$ vi /etc/sysctl.conf
$ sysctl -p
```

```sh frame="code" title="sysctl.conf"
# 中略
#
# 最終行
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1
net.ipv6.conf.lo.disable_ipv6 = 1
```

6. 最後にsystemをrebootし、設定が反映されたことを確認。

```sh frame="none"
$ reboot

# reboot後に再度login

$ iptables -L
```

## 🔗 参考資料

- [Debian wiki - iptables](https://wiki.debian.org/iptables)
- [Debian上でのiptablesの設定方法](http://d.hatena.ne.jp/mercysluck/20120211/p1)
- [Debian 7 の iptables と sshd の設定と IPv6 無効化メモ](http://hateda.hatenadiary.jp/entry/2013/05/30/235631)
- [Samba4によるAD構築メモ1](http://blog.shinkaku.co.jp/archives/34848816.html)
