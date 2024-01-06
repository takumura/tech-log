---
title: "Angular v17のapplicationを開発する(準備作業)"
date: "2023-11-11"
category: "Angular"
tag:
  - angular
  - version up
---

2023/11/8に[angular v17のリリース](https://blog.angular.io/introducing-angular-v17-4d7033312e4b)がアナウンスされました。v15以降にどんどん導入されている新機能を一つひとつ試していきたいので、v17でブログappをイチから作成してみようと思います。

以下の順番で確認していく予定です。

- angular v17のapp作成と動作確認 **<- 今回はココ**
- .NET 8の新しいSPAテンプレートでangular v17を利用する
- 状態管理をngrxからsignalに変更する
- angularのprerenderingを試す
- ~~angular v17のlibraryを作成し、ブログページ用のcomponentをappから利用できるようにする~~

## 環境準備

まず初めに、angular cliをv17に更新します。

``` powershell
> npm update @angular/cli -g
added 19 packages, removed 35 packages, changed 209 packages, and audited 230 packages in 23s

found 0 vulnerabilities
npm notice
npm notice New major version of npm available! 8.5.5 -> 10.2.3
npm notice Changelog: https://github.com/npm/cli/releases/tag/v10.2.3
npm notice Run npm install -g npm@10.2.3 to update!
npm notice

> ng version
Node.js version v16.15.0 detected.
The Angular CLI requires a minimum Node.js version of v18.13.

Please update your Node.js version or visit https://nodejs.org/ for additional instructions.
```

アップデート自体は正常に完了したようですが、バージョン確認をしようとしたら、Nodejsのバージョンが古いと言われてしまいました。

``` powershell
> nvm list

    18.12.1
  * 16.15.0 (Currently using 64-bit executable)
    12.22.12
```

以前[Angular v14からv15へのアップデート](doc/angular/angular-update-from-14-to-15#node-version)<!--rehype:class=internal-link-->を実行した際に、VisualStudio 2022(esproj?)の謎のissueに引っかかりNodejsをv18に上げられない問題がありました。本件に関する[stack overflow投稿](https://stackoverflow.com/questions/73005681/visual-studio-blocks-on-deploying-a-standalone-angular-project)によるとVS2022 version 17.6で問題解決していたようです。

なのでNodejsも今日時点のLTS(20.9.0)に更新して作業を進めます。

``` powershell
> nvm install lts
Downloading node.js version 20.9.0 (64-bit)...
Extracting node and npm...
Complete
npm v10.1.0 installed successfully.


Installation complete. If you want to use this version, type

> nvm use 20.9.0
Now using node v20.9.0 (64-bit)

> nvm list

  * 20.9.0 (Currently using 64-bit executable)
    18.12.1
    16.15.0
    12.22.12
```

Nodejsおよびnpmが切り替わったので、angular cliも入れ直しです。cacheフォルダーの開発ドライブへの変更も、[前回の記事](doc/env/win11_dev_drive)<!--rehype:class=internal-link-->を参考にして設定し直す必要がありました。

``` powershell
> npm install -g yarn

added 1 package in 1s

> npm install @angular/cli -g

added 228 packages in 38s
npm notice
npm notice New minor version of npm available! 10.1.0 -> 10.2.3
npm notice Changelog: https://github.com/npm/cli/releases/tag/v10.2.3
npm notice Run npm install -g npm@10.2.3 to update!
npm notice

> ng version

     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/


Angular CLI: 17.0.0
Node: 20.9.0
Package Manager: yarn 1.22.19
OS: win32 x64

Angular:
...

Package                      Version
------------------------------------------------------
@angular-devkit/architect    0.1700.0 (cli-only)
@angular-devkit/core         17.0.0 (cli-only)
@angular-devkit/schematics   17.0.0 (cli-only)
@schematics/angular          17.0.0 (cli-only)
```

## angular appの作成

appの新規作成では、cssスタイルとSSR/SSGの利用について確認がありました。SSGの動作確認は今回はNoを選択し、また後で確認することにします。

``` powershell
> ng new angularv17-test-client
? Which stylesheet format would you like to use? SCSS   [ https://sass-lang.com/documentation/syntax#scss ]
? Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)? No
CREATE angularv17-test-client/angular.json (2846 bytes)
CREATE angularv17-test-client/package.json (1053 bytes)
CREATE angularv17-test-client/README.md (1074 bytes)
CREATE angularv17-test-client/tsconfig.json (909 bytes)
CREATE angularv17-test-client/.editorconfig (274 bytes)
CREATE angularv17-test-client/.gitignore (548 bytes)
CREATE angularv17-test-client/tsconfig.app.json (263 bytes)
CREATE angularv17-test-client/tsconfig.spec.json (273 bytes)
CREATE angularv17-test-client/.vscode/extensions.json (130 bytes)
CREATE angularv17-test-client/.vscode/launch.json (470 bytes)
CREATE angularv17-test-client/.vscode/tasks.json (938 bytes)
CREATE angularv17-test-client/src/main.ts (250 bytes)
CREATE angularv17-test-client/src/favicon.ico (15086 bytes)
CREATE angularv17-test-client/src/index.html (306 bytes)
CREATE angularv17-test-client/src/styles.scss (80 bytes)
CREATE angularv17-test-client/src/app/app.component.html (20887 bytes)
CREATE angularv17-test-client/src/app/app.component.spec.ts (964 bytes)
CREATE angularv17-test-client/src/app/app.component.ts (384 bytes)
CREATE angularv17-test-client/src/app/app.component.scss (0 bytes)
CREATE angularv17-test-client/src/app/app.config.ts (227 bytes)
CREATE angularv17-test-client/src/app/app.routes.ts (77 bytes)
CREATE angularv17-test-client/src/assets/.gitkeep (0 bytes)
✔ Packages installed successfully.
hint: Using 'master' as the name for the initial branch. This default branch name
hint: is subject to change. To configure the initial branch name to use in all
hint: of your new repositories, which will suppress this warning, call:
hint:
hint:   git config --global init.defaultBranch <name>
hint:
hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and
hint: 'development'. The just-created branch can be renamed via this command:
hint:
hint:   git branch -m <name>
warning: in the working copy of '.editorconfig', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of '.gitignore', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of '.vscode/extensions.json', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of '.vscode/launch.json', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of '.vscode/tasks.json', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'README.md', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'angular.json', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'package.json', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/app/app.component.html', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/app/app.component.spec.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/app/app.component.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/app/app.config.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/app/app.routes.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/index.html', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/main.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/styles.scss', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'tsconfig.app.json', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'tsconfig.json', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'tsconfig.spec.json', LF will be replaced by CRLF the next time Git touches it
    Successfully initialized git.
```

パッと気が付いたところで、公式アナウンスの通りangularのfaviconが新しくなっていました。またangular.jsonのbuilderに`@angular-devkit/build-angular:application`が設定されるようになっていました。

デフォルトのbuild systemがviteになっているためか、実行は爆速です。

``` powershell
> yarn
yarn install v1.22.19
[1/4] Resolving packages...
success Already up-to-date.
Done in 0.18s.

> yarn start
yarn run v1.22.19
$ ng serve

Initial Chunk Files | Names         |  Raw Size
polyfills.js        | polyfills     |  82.71 kB |
main.js             | main          |  23.39 kB |
styles.css          | styles        |  96 bytes |

                    | Initial Total | 106.19 kB

Application bundle generation complete. [2.359 seconds]
Watch mode enabled. Watching for file changes...
  ➜  Local:   http://localhost:4200/
```

アプリケーションのhomeもシンプルに一新されていました。
<img src="assets/images/angular_create_v17_project/angular_create_v17_project_1.png" alt="new home" title="new home">
