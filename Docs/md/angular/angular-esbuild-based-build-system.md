---
title: 'Angularでesbuild-based build systemを試す'
date: '2023-10-08'
category: 'Angular'
tag:
- angular
- vite
---

Angular v16からesbuild-based build systemがDeveloper previewになったので、our of Heroesをイチから作って試してみます。

## 情報収集

Developer previewに関する公式のアナウンスメントは[Angular v16 is here! | Angular Blog](https://blog.angular.io/angular-v16-is-here-4d7a28ec680d)です。詳細なガイド:[Developer guides - esbuild-based Builds](https://angular.io/guide/esbuild)も作成されていました。

以前見た記事ではstandalone component化が必須となっていたのですが、必要な設定は`angular.json`への変更だけということでした。

``` json
...
"architect": {
  "build": {                     /* Add the esbuild suffix  */
    "builder": "@angular-devkit/build-angular:browser-esbuild",
...
```

## Project作成

まず初めにangular-cliのupdateを行って、Angular v16のprojectを作成できるようにします。この作業を忘れてAngular v15のprojectを作って確認してしまい、無駄な時間を使ってしまいました。。。v15では実行時警告が"experimental"だったのが、v16では"developer preview"に進化していました。

``` powershell
> npm update @angular/cli -g

> npm list -g
C:\Apps\scoop\apps\nvm\current\nodejs\nodejs -> .\
+-- @angular/cli@16.2.5
+-- corepack@0.10.0
+-- npm@8.5.5
`-- yarn@1.22.18

> ng version

     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/


Angular CLI: 16.2.5
Node: 16.15.0
Package Manager: yarn 1.22.18
OS: win32 x64

Angular:
...

Package                      Version
------------------------------------------------------
@angular-devkit/architect    0.1602.5 (cli-only)
@angular-devkit/core         16.2.5 (cli-only)
@angular-devkit/schematics   16.2.5 (cli-only)
@schematics/angular          16.2.5 (cli-only)
```

[チュートリアル](https://angular.io/tutorial/tour-of-heroes/toh-pt0)に従ってプロジェクトを作成。

``` powershell
> ng new angular-tour-of-heroes-esbuild
? Would you like to add Angular routing? Yes
? Which stylesheet format would you like to use?
  CSS
> SCSS   [ https://sass-lang.com/documentation/syntax#scss                ]
  Sass   [ https://sass-lang.com/documentation/syntax#the-indented-syntax ]
  Less   [ http://lesscss.org                                             ]
PS C:\Repos\temp\angular-vite> ng new angular-tour-of-heroes-esbuild
? Would you like to add Angular routing? No
? Which stylesheet format would you like to use? SCSS   [ https://sass-lang.com/documentation/syntax#scss                ]
CREATE angular-tour-of-heroes-esbuild/angular.json (2994 bytes)
CREATE angular-tour-of-heroes-esbuild/package.json (1061 bytes)
CREATE angular-tour-of-heroes-esbuild/README.md (1080 bytes)
CREATE angular-tour-of-heroes-esbuild/tsconfig.json (901 bytes)
CREATE angular-tour-of-heroes-esbuild/.editorconfig (274 bytes)
CREATE angular-tour-of-heroes-esbuild/.gitignore (548 bytes)
CREATE angular-tour-of-heroes-esbuild/tsconfig.app.json (263 bytes)
CREATE angular-tour-of-heroes-esbuild/tsconfig.spec.json (273 bytes)
CREATE angular-tour-of-heroes-esbuild/.vscode/extensions.json (130 bytes)
CREATE angular-tour-of-heroes-esbuild/.vscode/launch.json (470 bytes)
CREATE angular-tour-of-heroes-esbuild/.vscode/tasks.json (938 bytes)
CREATE angular-tour-of-heroes-esbuild/src/main.ts (214 bytes)
CREATE angular-tour-of-heroes-esbuild/src/favicon.ico (948 bytes)
CREATE angular-tour-of-heroes-esbuild/src/index.html (312 bytes)
CREATE angular-tour-of-heroes-esbuild/src/styles.scss (80 bytes)
CREATE angular-tour-of-heroes-esbuild/src/app/app.module.ts (314 bytes)
CREATE angular-tour-of-heroes-esbuild/src/app/app.component.html (23083 bytes)
CREATE angular-tour-of-heroes-esbuild/src/app/app.component.spec.ts (964 bytes)
CREATE angular-tour-of-heroes-esbuild/src/app/app.component.ts (235 bytes)
CREATE angular-tour-of-heroes-esbuild/src/app/app.component.scss (0 bytes)
CREATE angular-tour-of-heroes-esbuild/src/assets/.gitkeep (0 bytes)
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
warning: in the working copy of 'src/app/app.module.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/index.html', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/main.ts', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/styles.scss', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'tsconfig.app.json', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'tsconfig.json', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'tsconfig.spec.json', LF will be replaced by CRLF the next time Git touches it
    Successfully initialized git.
```

builderを`@angular-devkit/build-angular:browser-esbuild`に変更後、初回ビルドの実行時間は11sでした(元々の設定では26s)。

``` powershell
> yarn build
yarn run v1.22.18
$ ng build
The esbuild-based browser application builder ('browser-esbuild') is currently in developer preview and is not yet recommended for production use. For additional information, please see https://angular.io/guide/esbuild
The 'budgets' option is not yet supported by this builder.

Initial Chunk Files   | Names         |  Raw Size | Estimated Transfer Size
main.P3DX73J7.js      | main          | 127.60 kB |                38.23 kB
polyfills.T6ZPM373.js | polyfills     |  32.85 kB |                10.68 kB
chunk-2XJVAMHT.js     | -             | 449 bytes |               449 bytes
styles.7FSFZJA3.css   | styles        |   0 bytes |                 0 bytes

                      | Initial Total | 160.88 kB |                49.34 kB

Application bundle generation complete. [5.992 seconds]
Done in 11.59s.
```

二回目のビルドはtotalで3sでした(元々の設定では4s)。

``` powershell
> yarn build
> yarn build
yarn run v1.22.18
$ ng build
The esbuild-based browser application builder ('browser-esbuild') is currently in developer preview and is not yet recommended for production use. For additional information, please see https://angular.io/guide/esbuild
The 'budgets' option is not yet supported by this builder.

Initial Chunk Files   | Names         |  Raw Size | Estimated Transfer Size
main.P3DX73J7.js      | main          | 127.60 kB |                38.23 kB
polyfills.T6ZPM373.js | polyfills     |  32.85 kB |                10.68 kB
chunk-2XJVAMHT.js     | -             | 449 bytes |               449 bytes
styles.7FSFZJA3.css   | styles        |   0 bytes |                 0 bytes

                      | Initial Total | 160.88 kB |                49.34 kB

Application bundle generation complete. [2.325 seconds]
Done in 3.19s.
```

次にyarn startでappを実行してみます。初回app実行は約1sでした(元々の設定では6s)。

``` powershell
> yarn start
yarn run v1.22.18
$ ng serve
The esbuild-based browser application builder ('browser-esbuild') is currently in developer preview and is not yet recommended for production use. For additional information, please see https://angular.io/guide/esbuild
The 'namedChunks' option is not used by this builder and will be ignored.
The 'vendorChunk' option is not used by this builder and will be ignored.

Initial Chunk Files | Names         | Raw Size
main.js             | main          | 34.59 kB |
styles.css          | styles        | 96 bytes |
polyfills.js        | polyfills     | 95 bytes |

                    | Initial Total | 34.77 kB

Application bundle generation complete. [1.257 seconds]
  ➜  Local:   http://127.0.0.1:4200/
Watch mode enabled. Watching for file changes...
```

二回目以降のapp実行も同様に約1sでした(元々の設定では2s)。常に2倍以上高速です。

``` powershell
> yarn start
yarn run v1.22.18
$ ng serve
The esbuild-based browser application builder ('browser-esbuild') is currently in developer preview and is not yet recommended for production use. For additional information, please see https://angular.io/guide/esbuild
The 'namedChunks' option is not used by this builder and will be ignored.
The 'vendorChunk' option is not used by this builder and will be ignored.

Initial Chunk Files | Names         | Raw Size
main.js             | main          | 34.59 kB |
styles.css          | styles        | 96 bytes |
polyfills.js        | polyfills     | 95 bytes |

                    | Initial Total | 34.77 kB

Application bundle generation complete. [1.282 seconds]
  ➜  Local:   http://127.0.0.1:4200/
Watch mode enabled. Watching for file changes...
```

Tutorialを進めながら気が付いた点として、

- VSCodeのバージョンが古いとAngular Language Service Extensionの最新版がダウンロードできない
  - 実行しているAngular(v16)とExtensionのAngular(v15)でバージョンが合わない
  - `[(ngModel)]`を利用しようとすると、Angular Language Serviceが`Can’t bind to ‘ngModel’ since it isn’t a known property of ‘input’.`エラーを表示する

よくある`FormsModule`のimport忘れのエラーかと思ったのですが、この対応では解決せずしばらく悩みました。VS Codeの更新->Angular Language Serviceの更新(v16版)でエラーが表示されないようになりました。

## その他の学び

- 非nullアサーション(non-null assertion)
  - [5. add navigation - Add HeroService.getHero()](https://angular.io/tutorial/tour-of-heroes/toh-pt5#add-heroservicegethero)にて`const hero = HEROES.find(h => h.id === id)!;`という風に最後に`!`することで、heroの型を`Hero | undefined`から`Hero`に強制できる。型問題の解決案として覚えておくと便利そう。
- [angular-in-memory-web-api](https://github.com/angular/in-memory-web-api#angular-in-memory-web-api)
  - web apiのモックを簡単に作れて便利
