---
created: 2026-10-25
updated: 2026-10-25
type: evergreen
category: article
tags:
  - reference
  - tech/linux/debian/trixie
  - tech/ide/vscode
  - tech/setup
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> VSCodeをDebian 13をインストールしたLaptopで使用できるようにします。

## 🧩 詳細

1. [公式セットアップガイド](https://code.visualstudio.com/docs/setup/linux)に従って、.debパッケージ: `code_1.143.1-1792691907_amd64.deb`をダウンロード。

2. apt installコマンドで.debパッケージをインストール。
```sh frame="none"
> sudo apt install ./code_1.143.1-1792691907_amd64.deb
```

> [!note]
> debパッケージをインストールするとmicrosoftのrepoとsigning keyも同時にセットアップされるので、更新はaptで管理します。

3. VSCodeを起動し、dockにピン止めします。

4. VSCodeの`Sign In`からgithubアカウントでサインインします。

## 🔗 参考資料

- [Install Visual Studio Code on Linux](https://code.visualstudio.com/docs/setup/linux)

