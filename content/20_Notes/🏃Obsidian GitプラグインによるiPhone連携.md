---
created: 2025-05-10
updated: 2026-08-29
type: snapshot
category: article
tags:
  - activity
  - tech/obsidian
  - tech/device/iphone
publish: "true"
---
# 🏃 活動概要
> [!ABSTRACT] Overview
> iPhoneでObsidianをGitを用いて同期させるための設定を確認します。iCloud等のファイル競合問題を回避し、無料でセキュアにVaultを共有する手法について記録します。

## 🧩  作業の背景

iPhoneでもObsidianを使えるようにします。

作業開始前に事例を検索。当初はiCloudやOneDriveにファイルを置いてiPhoneと連携することを考えていたのですが、競合が頻繁に発生して不便とのコメントが多く、採用を見送りました。

iPhoneでGit push可能な無料appが無い（pushするのに課金が必要）ようでしたので躊躇っていたところ、[スマホのObsidianをGitで同期(2024.11)](https://zenn.dev/ishikawa096/articles/158246fc5a5d62) という記事を見かけました。無料でトライできて敷居も低いので、まずはこの方法を試してみる事にしました。

## 🧩 Desktop PC側の作業

### Obsidianでコミュニティプラグイン[Git](https://github.com/Vinzent03/obsidian-git)のインストール

手順は[公式installationページ](https://publish.obsidian.md/git-doc/Installation)を参考にしました。

### Obsidian同期用のgitリポジトリ作成

- github上にprivateなrepository: Obsidian-Notebookを作成。
- 作成したObsidian-Notebookのrepositoryをクローン。
	- SSHキーが無効になっていることに気が付き、[[GithubのSSHキー作成]]の対応を実施。
- 現在作業中のVaultを、一旦Obsidian-Notebookに移動。
- `.gitignore`ファイルを追加してremoteにpush。
	- `.gitignore`では`.obsidian/`と一行追記し、コンフィグフォルダを対象外にしました。
	- Desktop PC, iPhone共に同じ`.obsidian`フォルダを利用し、設定は各環境毎に行うことにしました。
- git管理されたVaultをObsidianで開きなおし、変更のcommit/pushを確認。
	- gitプラグインの設定を修正。詳細は[[Obsidian Plugin - Obsidian Git]]を参照。

## 🧩 iPhone側の作業

### Obsidian appのインストール

- App storeからObsidianをインストール。
- Appを起動し、`Create new vault`を選択。
- 作業用フォルダをiPhoneに作成。
	- Vault名は一旦`Notebook`としました。
	- `ファイル`アプリから、`このiPhone内`にObisidianフォルダが作成されていることを確認。
- Decktop PCと同様に、コミュニティプラグイン [Git](https://github.com/Vinzent03/obsidian-git) をインストール。
- [Gitプラグインはssh認証に非対応](https://github.com/Vinzent03/obsidian-git?tab=readme-ov-file#-mobile-limitations)なので、アクセスに必要なPATをGithubにて作成。
	- fine-grained token
	- 有効期限: 1年間
	- Obsidian-NotebookリポジトリのRepository Permission: contents=`Read and write`
-  iPhoneに戻り、コミュニティプラグイン [Git](https://github.com/Vinzent03/obsidian-git) の設定画面で`username`と`PAT`をセット。
	- `username`=Gitのアカウント名とPATをセット。

### Git cloneによるVaultデータの取得

- `Open command palette` > `Git: Clone an existing remote repo` を選択。
- `Enter remote URL`フィールドにリポジトリのHTTPS git URLを入力。
- `Enter directory for clone, It needs to be...`と聞かれるので、`Vault root`を選択。
- `Dose your remote repo contain a .obsidian...`と聞かれるので、`No`を選択。
	- `.obsidian`をpushしない設定にしているため、remote repoには存在しません。
- `Specify depth of clone. Leave empty for full`と聞かれるので、emptyのまま`done`を選択。

上記の手順でcloneが正常終了した。続けて、gitプラグインを設定。

### Gitプラグインの設定

gitプラグインの設定画面で、desktop PCと全く同じように設定変更。詳細は[[Obsidian Plugin - Obsidian Git]]を参照。

### desktopとのデータ連携確認

動作確認としてdesktop側変更のpullとiPhoneからのpushを実施。変更が想定通り同期されることを確認しました。

## 💡 振り返り / 次回へのアクション

- Gitプラグインの設定をterm note切り出して管理します。
	- [x] [[Obsidian Plugin - Obsidian Git]]の作成
- 複数端末での同期時に競合が発生した場合、修正が大変でした。課題と対策をNoteにまとめます。
	- [x] [[Git運用ルール]]作成

## 🔗 参考資料

- [スマホのObsidianをGitで同期(2024.11)](https://zenn.dev/ishikawa096/articles/158246fc5a5d62) 
- [Obsidian for iPhone でも Github 連携したい](https://note.com/sho7650/n/n9f8657c7aa81)
- [結局行き着いた .gitignore](https://note.com/sho7650/n/nbbc6976103ff)
