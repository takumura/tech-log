---
title: "Angular v14からv15へのアップデート"
date: "2023-01-08"
category: "Angular"
tag:
  - angular
  - angular material
  - ngrx
  - version up
---

Angular v15ではstandalone componentがstableになったり、Angular MaterialがMDC([Material Design Component for Web](https://github.com/material-components/material-components-web))ベースに変更になったりと、色々な変更点が入っているようです。

冬休みにまとまった時間が取れたので、v15へのアップデートとfull standalone component化にチャレンジしてみました。

やってみた感想としては

- Standalone componentは、新規appの作成でイチから作成するなら使って損はなさそう。既存のappをfull standalone component化するのは小規模でもかなり大変だったので大規模appではやりきれなそう
- MDC-based Angular Materialへの移行も、なかなかに手間がかかる。スタイルの見直しも必要になるのでレビューの良い機会になる
- esprojが謎すぎる。どこかで動作原理をしっかり把握しないといけない

という感じでした。

変更内容の詳細は[コチラのPR](https://github.com/takumura/tech-log/pull/42/files)から確認できます。

## v14 to v15のアップデート手順

[Angular Update Guide](https://update.angular.io/?l=3&v=14.0-15.0)を参考に作業を実施。

### node version

`16.15.0`をinstallしていたので、2023-01-01時点のlts(`18.12.1`)に更新。。。したのですが大間違いでした。

後になってVisual Studio2022のデバッグが出来なくなっていることに気が付きました。かなりハマって、最終的にはStackOverflowの記事:[Visual Studio blocks on deploying a Standalone Angular project](https://stackoverflow.com/questions/73005681/visual-studio-blocks-on-deploying-a-standalone-angular-project)に救われました。

結論としては、今のesprojはnode v18で動かないようです。何故動かないのかわからないので、今度調査したいと思いました。

### angularのバージョンアップ

`@angular/core`、`@angular/cli`、`@angular-eslint/schematics`の3ライブラリを@15にバージョンアップ。

``` powershell
> ng update @angular/core@15 @angular/cli@15 @angular-eslint/schematics@15
Using package manager: yarn
Collecting installed dependencies...
Found 55 dependencies.
Fetching dependency metadata from registry...
    Updating package.json with dependency @angular-devkit/build-angular @ "15.0.4" (was "14.1.2")...
    Updating package.json with dependency @angular-eslint/builder @ "15.1.0" (was "14.0.2")...
    Updating package.json with dependency @angular-eslint/eslint-plugin @ "15.1.0" (was "14.0.2")...
    Updating package.json with dependency @angular-eslint/eslint-plugin-template @ "15.1.0" (was "14.0.2")...
    Updating package.json with dependency @angular-eslint/schematics @ "15.1.0" (was "14.0.2")...
    Updating package.json with dependency @angular-eslint/template-parser @ "15.1.0" (was "14.0.2")...
    Updating package.json with dependency @angular/cli @ "15.0.4" (was "14.1.2")...
    Updating package.json with dependency @angular/compiler-cli @ "15.0.4" (was "14.1.2")...
    Updating package.json with dependency typescript @ "4.8.4" (was "4.7.4")...
    Updating package.json with dependency @angular/animations @ "15.0.4" (was "14.1.2")...
    Updating package.json with dependency @angular/common @ "15.0.4" (was "14.1.2")...
    Updating package.json with dependency @angular/compiler @ "15.0.4" (was "14.1.2")...
    Updating package.json with dependency @angular/core @ "15.0.4" (was "14.1.2")...
    Updating package.json with dependency @angular/forms @ "15.0.4" (was "14.1.2")...
    Updating package.json with dependency @angular/platform-browser @ "15.0.4" (was "14.1.2")...
    Updating package.json with dependency @angular/platform-browser-dynamic @ "15.0.4" (was "14.1.2")...
    Updating package.json with dependency @angular/router @ "15.0.4" (was "14.1.2")...
UPDATE package.json (2463 bytes)
✔ Packages successfully installed.
** Executing migrations of package '@angular-eslint/schematics' **

> Updates @angular-eslint to v15.
UPDATE package.json (2464 bytes)
UPDATE angular.json (4504 bytes)
✔ Packages installed successfully.
  Migration completed.

** Executing migrations of package '@angular/cli' **

> Remove Browserslist configuration files that matches the Angular CLI default configuration.
DELETE .browserslistrc
  Migration completed.

> Remove exported `@angular/platform-server` `renderModule` method.
  The `renderModule` method is now exported by the Angular CLI.
  Migration completed.

> Remove no longer needed require calls in Karma builder main file.
UPDATE src/test.ts (520 bytes)
  Migration completed.

> Update TypeScript compiler `target` and set `useDefineForClassFields`.
  These changes are for IDE purposes as TypeScript compiler options `target` and `useDefineForClassFields` are set to `ES2022` and `false` respectively by the Angular CLI.
  To control ECMA version and features use the Browerslist configuration.
UPDATE tsconfig.json (1018 bytes)
  Migration completed.

> Remove options from 'angular.json' that are no longer supported by the official builders.
  Migration completed.

** Executing migrations of package '@angular/core' **

> In Angular version 15, the deprecated `relativeLinkResolution` config parameter of the Router is removed.
  This migration removes all `relativeLinkResolution` fields from the Router config objects.
  Migration completed.

> Since Angular v15, the `RouterLink` contains the logic of the `RouterLinkWithHref` directive.
  This migration replaces all `RouterLinkWithHref` references with `RouterLink`.
  Migration completed.
```

### angular materialのバージョンアップ

`@angular/material`のライブラリを@15にバージョンアップ。

``` powershell
> ng update @angular/material@15
Using package manager: yarn
Collecting installed dependencies...
Found 55 dependencies.
Fetching dependency metadata from registry...
    Updating package.json with dependency @angular/cdk @ "15.0.3" (was "14.1.1")...
    Updating package.json with dependency @angular/material @ "15.0.3" (was "14.1.1")...
UPDATE package.json (2463 bytes)
✔ Packages successfully installed.
** Executing migrations of package '@angular/cdk' **

> Updates the Angular CDK to v15.

      ✓  Updated Angular CDK to version 15

  Migration completed.

** Executing migrations of package '@angular/material' **

> Updates the Angular Material to v15.

      ✓  Updated Angular Material to version 15

UPDATE src/app/shared/material.module.ts (1971 bytes)
UPDATE src/app/markdown-document/search/search.component.ts (7215 bytes)
UPDATE src/styles.scss (2523 bytes)
UPDATE src/_variables.scss (2424 bytes)
  Migration completed.
```

MDCベースのcomponentに移行したため、多くのmaterial componentが`Legacy`付きの旧componentに置き換わっていました。またTypographyの指定方法にも変更がある模様。後で[Migrating to MDC-based Angular Material Components](https://material.angular.io/guide/mdc-migration)を読みながらrefineしました。

## ngrxのバージョンアップ

[V15 Update Guide](https://ngrx.io/guide/migration/v15)を参考にngrxを@15にバージョンアップ

``` powershell
> ng update @ngrx/store@15
Using package manager: yarn
Collecting installed dependencies...
Found 55 dependencies.
Fetching dependency metadata from registry...
    Updating package.json with dependency @ngrx/schematics @ "15.1.0" (was "14.1.0")...
    Updating package.json with dependency @ngrx/effects @ "15.1.0" (was "14.1.0")...
    Updating package.json with dependency @ngrx/router-store @ "15.1.0" (was "14.1.0")...
    Updating package.json with dependency @ngrx/store @ "15.1.0" (was "14.1.0")...
    Updating package.json with dependency @ngrx/store-devtools @ "15.1.0" (was "14.1.0")...
UPDATE package.json (2463 bytes)
✔ Packages successfully installed.
** Executing migrations of package '@ngrx/effects' **

> The road to v15 beta.
  Migration completed.
```

### ng build error

ng buildを実行したところ`ERROR: Unterminated string token`が発生するようになっていました。

``` powershell
> yarn build
yarn run v1.22.19
$ ng build
✔ Browser application bundle generation complete.

Warning: C:/Repos/tech-log/TechLogAngularStandalone/src/environments/environment.prod.ts is part of the TypeScript compilation but it's unused.
Add only entry points to the 'files' or 'include' properties in your tsconfig.



./src/main.ts - Error: Module build failed (from ./node_modules/@ngtools/webpack/src/ivy/index.js):
Error: Transform failed with 1 error:
C:/Repos/tech-log/TechLogAngularStandalone/src/app/app.component.scss:64:84: ERROR: Unterminated string token

./src/polyfills.ts - Error: Module build failed (from ./node_modules/@ngtools/webpack/src/ivy/index.js):
Error: Transform failed with 1 error:
C:/Repos/tech-log/TechLogAngularStandalone/src/app/app.component.scss:64:84: ERROR: Unterminated string token

./node_modules/css-loader/dist/runtime/api.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\api.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/noSourceMaps.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\noSourceMaps.js: Unknown version 108 of chrome (While processing: "base$0$0")

./src/prism-vsc-dark-plus.css?ngGlobalStyle - Error: Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):
HookWebpackError: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\noSourceMaps.js: Unknown version 108 of chrome (While processing: "base$0$0")

./src/_variables.scss?ngGlobalStyle - Error: Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):
HookWebpackError: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\noSourceMaps.js: Unknown version 108 of chrome (While processing: "base$0$0")

./src/styles.scss?ngGlobalStyle - Error: Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):
HookWebpackError: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\noSourceMaps.js: Unknown version 108 of chrome (While processing: "base$0$0")


error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

[editor.component.scss:17:100: ERROR: Unterminated string token - Angular + Scss](https://stackoverflow.com/a/74427603)によると、Angular v15からbuildのdefaultがprodutionになり、`"optimization": true`の状態でbuildされるため正しいエラーメッセージになっていない模様。

一時的にproduction buildのoptimizationをfalseに変更。

``` diff
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "net6-markdown-web-engine": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:component": {
          "style": "scss"
        },
        "@schematics/angular:application": {
          "strict": true
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/tech-log",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.app.json",
            "inlineStyleLanguage": "scss",
            "assets": [
              "src/favicon.ico",
              "src/assets",
              {
                "glob": "mdi.svg",
                "input": "./node_modules/@mdi/angular-material",
                "output": "./assets"
              }
            ],
            "styles": ["src/_variables.scss", "src/styles.scss", "src/prism-vsc-dark-plus.css"],
            "stylePreprocessorOptions": {
              "includePaths": ["src"]
            },
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "3mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "2kb",
                  "maximumError": "4kb"
                }
              ],
              "fileReplacements": [
                {
                  "replace": "src/environments/environment.ts",
                  "with": "src/environments/environment.prod.ts"
                }
              ],
              "outputHashing": "all",
+             "optimization": false,
            },
            "development": {
              "buildOptimizer": false,
              "optimization": false,
              "vendorChunk": true,
              "extractLicenses": false,
              "sourceMap": true,
              "namedChunks": true
            }
          },
          "defaultConfiguration": "production"
        },
```

``` powershell
> yarn build
yarn run v1.22.19
$ ng build
✔ Browser application bundle generation complete.

Warning: C:/Repos/tech-log/TechLogAngularStandalone/src/app/app.component.scss exceeded maximum budget. Budget 2.00 kB was not met by 10.97 kB with a total of 12.97 kB.

Warning: C:/Repos/tech-log/TechLogAngularStandalone/src/app/color-check/color-check.component.scss exceeded maximum budget. Budget 2.00 kB was not met by 11.62 kB with a total of 13.62 kB.

Warning: C:/Repos/tech-log/TechLogAngularStandalone/src/app/home/home.component.scss exceeded maximum budget. Budget 2.00 kB was not met by 12.37 kB with a total of 14.37 kB.

Warning: C:/Repos/tech-log/TechLogAngularStandalone/src/app/markdown-document/display/display.component.scss exceeded maximum budget. Budget 2.00 kB was not met by 11.59 kB with a total of 13.59 kB.

Warning: C:/Repos/tech-log/TechLogAngularStandalone/src/app/markdown-document/search/search.component.scss exceeded maximum budget. Budget 2.00 kB was not met by 13.38 kB with a total of 15.38 kB.

Warning: C:/Repos/tech-log/TechLogAngularStandalone/src/app/nav/nav.component.scss exceeded maximum budget. Budget 2.00 kB was not met by 11.84 kB with a total of 13.84 kB.

Warning: C:/Repos/tech-log/TechLogAngularStandalone/src/app/net-core-api/net-core-api.component.scss exceeded maximum budget. Budget 2.00 kB was not met by 11.04 kB with a total of 13.04 kB.

Warning: C:/Repos/tech-log/TechLogAngularStandalone/src/app/shared/components/lists/document-list-item/document-list-item.component.scss exceeded maximum budget. Budget 2.00 kB was not met by 11.57 kB with a total of 13.57 kB.

Warning: C:/Repos/tech-log/TechLogAngularStandalone/src/app/shared/components/lists/document-list/document-list.component.scss exceeded maximum budget. Budget 2.00 kB was not met by 11.14 kB with a total of 13.14 kB.

Warning: C:/Repos/tech-log/TechLogAngularStandalone/src/app/shared/components/lists/expansion-document-list/expansion-document-list.component.scss exceeded maximum budget. Budget 2.00 kB was not met by 11.84 kB with a total of 13.84 kB.

Warning: C:/Repos/tech-log/TechLogAngularStandalone/src/app/shared/components/loading-bar/loading-bar.component.scss exceeded maximum budget. Budget 2.00 kB was not met by 11.25 kB with a total of 13.25 kB.

Warning: C:/Repos/tech-log/TechLogAngularStandalone/src/app/shared/components/markdown/document-header/document-header.component.scss exceeded maximum budget. Budget 2.00 kB was not met by 11.37 kB with a total of 13.37 kB.

Warning: C:/Repos/tech-log/TechLogAngularStandalone/src/app/shared/components/markdown/document-toc/document-toc.component.scss exceeded maximum budget. Budget 2.00 kB was not met by 11.68 kB with a total of 13.68 kB.

Warning: C:/Repos/tech-log/TechLogAngularStandalone/src/app/shared/components/markdown/document/document.component.scss exceeded maximum budget. Budget 2.00 kB was not met by 13.33 kB with a total of 15.33 kB.

Warning: C:/Repos/tech-log/TechLogAngularStandalone/src/app/shared/components/tags/tag-list/tag-list.component.scss exceeded maximum budget. Budget 2.00 kB was not met by 11.11 kB with a total of 13.11 kB.

Warning: C:/Repos/tech-log/TechLogAngularStandalone/src/app/shared/components/tags/tag/tag.component.scss exceeded maximum budget. Budget 2.00 kB was not met by 11.28 kB with a total of 13.28 kB.



./src/main.ts - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\src\main.ts: Unknown version 108 of chrome (While processing: "base$0$0")

./src/polyfills.ts - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\src\polyfills.ts: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/api.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\api.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/api.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\api.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/api.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\api.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/api.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\api.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/api.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\api.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/api.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\api.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/api.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\api.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/api.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\api.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/api.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\api.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/api.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\api.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/api.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\api.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/api.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\api.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/api.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\api.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/api.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\api.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/api.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\api.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/api.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\api.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/api.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\api.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/noSourceMaps.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\noSourceMaps.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/noSourceMaps.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\noSourceMaps.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/noSourceMaps.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\noSourceMaps.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/noSourceMaps.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\noSourceMaps.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/noSourceMaps.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\noSourceMaps.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/noSourceMaps.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\noSourceMaps.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/noSourceMaps.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\noSourceMaps.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/noSourceMaps.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\noSourceMaps.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/noSourceMaps.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\noSourceMaps.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/noSourceMaps.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\noSourceMaps.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/noSourceMaps.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\noSourceMaps.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/noSourceMaps.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\noSourceMaps.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/noSourceMaps.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\noSourceMaps.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/noSourceMaps.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\noSourceMaps.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/noSourceMaps.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\noSourceMaps.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/noSourceMaps.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\noSourceMaps.js: Unknown version 108 of chrome (While processing: "base$0$0")

./node_modules/css-loader/dist/runtime/noSourceMaps.js - Error: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\noSourceMaps.js: Unknown version 108 of chrome (While processing: "base$0$0")

./src/prism-vsc-dark-plus.css?ngGlobalStyle - Error: Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):
HookWebpackError: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\noSourceMaps.js: Unknown version 108 of chrome (While processing: "base$0$0")

./src/_variables.scss?ngGlobalStyle - Error: Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):
HookWebpackError: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\noSourceMaps.js: Unknown version 108 of chrome (While processing: "base$0$0")

./src/styles.scss?ngGlobalStyle - Error: Module build failed (from ./node_modules/mini-css-extract-plugin/dist/loader.js):
HookWebpackError: Module build failed (from ./node_modules/@angular-devkit/build-angular/src/babel/webpack-loader.js):
BrowserslistError: [BABEL] C:\Repos\tech-log\TechLogAngularStandalone\node_modules\css-loader\dist\runtime\noSourceMaps.js: Unknown version 108 of chrome (While processing: "base$0$0")

Error: C:/Repos/tech-log/TechLogAngularStandalone/src/app/app.component.scss exceeded maximum budget. Budget 4.00 kB was not met by 8.97 kB with a total of 12.97 kB.

Error: C:/Repos/tech-log/TechLogAngularStandalone/src/app/color-check/color-check.component.scss exceeded maximum budget. Budget 4.00 kB was not met by 9.62 kB with a total of 13.62 kB.

Error: C:/Repos/tech-log/TechLogAngularStandalone/src/app/home/home.component.scss exceeded maximum budget. Budget 4.00 kB was not met by 10.37 kB with a total of 14.37 kB.

Error: C:/Repos/tech-log/TechLogAngularStandalone/src/app/markdown-document/display/display.component.scss exceeded maximum budget. Budget 4.00 kB was not met by 9.59 kB with a total of 13.59 kB.

Error: C:/Repos/tech-log/TechLogAngularStandalone/src/app/markdown-document/search/search.component.scss exceeded maximum budget. Budget 4.00 kB was not met by 11.38 kB with a total of 15.38 kB.

Error: C:/Repos/tech-log/TechLogAngularStandalone/src/app/nav/nav.component.scss exceeded maximum budget. Budget 4.00 kB was not met by 9.84 kB with a total of 13.84 kB.

Error: C:/Repos/tech-log/TechLogAngularStandalone/src/app/net-core-api/net-core-api.component.scss exceeded maximum budget. Budget 4.00 kB was not met by 9.04 kB with a total of 13.04 kB.

Error: C:/Repos/tech-log/TechLogAngularStandalone/src/app/shared/components/lists/document-list-item/document-list-item.component.scss exceeded maximum budget. Budget 4.00 kB was not met by 9.57 kB with a total of 13.57 kB.

Error: C:/Repos/tech-log/TechLogAngularStandalone/src/app/shared/components/lists/document-list/document-list.component.scss exceeded maximum budget. Budget 4.00 kB was not met by 9.14 kB with a total of 13.14 kB.

Error: C:/Repos/tech-log/TechLogAngularStandalone/src/app/shared/components/lists/expansion-document-list/expansion-document-list.component.scss exceeded maximum budget. Budget 4.00 kB was not met by 9.84 kB with a total of 13.84 kB.

Error: C:/Repos/tech-log/TechLogAngularStandalone/src/app/shared/components/loading-bar/loading-bar.component.scss exceeded maximum budget. Budget 4.00 kB was not met by 9.25 kB with a total of 13.25 kB.

Error: C:/Repos/tech-log/TechLogAngularStandalone/src/app/shared/components/markdown/document-header/document-header.component.scss exceeded maximum budget. Budget 4.00 kB was not met by 9.37 kB with a total of 13.37 kB.

Error: C:/Repos/tech-log/TechLogAngularStandalone/src/app/shared/components/markdown/document-toc/document-toc.component.scss exceeded maximum budget. Budget 4.00 kB was not met by 9.68 kB with a total of 13.68 kB.

Error: C:/Repos/tech-log/TechLogAngularStandalone/src/app/shared/components/markdown/document/document.component.scss exceeded maximum budget. Budget 4.00 kB was not met by 11.33 kB with a total of 15.33 kB.

Error: C:/Repos/tech-log/TechLogAngularStandalone/src/app/shared/components/tags/tag-list/tag-list.component.scss exceeded maximum budget. Budget 4.00 kB was not met by 9.11 kB with a total of 13.11 kB.

Error: C:/Repos/tech-log/TechLogAngularStandalone/src/app/shared/components/tags/tag/tag.component.scss exceeded maximum budget. Budget 4.00 kB was not met by 9.28 kB with a total of 13.28 kB.


error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

大量のエラーが出ていますが、よく読んでみると2種類のエラーが出ていることがわかります。

- `Unknown version 108 of chrome`
- `exceeded maximum budget`

簡単な方の`exceeded maximum budget`に関しては、cssファイルのサイズが許容量を超えているエラーが出ているので`anyComponentStyle`の条件をWarning:20kb、Error:40kbに緩和。

``` powershell
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "500kb",
    "maximumError": "3mb"
  },
  {
    "type": "anyComponentStyle",
    "maximumWarning": "20kb",
    "maximumError": "40kb"
  }
],
```

`Unknown version 108 of chrome`のエラーに関しては、[Unknown version 87 of chrome when compiling an Angular library project](https://github.com/angular/angular/issues/40535)によると、内部で利用しているbrowserslistのバージョンが低いと発生する模様。多くの記事で`npx browserslist --update-db`の実行で解決するとあったのですが、yarnを使っている場合はうまくいかないようです。

npxだと更新されるのが`package-lock.json`になるのですが、yarnを使用している場合はこのファイルが存在せず、代わりにyarn.lockが作られます。こちらを更新しないといけないのですが、yarnでうまく実行する方法がなさそうです。browserslistの関連issueがopenの状態でした。

結局node_modulesに以前ダウンロードしたpackageが古いのが問題なわけで、node_modulesフォルダを削除して全packageを取得しなおすことで解決しました。

## full standalone component化対応

以下の二つの記事を参考にして、angular appからNgModuleを無くすfull standalone component化を行いました。

- [Angular Standalone Components: Welcome to a World Without NgModule](https://netbasal.com/angular-standalone-components-welcome-to-a-world-without-ngmodule-abd3963e89c5)
- [Angular Standalone Componentsを試してみよう](https://blog.jbs.co.jp/entry/2022/09/22/085400)

試行錯誤しつつ、手順としては以下のようになりました。

- パーツとなる子・孫componentを一つづつstandalone component化する
  - standalone componentを利用している親componentがビルドエラーになるので、ビルドが通るようにfeature moduleやapp moduleのimportに一時的に参照を追加する
- 親componentを一つづつstandalone component化する
  - 都度ビルドチェックを行い、エラーが発生したらmoduleの参照調整を行う
  - shared moduleなどでまとめて参照していたcomponent群を、component毎に個別に必要な分だけimportする必要がある
- app.component以外のすべてのcomponentをstandalone component化したら、最後にapp.componentをstandalone component化し、`main.ts`でのbootstrap処理を変更する
  - `platformBrowserDynamic().bootstrapModule(AppModule)`というmodule呼び出しの形式から、`bootstrapApplication(AppComponent)`というcomponent呼び出しの形式への変更。これによりapp.moduleが不要になる
  - 3rd partyのmoduleやroutingの設定など、どうしても必要になるmoduleは`bootstrapApplication`の第二引数（provider配列）の中で指定する
- 不要となったすべてのmoduleを削除する

standalone componentの利点として「Angular の学ぶべき項目が減り、またアプリケーションをよりシンプルに開発できるようになります。」というのが挙げられていますが、そこまでシンプルになる感じはしませんでした。各componentがより疎になり、個々のcomponentで完結・再利用しやすくなるのは良い点だと感じました。

新規appをこれから開発する場合、最初からすべてstandalone componentで組むなら積極的に採用したいです。移行作業はかなり面倒なので、わざわざfull standalone component化する利点は現時点では特に無さそうです。将来的に「zoneless化によるパフォーマンス向上」とfull standalone component化が絡んでくるようであれば、検討の価値が増すような気がします。

## 関連項目

- [Cannot --update-db with Yarn on Windows](https://github.com/browserslist/browserslist/issues/531)
- [Migrating to MDC-based Angular Material Components](https://material.angular.io/guide/mdc-migration)
- [Using NgRx Packages with Standalone Angular Features](https://dev.to/ngrx/using-ngrx-packages-with-standalone-angular-features-53d8)
- [Angular Material - Material Design Icons](https://github.com/Templarian/MaterialDesign-Angular-Material)
