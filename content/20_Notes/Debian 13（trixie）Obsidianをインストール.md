---
created: 2026-01-12
updated: 2026-10-01
type: evergreen
category: article
tags:
  - reference
  - tech/linux/debian/trixie
  - tech/obsidian
  - tech/setup
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> ObsidianをDebian 13をインストールしたLaptopで使用できるようにします。Obsidian Gitプラグインの[インストール解説ページ](https://publish.obsidian.md/git-doc/Installation#Linux)では、Snapとflatpakは**not fully supported**とのこと。AppImageのみが**fully supported**とのことなので、まずはAppImageによるインストールを試します。

## 🧩 AppImageLauncherのインストール

AppImageの検索や自動更新ができるようなので、AppImageLauncherをインストールします。

公式githubの[Debian向けインストール手順](https://github.com/TheAssassin/AppImageLauncher/wiki/Install-on-Ubuntu-or-Debian)を確認。[Latest release](https://github.com/TheAssassin/AppImageLauncher/releases/tag/v3.0.0-beta-3)のページ（2026/1/12時点の最新は`Release v3.0.0-beta-3`）から[appimagelauncher_3.0.0-beta-2-gha287.96cb937_amd64.deb](https://github.com/TheAssassin/AppImageLauncher/releases/download/v3.0.0-beta-3/appimagelauncher_3.0.0-beta-2-gha287.96cb937_amd64.deb)を取得。

取得したdebパッケージをダブルクリックするとダイアログが表示されるので、インストールを選択。
   ![[20260112_debian13_setup_obsidian_01.png|700]]

AppImageのデータを配置するための`AppImage`フォルダをホームディレクトリに作成。

```console frame="none"
$ cd
$ mkdir AppImage
`````

AppImageファイルを保存するフォルダに、先ほど作成した`AppImage`フォルダを指定。
   ![[20260112_debian13_setup_obsidian_02.png|500]]

## 🧩 AppImage形式のObsidanをインストール

[GithubのObsidian Latest Release](https://github.com/obsidianmd/obsidian-releases/releases/)のページ（2026/1/12時点の最新は`1.10.6`）から[Obsidian-1.10.6.AppImage](https://github.com/obsidianmd/obsidian-releases/releases/download/v1.10.6/Obsidian-1.10.6.AppImage)を取得。

ダウンロードしたAppImage形式のファイルをホームディレクトリ直下の`AppImage`フォルダに移動し、AppImageファイルをダブルクリックするとObsidianが起動します。`QuickStart`を選択すると`ホームディレクトリ/ドキュメント`フォルダ以下にVaultが作成されました。

## 🧩 Git cloneによるVaultデータの取得

Githubのレポジトリをクローンする`github-repos`フォルダをホームディレクトリに作成。GithubにpushしているVaultデータを取得します。
```console frame="none"
$ cd
$ mkdir github-repos
$ cd github-repos
$ git clone git@github.com:takumura/Obsidian-Notebook.git
`````

Obsidianの画面左下部をクリックし`Manage valuts...`を選択。表示される画面で`Open folder as vault`を選択し、cloneしたVaultを開きます。これでデフォルトの.obsidianフォルダが作成され、初期設定のjsonファイルが作成されました。

一旦Obsidianを終了し、ホストマシンのwindowsで運用中のObsidian Vaultから.obsidianフォルダをコピーして入れ替えを実施。Obsidianを起動するとcommunity pluginやThemeの設定をLinuxに移行することができました。

.gitignoreが正しく読み込まれないためか、初回起動時に.obsidianフォルダ以下のファイルが変更としてマークされました。もう一度Obsidianを起動し直したら表示されなくなりました。

### Gitプラグインの設定

gitプラグインの設定画面で設定変更。詳細は[[Obsidian Plugin - Obsidian Git]]を参照してください。

## 🧩 テーマの導入とカスタム設定

Minimalテーマを導入します。手順の詳細は[[Obsidian Minimalテーマの導入とカスタム設定]]を参照してください。

## 🔗 参考資料

- [Obsidian Git Plugin - Github](https://github.com/Vinzent03/obsidian-git?tab=readme-ov-file#obsidian-on-linux)
- [Software Overview - AppImage](https://docs.appimage.org/introduction/software-overview.html#appimagelauncher)
- [AppImageLauncher - Github](https://github.com/TheAssassin/AppImageLauncher)
