---
title: "Angularのプリレンダリングについて"
date: "2020-02-15"
category: "Angular"
tag: ["prerender"]
---

[angular-prerender](https://github.com/chrisguttandin/angular-prerender)という気になるツールを見かけたので、使ったらどうなるのか試してみます。

## 環境の準備

### nodejs

LTS版のnodeを利用します。これまではWindows installerでインストールしていましたが、今回kらscoopを使うようにしました。

``` powershell
> scoop install nodejs-lts
Installing 'nodejs-lts' (12.16.0) [64bit]
node-v12.16.0-win-x64.7z (10.2 MB) [=============================] 100%
Checking hash of node-v12.16.0-win-x64.7z ... ok.
Extracting node-v12.16.0-win-x64.7z ... done.
Linking C:\Apps\scoop\apps\nodejs-lts\current => C:\Apps\scoop\apps\nodejs-lts\12.16.0
Persisting bin
Persisting cache
Running post-install script...
'nodejs-lts' (12.16.0) was installed successfully!

> node -v
v12.16.0
```

windowsのアンインストールでは`%AppData%/npm`と`%AppData%/npm-cache`が削除されず残ってしまうことがありました。見つけたら手動で削除します。

### package manager

2020年2月の調査でもnpmよりyarnの方がパフォーマンスが良いという記事が多いので、package managerにはnpmではなくyarnを使用します。scoopを使ってインストールします。

``` powershell
> scoop install yarn
```

### Angular CLI

Angularのバージョンは9を利用することにします。これまではAngular7を使っていて、今回初めて9のプロジェクトを作るので、Angular CLIの更新から始めます。

yarn globalインストールでは、versionがうまく表示されないエラーがあるようなので、npmでグローバルインストールします。

``` powershell
> npm uninstall -g angular-cli
> npm cache verify
> npm install -g @angular/cli@latest
> ng version

     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/

Angular CLI: 9.0.2
Node: 12.16.0
OS: win32 x64

Angular:
...
Ivy Workspace:

Package                      Version
------------------------------------------------------
@angular-devkit/architect    0.900.2
@angular-devkit/core         9.0.2
@angular-devkit/schematics   9.0.2
@schematics/angular          9.0.2
@schematics/update           0.900.2
rxjs                         6.5.3
```

## プロジェクトの作成

angular prerender公式サイトの手順通りに進めます。

``` powershell
> ng config -g cli.packageManager yarn
> ng new universe --routing
```

初回実行時にpackageの解決まで行われるので、事前にAngular CLIが利用するpackage managerをyarnに変更してから、新規にAngular9 appを作成しました。

## universal(server) moduleの作成

``` powershell
> cd universe
> ng generate universal --client-project universe
CREATE src/main.server.ts (298 bytes)
CREATE src/app/app.server.module.ts (318 bytes)
CREATE tsconfig.server.json (308 bytes)
UPDATE package.json (1327 bytes)
UPDATE angular.json (4357 bytes)
UPDATE src/main.ts (432 bytes)
UPDATE src/app/app.module.ts (438 bytes)
√ Packages installed successfully.
```

## angular-prerenderの導入とprerender処理

``` powershell
> yarn add angular-prerender --dev
> ng build
> ng run universe:server
> npx angular-prerender
```

処理が正常に終了し、`dist\universe\browser\index.html`にapp.component.htmlの内容が追記されていることを確認しました。

## 次にやること

routeを増やして、どのようにhtmlが追記されるのかを確認します。

## 作業録

ステップ毎の変更点を<https://github.com/takumura/angular-express-prerender/commits/master>から確認できます。

## 関連項目

- [Angular Update Guide](https://update.angular.io/)
- [Updating to Angular version 9](https://angular.io/guide/updating-to-version-9)
- [Angularの環境構築（Angular CLIで構築）](https://qiita.com/Yamamoto0525/items/65d5a0b36eb4dbd8079b)
