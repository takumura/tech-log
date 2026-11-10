---
created: 2025-05-10
updated: 2026-10-01
type: evergreen
category: article
tags:
  - reference
  - tech/scm/github
  - tech/ssh/openssh
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> githubの接続にはhttpsとsshが利用できます。SSHを利用するために必要なキーを作成し、有効化するための手順をまとめます。

## 🧩 作業の背景

いつの間にかGithubに登録していたsshキーがdropされていました。[Checking for existing SSH keys - Github](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/checking-for-existing-ssh-keys#checking-for-existing-ssh-keys)によるとinsecureなキーを無効化したということなので、2019年当時に作成したキーに問題があったのかもしれません。新たなSSHキーを作成し有効化します。

## 🧩 新たなSSHキーの作成

[Generating a new SSH key and adding it to the ssh-agent](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)を参考に作業を実施。Ed25519アルゴリズムでSSHキーを作成。

```sh frame="none"
> ssh-keygen -t ed25519 -C "takumura@outlook.com"
Generating public/private ed25519 key pair.
Enter file in which to save the key (C:\Users\picas/.ssh/id_ed25519):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in C:\Users\picas/.ssh/id_ed25519
Your public key has been saved in C:\Users\picas/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:tYKrO1TaCr7QiMn2BzOiG+fci1GfDCdRv2lI95k30+o takumura@outlook.com
The key's randomart image is:
+--[ED25519 256]--+
|      .          |
|     . .         |
|    . . o .      |
|     o.+ = + .   |
|    +++ S = + .  |
|o=.=o*.+ . . +   |
|B+=o+.=     .    |
|o*o+oo     .     |
|..=o*+      E    |
+----[SHA256]-----+
```

作成したSSHキーをssh agentに追加。

```sh frame="none"
> cd c:\Users\<username>\.ssh
> ssh-add .\id_ed25519
Enter passphrase for .\id_ed25519:
Identity added: .\id_ed25519 (takumura@outlook.com)
```

## 🧩 作成したSSHキーをGithubアカウントに追加

[# Adding a new SSH key to your GitHub account](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)を参考に作業を実施。

publicキーの内容をクリップボードにコピー。

```sh frame="none"
> cat ~/.ssh/id_ed25519.pub | clip
```

Githubにログインし、`Settings` > `Access` > `SSH and GPG keys` > `New SSH key` の画面に移動し、今回作成したキーをアカウントに紐づけました。

## 🧩 環境変数の追加

登録したはずのパスフレーズがうまく利用されない問題が発生。gitコマンドでremoteへアクセス時に毎回再入力ダイアログが表示されました。

環境変数`GIT_SSH`を追加することで解決しました。

`コントロールパネル` > `ユーザアカウント` > `環境変数の変更`から、ユーザ環境変数`GIT_SSH`を追加。
- variable: GIT_SSH
- value: C:\Windows\System32\OpenSSH\ssh.exe

## 🔗 参考資料

- [エドワーズ曲線デジタル署名アルゴリズム - WIkipedia](https://ja.wikipedia.org/wiki/%E3%82%A8%E3%83%89%E3%83%AF%E3%83%BC%E3%82%BA%E6%9B%B2%E7%B7%9A%E3%83%87%E3%82%B8%E3%82%BF%E3%83%AB%E7%BD%B2%E5%90%8D%E3%82%A2%E3%83%AB%E3%82%B4%E3%83%AA%E3%82%BA%E3%83%A0)
