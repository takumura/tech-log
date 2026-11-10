---
created: 2015-07-12
updated: 2026-10-01
type: evergreen
category: article
tags:
  - reference
  - tech/linux/debian/wheezy
  - tech/setup
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> [[🏃Debian 7.4.0（wheezy）のinstall]]で、install時にsetupしたSSHサーバへの接続設定を行います。ターミナルクライアントにはputtyを利用します。

## 🧩 クライアント側設定

1. puttygen.exeを利用してSSH鍵を生成します。
	- 生成する鍵の種類: `SSH-2 RSA`
	- 鍵のcomment: `rsa-key-20140415`
	- pass phrase: 適切に設定
	- 秘密鍵: `id_rsa.ppk`という名前で保存
	- 公開鍵: `id_rsa.pub`という名前で保存
2. sshdは起動しているので、WinSCPを利用して公開鍵(`id_rsa.pub`をサーバ側へ転送します。転送先はlocal作業ユーザのhome directoryです。

## 🧩 サーバ側設定

1. puttyを使って、SSHでlocal作業ユーザにloginします。login後、local作業ユーザのhome directoryに.sshがpermission700で存在するか確認、なければ作成します。

```sh frame="none"
$ mkdir .ssh
$ chmod 700 .ssh
```

2. `ssh-keygen`コマンドを使用して公開鍵をOpenSSHで利用できるように変換します。変換後の鍵名を`authorized_keys`とします。authorized_keysのpermissionは`600`です。

```sh frame="none"
$ ssh-keygen -i -f id_rsa.pub >> ./.ssh/authorized_keys
$ chmod 600 ./.ssh/authorized_keys
```

3. root権限で/etc/ssh/sshd_configの設定を編集します。
	- PermitRootLogin: `yes`を`no`に変更。
	- PasswordAuthentication: `yes`を`no`に変更。

```sh frame="code" title="sshd_config"
---
# Package generated configuration file
---
# See the sshd_config(5) manpage for details

---
# What ports, IPs and protocols we listen for
Port [適切なport番号]
---
# Use these options to restrict which interfaces/protocols sshd will bind to
#ListenAddress ::
#ListenAddress 0.0.0.0
Protocol 2
---
# HostKeys for protocol version 2
HostKey /etc/ssh/ssh_host_rsa_key
HostKey /etc/ssh/ssh_host_dsa_key
HostKey /etc/ssh/ssh_host_ecdsa_key
#Privilege Separation is turned on for security
UsePrivilegeSeparation yes

---
# Lifetime and size of ephemeral version 1 server key
KeyRegenerationInterval 3600
ServerKeyBits 768

---
# Logging
SyslogFacility AUTH
LogLevel INFO

---
# Authentication:
LoginGraceTime 120
---
# PermitRootLogin yes
PermitRootLogin no
StrictModes yes

RSAAuthentication yes
PubkeyAuthentication yes
#AuthorizedKeysFile     %h/.ssh/authorized_keys

---
# Don't read the user's ~/.rhosts and ~/.shosts files
IgnoreRhosts yes
---
# For this to work you will also need host keys in /etc/ssh_known_hosts
RhostsRSAAuthentication no
---
# similar for protocol version 2
HostbasedAuthentication no
---
# Uncomment if you don't trust ~/.ssh/known_hosts for RhostsRSAAuthentication
#IgnoreUserKnownHosts yes

---
# To enable empty passwords, change to yes (NOT RECOMMENDED)
PermitEmptyPasswords no

---
# Change to yes to enable challenge-response passwords (beware issues with
---
# some PAM modules and threads)
ChallengeResponseAuthentication no

---
# Change to no to disable tunnelled clear text passwords
#PasswordAuthentication yes
PasswordAuthentication no

---
# Kerberos options
#KerberosAuthentication no
#KerberosGetAFSToken no
#KerberosOrLocalPasswd yes
#KerberosTicketCleanup yes

---
# GSSAPI options
#GSSAPIAuthentication no
#GSSAPICleanupCredentials yes

X11Forwarding yes
X11DisplayOffset 10
PrintMotd no
PrintLastLog yes
TCPKeepAlive yes
#UseLogin no

#MaxStartups 10:30:60
#Banner /etc/issue.net

---
# Allow client to pass locale environment variables
AcceptEnv LANG LC_*

Subsystem sftp /usr/lib/openssh/sftp-server

---
# Set this to 'yes' to enable PAM authentication, account processing,
---
# and session processing. If this is enabled, PAM authentication will
---
# be allowed through the ChallengeResponseAuthentication and
---
# PasswordAuthentication.  Depending on your PAM configuration,
---
# PAM authentication via ChallengeResponseAuthentication may bypass
---
# the setting of "PermitRootLogin without-password".
---
# If you just want the PAM account and session checks to run without
---
# PAM authentication, then enable this but set PasswordAuthentication
---
# and ChallengeResponseAuthentication to 'no'.
UsePAM yes
```

4. `sshd_config`編集後、sshdを再起動。

```console frame="none"
$ /etc/init.d/ssh reload
```

5. 最後に`id_rsa.pub`を削除します。

## 🧩 クライアント利用手順

1. puttyを起動し、事前に作成したサーバ接続設定を読み込みます。作成していなければ作成してください。
2. `カテゴリ`の`接続` > `SSH` > `認証`にて、`認証のためのプライベートキーファイル`に`id_rsa.ppk`を設定します。
3. 設定を保存してloginすると、以下のように公開鍵認証でloginする旨のmessageが表示されます。

```sh frame="none"
login as: takumura

Authenticating with public key "rsa-key-20140415"
Passphrase for key "rsa-key-20140415":[pass phraseを入力]
```

## 🔗 参考資料

- [|PuTTY で鍵交換方式による SSH 接続](http://www.kuins.kyoto-u.ac.jp/news/47/putty-gen.html)
- [SSHで公開鍵認証を使う](http://www.pistolfly.com/weblog/2007/02/ssh.html)
