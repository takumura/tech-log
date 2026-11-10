---
created: 2025-11-08
updated: 2026-10-01
type: evergreen
category: article
tags:
  - reference
  - tech/linux/debian/trixie
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> Obsidianをgithubで管理しているので、gitをインストールしてgithubからrepositoryをクローンします。Windowsと同様にsshで接続し、sshのキーフレーズは意識せずに運用できるようにします。歴史的な経緯によりWindowsより設定が複雑になっています。

## 🧩 gitのインストール

aptを使ってgitをインストール。
```console frame="none"
$ sudo apt install git
```

## 🧩 ssh keyの配置

Githubには複数の同一名称sshキーを登録できませんでした。別名でsshキーを作成したら良いようですが、
windowsからのgithub接続時に作成したsshキー使いまわすことにします。

`id_ed25519`と`id_ed25519.pub`の2つのファイルを`/home/takumuralocal/.ssh/`以下に配置。ファイルのパーミッションを以下のように変更。
```console frame="none"
$ chmod 600 ~/.ssh/id_ed25519
$ chmod 644 ~/.ssh/id_ed25519.pub
```

## 🧩 公開鍵をgithubに登録

githubにログインし、`Settings` > `SSH and GPG keys`に進み、作成したssh公開鍵を登録します。windowsからのgithub接続時に設定済みのため、今回は作業不要でした。

## 🧩 ssh-agentの設定

[Redditの投稿](https://www.reddit.com/r/archlinux/comments/1avuxcw/psa_gnome_keyring_1461_may_break_your_sshagent/)より、Gnome Keyringのssh agentについての設定変更が必要とのことなので試してみます。

`/lib/systemd/user-environment-generators/`に`90-gpg-agent`というファイルを作成。

```sh frame="code" title="90-gpg-agent"
#!/bin/bash

echo SSH_AUTH_SOCK=${XDG_RUNTIME_DIR}/gcr/ssh
echo GSM_SKIP_SSH_AGENT_WORKAROUND=true
```

ファイルを作成後、ファイルのパーミッションを755に変更して再起動。

```console frame="none"
$ sudo chmod 755 `90-gpg-agent`
$ sudo reboot
`````

## 🧩 Gnome Keyringの準備

> [!tips] 
> 以下の設定は不要かもしれません。次回作業時に要確認とします。

[ArchLinuxのKeyring解説](https://wiki.archlinux.org/title/GNOME/Keyring#SSH_keys)より、

> To use automatic unlocking **without automatic login**, the password for the user account should be the same as the _login_ keyring. See [Automatically change keyring password with user password](https://wiki.archlinux.org/title/GNOME/Keyring#Automatically_change_keyring_password_with_user_password).

とのことなので、Keyringのパスワードとアカウントのログインパスワードを共通にします。

`6.7 Automatically change keyring password with user password`によると`/etc/pam.d/passwd`を修正すれば良いようです。
```sh frame="code" title="/etc/pam.d/passwd"
...
password	optional	pam_gnome_keyring.so
```

## 🧩 ssh-agentへの鍵登録

> [!tips] 
> 最初のssh-agentによる登録ステップは後に不要と判明しました。ssh接続確認から開始すればokです。

まずは現在のシェルでssh-agentを起動します。

```console frame="none"
$ eval "$(ssh-agent -s)"
`````

秘密鍵をagentへ登録。登録時にパスフレーズを聞かれるので入力します。

```console frame="none"
$ ssh-add ~/.ssh/id_ed25519
`````

登録済みのキーは以下のコマンドで確認できます。Gnome keyringのOpenSSH鍵欄にもid_ed25519の設定が保存されていることを確認。

```console frame="none"
$ ssh-add -L
`````

ssh接続確認を実施。パスフレーズを入力することなく`successfully authenticated`のメッセージが返却されました。

```console frame="none"
$ ssh -T git@github.com
`````

再起動後にもう一度ssh接続確認を実施するも、ロック解除のダイアログが表示されます。
   ![[20251109_debian13_connect_to_github_01.png|500]]

秘密鍵のパスフレーズを入力するとssh接続に成功します。`ログイン中はいつでもこの鍵のロックを自動的に解除`にチェックを入れるとGnome keyringのLogin欄にid_ed25519の設定が保存されました。
   ![[20251109_debian13_connect_to_github_02.png|700]]

以降はrebootしてもパスフレーズを聞かれることなく、githubにsshで接続できるようになりました。

## 🔗 参考資料

- [GNOME/Keyring | ArchLinux](https://wiki.archlinux.org/title/GNOME/Keyring#SSH_keys)
- [PSA: GNOME Keyring 1:46.1 may break your ssh-agent](https://www.reddit.com/r/archlinux/comments/1avuxcw/psa_gnome_keyring_1461_may_break_your_sshagent/)
- [GitHubにSSHで接続する](https://toshiocp.com/entry/2022/08/15/170456)
- [GitHubにSSH接続できない](https://terakoya.sejuku.net/question/detail/51686)
