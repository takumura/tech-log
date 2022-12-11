---
title: "新開発マシンへの移行手順を標準化する"
date: "2022-12-11"
category: "環境設定"
tag:
  - windows 11
  - setup
  - scoop
---

STORMのBTOパソコンを購入しました。メインマシンとしてセットアップした際の手順をまとめます。

## 新PCのスペック確認

STORMのBTOパソコンを注文しました。
| Parts | Spec |
| --- | --- |
|商品名| [ST-12C](https://www.stormst.com/products/detail/1643) |
|CPU | Core i7-12700 |
|MEM | Crucial CT8G4DFS632A.M4FB 8GB x2 |
|m.2 ssd | Crucial P5 Plus 500GB PCIe M.2 2280SS SSD |
|MB | MSI B660M-P DDR4 |
|BOX | Fractal Design Define 7 Compact |
|Graphic | Radeon RX460 2GB(旧マシンからの流用) |

## データ移行が必要なもの

### browser bookmark

- Edgeに生活用のbookmarkをまとめてexport/import
- その他はbraveで同期する

### その他

- synkron portable
- Hyper-Vの設定

## セットアップログ

### Windows 11のインストール

- [x] Windows11のインストールメディア（USB）を作成する
- [x] USBメディアを使用してOSをインストール
- [x] インターネットに接続し、Microsoftアカウントにサインイン
- [x] ライセンス認証をアクティブ化
  - 廃棄予定のデバイスに使用していた「Microsoftアカウントにリンクされたデジタルライセンス」を移行して解決

### デバイスドライバの更新

- [x] [MSI Center](https://www.msi.com/Landing/MSI-Center)を利用してドライバの更新
- [x] Radeon graphic driver Adrenalin 22.5.1

### ネットワークドライブの割り当て

スクリプトは使わずに手動で実施。改善案はあるのか？

### scoopによるappインストール

[scoopを用いた環境セットアップスクリプト](doc/env/use-scoop#scoopを用いた環境セットアップスクリプト)<!--rehype:class=internal-link-->でインストールやセットアップをまとめたPowerShellスクリプトを作成していたのですが、すっかり忘れて手動でコマンドを実行していました。。

scoopをWindows Terminalからインストール

``` powershell
## plese run following command if error occured for running powershell script.
## set-executionpolicy unrestricted -s cu

# install scoop to "c:\Apps\scoop" folder
$env:SCOOP='C:\Apps\scoop'
[environment]::setEnvironmentVariable('SCOOP',$env:SCOOP,'User')
Invoke-Expression (New-Object System.Net.WebClient).DownloadString('https://get.scoop.sh')

# install git to add bucket
scoop install git

# add extras bucket
# Error happenes when adding extras bucket, need to remove and re-add main bucket first.
# Please see https://github.com/ScoopInstaller/Scoop/issues/4917
scoop bucket rm main
scoop bucket add main
scoop bucket add extras

# utils
scoop install 7zip keepass appbuster avidemux crystaldiskinfo crystaldiskmark geekuninstaller

# dev tools
scoop install nvm fork curl winmerge fiddler
```

[Apps](https://scoop.sh/#/apps)のページを使うと、どの`app`がどの`bucket`に含まれているか検索ができて便利。

TODO: 今回の作業をもとに、環境設定用のPowerShell scriptをアップデートする。

> しました -> [Scoop scripts](https://gist.github.com/takumura/f897ab722e0d55523243dcfe7a51d4c1)

### scoopでインストールできないapp(インストーラー利用)

インストーラーを利用して以下のappをインストール

- [x] Brave
  - Brave Syncでお気に入りを同期
- [x] Visual Studio Code
- [x] OneDrive
- [x] spacedesk
- [x] LibreOffice
- [x] NUX Audio Driver
- [x] ProSAFE Plus Utility(L3スイッチ設定ツール)
- [x] K-Lite Codec Pack
  - すぐには不要だったのでスキップ。必要になったら実施する。
  - 2022-07-23 やっぱり必要になったので導入
- [ ] Mouse without Borders
  - すぐには不要だったのでスキップ。必要になったら実施する。

### scoopでインストールできないapp(ポータブルapp)

インストーラーの不要なポータブルappは、NASにモジュールを事前にまとめておき`C:\Apps\local`にまとめてコピー

- [x] MagicFinder
- [x] ProcessExplorer
- [x] SynkronPortable
  - 同期設定もそのまま移行できていました
- [x] WDIDLE3 for Windows

### windows store appのインストール

- [x] HEVCビデオ拡張機能
  - heicファイルをMSPaintで開くとインストールに誘導される。それをインストールしたら動画も画像も表示できるようになっていました。
- [ ] iTunes
  - すぐには不要だったのでスキップ。必要になったら実施する。
- [ ] （必要なら）デバイス製造元からのHEVCビデオ拡張機能
- [ ] （必要なら）HEIF 画像拡張機能
  - 不要になったのでスキップ

### 　Hyper-Vの設定

`設定` > `アプリ` > `オプション機能` > `Windowsのその他の機能`からHyper-Vをインストールし、再起動。

再起動後、旧マシンでエクスポートした設定をインポートするだけで問題なく環境復元できました。

## プログラミング環境のセットアップ

### 開発用ツール一覧

- [x] Visual Studio Code
  - 初期セットアップ時にインストール済み
- [x] git
  - 初期セットアップ時にインストール済み
- [x] Node
  - [NVM for Windows](https://github.com/coreybutler/nvm-windows)を使ってセットアップ

    ``` powershell
    > nvm install lts
    Downloading node.js version 16.15.0 (64-bit)...
    Extracting...
    Complete


    Installation complete. If you want to use this version, type

    nvm use 16.15.0

    # 管理者コンソールで実行すること
    > nvm use 16.15.0
    Now using node v16.15.0 (64-bit)
    ```

- [x] Visual Studio 2022

### 旧開発マシンからの移行作業

1. メインで使用しているラップトップPCのすべての変更をcommit&push
1. 新デスクトップで順次クローン

Git Forkを使用するにあたり、githubのssh秘密鍵の登録作業が必要でした。以前Windows10で実施した[Git: githubへのssh接続をSourceTreeからwindows 10標準のssh clientに切り替える](doc/env/git-ssh-configuration)<!--rehype:class=internal-link-->の手順がWindows 11でも問題ないか確認していきました。

#### OpenSSH Authentication Agentサービスの起動

`無効`になっていたので`自動`に変更。

#### 秘密鍵の作成と配置

以前作成したgithubのOpenSSH形式 秘密鍵(id_ras)ファイルがあるので、それをc:\Users\<username>\.sshフォルダに配置

#### ssh-agentに秘密鍵を登録

登録のコマンドを実行

``` powershell
> cd c:\Users\<username>\.ssh
> ssh-add id_rsa
Enter passphrase for id_rsa:
Identity added: id_rsa (id_rsa)
```

#### 環境変数の設定

再起動後、git fecth実行時にpassphraseを聞かれるようになってしまいました。[Why git can't remember my passphrase under Windows - stackoverflow](https://stackoverflow.com/questions/370030/why-git-cant-remember-my-passphrase-under-windows)の記事を参考に、環境変数を追加して解決しました。

`コントロールパネル` > `ユーザアカウント` > `環境変数の変更`から、ユーザ環境変数`GIT_SSH`を追加しました。

- variable: GIT_SSH
- value: C:\Windows\System32\OpenSSH\ssh.exe

以前のWindows 10環境で不要だったのは、Git for Windowsをscoopではなくインストーラから導入した際に自動でこの環境変数を作成してくれていたのかもしれません。

## 関連項目

- [scoopでWindowsアプリを管理する](doc/env/use-scoop)<!--rehype:class=internal-link-->
- [Windowsで利用しているツール](doc/env/tool-list)<!--rehype:class=internal-link-->
