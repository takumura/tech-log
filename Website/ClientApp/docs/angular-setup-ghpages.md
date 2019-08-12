---
title: 'angular-cli-ghpagesを利用する'
date: '2019-08-12'
category: 'Angular'
---

## 実施した手順

まず初めに[githubの公式リポジトリ](https://github.com/angular-schule/angular-cli-ghpages)を確認しました。

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

最終分は赤字だが無視して進めます。

```bash
PS C:\Repos\github\tech-log\Website\ClientApp> ng build --prod --base-href "https://takumura.github.io/tech-log/"
```

`Website/ClientApp`以下にdistが作成されたことを確認して、dry-runを実行

```bash
PS C:\Repos\github\tech-log\Website\ClientApp> ngh --dry-run
```

## 作業時に参照した情報

-   [Deploying an Angular App to Github Pages](https://alligator.io/angular/deploying-angular-app-github-pages/)
-   [Angular-CLIで作成したアプリをGithub Pagesにデプロイする](https://prokatsu.com/angular-cli_github-pages_deploy/)
-   [AngularのプロジェクトをGithub Pagesに公開する](https://choco14t.hatenablog.com/entry/2018/07/07/144504)
