---
title: "angular-cli-ghpagesを利用する"
date: "2019-11-14"
category: "Angular"
tag: ["deploy", "github pages"]
---

Angular 7でangular-cli-ghpagesライブラリを利用して、github pagesを簡単に更新できるようなので、その設定方法などを調べました。

## 実施した手順

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

## パブリッシュスクリプトの作成

prodオプション付きのビルドを実行し、生成されたdistフォルダ以下をorigin/gh-pagesにpushするスクリプトを作成しました。

**publish-to-ghpages.ps1**

```bash
ng build --prod --base-href "https://takumura.github.io/tech-log/"
npx angular-cli-ghpages
```

## 作業時に参照した情報

- [Deploying an Angular App to Github Pages](https://alligator.io/angular/deploying-angular-app-github-pages/)
- [Angular-CLIで作成したアプリをGithub Pagesにデプロイする](https://prokatsu.com/angular-cli_github-pages_deploy/)
- [AngularのプロジェクトをGithub Pagesに公開する](https://choco14t.hatenablog.com/entry/2018/07/07/144504)
