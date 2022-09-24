---
title: "angularプロジェクトをgithub pagesにdeployする"
date: "2022-09-24"
category: "Angular"
tag: ["deploy", "github pages", "angular-cli-ghpages"]
---


Angular CLIの[deployコマンド](https://angular.io/guide/deployment)を使用すると、Angularアプリケーションをワンコマンドで様々なプラットフォームに配信できます。

Github pages用のmodule: [angular-cli-ghpages](https://github.com/angular-schule/angular-cli-ghpages)を利用してdeployする設定についてまとめます。

angular v8以降は`ng deploy`コマンドの統一化により、設定が簡単になっています。それ以前の設定方法については[angular v7以前の設定方法について](doc/angular/angular-setup-ghpages#angular-v7以前の設定方法について)<!--rehype:class=internal-link-->を参照してください。

## angular v8以降の設定方法について

[公式readme](https://github.com/angular-schule/angular-cli-ghpages#-quick-start-local-development-)に記載の手順で基本的にはうまくいきます。

まずは`angular-cli-ghpages`をdependencyに追加します。

```powershell
> yarn add angular-cli-ghpages
```

次に`package.json`にdeployコマンドを登録します。

``` diff
{
  "name": "net6-markdown-web-engine",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve --ssl --ssl-cert %APPDATA%\\ASP.NET\\https\\%npm_package_name%.pem --ssl-key %APPDATA%\\ASP.NET\\https\\%npm_package_name%.key",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "prestart": "node aspnetcore-https",
    "lint": "ng lint",
+    "deploy": "ng deploy"
  },
  ...
}
```

2022-09-24時点の説明では、以下のように`--base-href`オプションでbaseHrefを指定するように記載されていました。

``` powershell
> ng deploy --base-href=/<repositoryname>/
```

ですが、Angular v13で`ng serve`の`--base-href`がdeprecatedされた影響で`Unknown option: '--base-href'`エラーが発生するようになってしまいました。

改めて[公式readmeのConfiguration File](https://github.com/angular-schule/angular-cli-ghpages#-configuration-file-)の項を読むと、angular.jsonでoptionはすべて指定できることがわかります。

これを参考に、angular.jsonの`projects` > `architect` > `deploy`にbuilderとoptionの指定を追加します。

``` json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
      "architect": {
        "build": {
          ...
        },
        "deploy": {
          "builder": "angular-cli-ghpages:deploy",
          "options": {
            "baseHref": "https://takumura.github.io/tech-log/"
          }
        }
      }
    }
  },
```

これで準備は完了です。あとは`deploy`コマンドを実行するだけです。

``` powershell
> yarn run deploy
yarn run v1.22.18
$ ng deploy
📦 Building "net6-markdown-web-engine"
📦 Build target "net6-markdown-web-engine:build:production"
✔ Browser application bundle generation complete.
✔ Copying assets complete.
✔ Index html generation complete.

Initial Chunk Files           | Names         | Raw Size | Estimated Transfer Size
main.916c949610f5da02.js      | main          |  1.95 MB |               466.40 kB
styles.115de464a61128e0.css   | styles        | 86.36 kB |                 8.86 kB
polyfills.3b0926dacd75e569.js | polyfills     | 36.19 kB |                11.51 kB
runtime.969567bc7b9abfdf.js   | runtime       |  1.24 kB |               662 bytes

                              | Initial Total |  2.07 MB |               487.41 kB

Build at: 2022-09-23T15:20:55.591Z - Hash: e6426ae3739f9185 - Time: 26054ms

Warning: bundle initial exceeded maximum budget. Budget 500.00 kB was not met by 1.58 MB with a total of 2.07 MB.


🚀 Uploading via git, please wait...
🌟 Successfully published via angular-cli-ghpages! Have a nice day!
Done in 38.89s.
```

PCを新調したので、以前は3分ほど掛かっていた処理が40秒で終わるようになりました。素晴らしい！

<details open>
  <summary>Angular v7以前（2019-11-14 作成）</summary>

## Angular v7以前の設定方法について

Angular 7でangular-cli-ghpagesライブラリを利用して、github pagesを簡単に更新できるようなので、その設定方法などを調べました。

### 実施した手順

まず初めに[angular-cli-ghpagesのgithubリポジトリ](https://github.com/angular-schule/angular-cli-ghpages)を確認しました。

Prerequisitesに`Angular project created via Angular CLI v8.3.0-next.0 or greate`と書かれているのを発見。うまくいかないかもしれないが、とりあえずAngular CLI v7系のまま設定を実施しました。

```bash
PS C:\Repos\github\tech-log\Website\ClientApp> ng add angular-cli-ghpages
Installing packages for tooling via npm.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.2.7 (node_modules\fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.2.7: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"x64"})
+ angular-cli-ghpages@0.5.3
added 18 packages from 17 contributors and audited 42977 packages in 21.148s
found 607 vulnerabilities (3 moderate, 604 high)
  run `npm audit fix` to fix them, or `npm audit` for details
Installed packages for tooling via npm.
The package that you are trying to add does not support schematics. You can try using a different version of the package or contact the package author to add ng-add support.
```

警告などが出ている（auditは今後の課題）が、今回は無視して進めます。

```bash
PS C:\Repos\github\tech-log\Website\ClientApp> ng build --prod --base-href "https://takumura.github.io/tech-log/"
```

dry-runによる予行でどのように動くか実験。

```bash
PS C:\Repos\github\tech-log\Website\ClientApp> npx angular-cli-ghpages --dry-run
*** Dry-run: No changes are applied at all.
*** Dry-run / SKIPPED: cleaning of the cache directory
*** Dry-run / SKIPPED: copying of index.html to 404.html
*** Dry-run / SKIPPED: publishing to "C:\Repos\github\tech-log\Website\ClientApp\dist" with the following options: { dir: 'C:\\Repos\\github\\tech-log\\Website\\ClientApp\\dist',
  repo:
   'undefined: current working directory (which must be a git repo in this case) will be used to commit & push',
  message: 'Auto-generated commit',
  branch: 'gh-pages',
  user:
   'undefined: local or gloabl git username & email properties will be taken',
  noSilent: 'undefined: logging is in silent mode by default',
  noDotfiles: 'undefined: dotfiles are included by default',
  dryRun: true,
  cname: 'undefined: no CNAME file will be created' }
*** Successfully published!
```

問題なさそうなので本実行。

```bash
PS C:\Repos\github\tech-log\Website\ClientApp> npx angular-cli-ghpages
```

初回は`Permission denied (publickey)`エラーが発生してpushに失敗。[Git: githubへのssh接続をSourceTreeからwindows 10標準のssh clientに切り替える](doc/env/git-ssh-configuration)<!--rehype:class=internal-link-->の対応を実施してから再チャレンジ。

```bash
PS C:\Repos\github\tech-log\Website\ClientApp> npx angular-cli-ghpages
*** Successfully published!
```

無事成功。<https://takumura.github.io/tech-log/> にアクセスすると、見事にサイトが表示されていました。fetchでのjsonデータ取得や、ページ遷移なども問題なく動作しています。素晴らしい！

### publish scriptの作成

prodオプション付きのビルドを実行し、生成されたdistフォルダ以下をorigin/gh-pagesにpushするスクリプトを作成しました。

**publish-to-ghpages.ps1**

```bash
ng build --prod --base-href "https://takumura.github.io/tech-log/"
npx angular-cli-ghpages
```

</details>

## 作業時に参照した情報

- [Deploying an Angular App to Github Pages](https://alligator.io/angular/deploying-angular-app-github-pages/)
- [Angular-CLIで作成したアプリをGithub Pagesにデプロイする](https://prokatsu.com/angular-cli_github-pages_deploy/)
- [AngularのプロジェクトをGithub Pagesに公開する](https://choco14t.hatenablog.com/entry/2018/07/07/144504)
- [Unknown option: '--base-href' Angular 13 ng serve | stackoverflow](https://stackoverflow.com/questions/71604562/unknown-option-base-href-angular-13-ng-serve)
