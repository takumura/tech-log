---
title: "Angular v13からv14へのアップデート"
date: "2022-08-11"
category: "Angular"
tag:
  - angular
  - angular material
  - ngrx
  - version up
---

Angular routerがv14からtitle propertyを持つようになり、NGRXでもgetTitle selectorで簡単にタイトルをゲットできるようになるようです。これをモチベーションにangular 13から14へのアップグレードを実施しました。

## v13 to v14のアップデート手順

[Angular Update Guide](https://update.angular.io/?l=3&v=13.0-14.0)を参考に作業を実施。

### Angular関連ライブラリのアップデート

``` powershell
> yarn run ng update @angular/core@14 @angular/cli@14

yarn run v1.22.18
$ ng update @angular/core@14 @angular/cli@14
The installed Angular CLI version is outdated.
Installing a temporary Angular CLI versioned 14.1.2 to perform the update.
✔ Package successfully installed.
Using package manager: yarn
Collecting installed dependencies...
Found 51 dependencies.
Fetching dependency metadata from registry...
                  Package "@angular-eslint/schematics" has an incompatible peer dependency to "@angular/cli" (requires ">= 13.0.0 < 14.0.0", would install "14.1.2").
× Migration failed: Incompatible peer dependencies found.
Peer dependency warnings when installing dependencies means that those dependencies might not work correctly together.
You can use the '--force' option to ignore incompatible peer dependencies and instead address these warnings later.
  See "C:\Users\METALA~1\AppData\Local\Temp\ng-WtdDcB\angular-errors.log" for further details.

error Command failed with exit code 1.
```

エラーメッセージを見る感じ`@angular-eslint/schematics`も一緒にupdateしたほうが良さそうです。

``` powershell
>  yarn run ng update @angular/core@14 @angular/cli@14 @angular-eslint/schematics@14

yarn run v1.22.18
$ ng update @angular/core@14 @angular/cli@14 @angular-eslint/schematics@14
The installed Angular CLI version is outdated.
Installing a temporary Angular CLI versioned 14.1.2 to perform the update.
✔ Package successfully installed.
Using package manager: yarn
Collecting installed dependencies...
Found 51 dependencies.
Fetching dependency metadata from registry...
    Updating package.json with dependency @angular-devkit/build-angular @ "14.1.2" (was "13.1.2")...
    Updating package.json with dependency @angular-eslint/builder @ "14.0.2" (was "13.0.1")...
    Updating package.json with dependency @angular-eslint/eslint-plugin @ "14.0.2" (was "13.0.1")...
    Updating package.json with dependency @angular-eslint/eslint-plugin-template @ "14.0.2" (was "13.0.1")...
    Updating package.json with dependency @angular-eslint/schematics @ "14.0.2" (was "13.0.1")...
    Updating package.json with dependency @angular-eslint/template-parser @ "14.0.2" (was "13.0.1")...
    Updating package.json with dependency @angular/cli @ "14.1.2" (was "13.1.2")...
    Updating package.json with dependency @angular/compiler-cli @ "14.1.2" (was "13.1.1")...
    Updating package.json with dependency typescript @ "4.7.4" (was "4.5.4")...
    Updating package.json with dependency @angular/animations @ "14.1.2" (was "13.1.1")...
    Updating package.json with dependency @angular/common @ "14.1.2" (was "13.1.1")...
    Updating package.json with dependency @angular/compiler @ "14.1.2" (was "13.1.1")...
    Updating package.json with dependency @angular/core @ "14.1.2" (was "13.1.1")...
    Updating package.json with dependency @angular/forms @ "14.1.2" (was "13.1.1")...
    Updating package.json with dependency @angular/platform-browser @ "14.1.2" (was "13.1.1")...
    Updating package.json with dependency @angular/platform-browser-dynamic @ "14.1.2" (was "13.1.1")...
    Updating package.json with dependency @angular/router @ "14.1.2" (was "13.1.1")...
UPDATE package.json (2301 bytes)
✔ Packages successfully installed.
** Executing migrations of package '@angular-eslint/schematics' **

> Updates @angular-eslint to v14.
UPDATE package.json (2307 bytes)
UPDATE angular.json (4143 bytes)
✔ Packages installed successfully.
  Migration completed.

** Executing migrations of package '@angular/cli' **

> Remove 'defaultProject' option from workspace configuration.
  The project to use will be determined from the current working directory.
UPDATE angular.json (4095 bytes)
  Migration completed.

> Remove 'showCircularDependencies' option from browser and server builders.
  Migration completed.

> Replace 'defaultCollection' option in workspace configuration with 'schematicCollections'.
UPDATE angular.json (4112 bytes)
  Migration completed.

UPDATE tsconfig.json (936 bytes)  Migration completed.

** Executing migrations of package '@angular/core' **

> As of Angular version 13, `entryComponents` are no longer necessary.
  Migration completed.

> In Angular version 14, the `pathMatch` property of `Routes` was updated to be a strict union of the two valid options: `'full'|'prefix'`.
  `Routes` and `Route` variables need an explicit type so TypeScript does not infer the property as the looser `string`.
  Migration completed.

> As of Angular version 14, Forms model classes accept a type parameter, and existing usages must be opted out to preserve backwards-compatibility.
  Migration completed.

Done in 156.21s.
```

正常終了しました。

### Angular Material関連ライブラリのアップデート

続けてangular materialのアップグレードを行おうとしたところ、先の変更をcommitしてからじゃないとダメ！と怒られてしまいました。

``` powershell
> yarn run ng update @angular/material@14

yarn run v1.22.18
$ ng update @angular/material@14
Error: Repository is not clean. Please commit or stash any changes before updating.
error Command failed with exit code 1.
```

コミット後に再実施します。

``` powershell
> yarn run ng update @angular/material@14

yarn run v1.22.18
$ ng update @angular/material@14
Using package manager: yarn
Collecting installed dependencies...
Found 51 dependencies.
Fetching dependency metadata from registry...
    Updating package.json with dependency @angular/cdk @ "14.1.1" (was "13.1.3")...
    Updating package.json with dependency @angular/material @ "14.1.1" (was "13.1.3")...
UPDATE package.json (2306 bytes)
✔ Packages successfully installed.
** Executing migrations of package '@angular/cdk' **

> Updates the Angular CDK to v14.

      ✓  Updated Angular CDK to version 14

  Migration completed.

** Executing migrations of package '@angular/material' **

> Updates the Angular Material to v14.

      ✓  Updated Angular Material to version 14

  Migration completed.

Done in 38.79s.
```

Basicの手順は以上で終了です。この時点でのpackage.jsonをチェックします。

``` json
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
    "lint": "ng lint"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "^14.1.2",
    "@angular/cdk": "14.1.1",
    "@angular/common": "^14.1.2",
    "@angular/compiler": "^14.1.2",
    "@angular/core": "^14.1.2",
    "@angular/forms": "^14.1.2",
    "@angular/material": "14.1.1",
    "@angular/platform-browser": "^14.1.2",
    "@angular/platform-browser-dynamic": "^14.1.2",
    "@angular/router": "^14.1.2",
    "@mdi/angular-material": "^7.0.96",
    "@ngrx/effects": "^13.2.0",
    "@ngrx/router-store": "^13.2.0",
    "@ngrx/store": "^13.0.2",
    "@ngrx/store-devtools": "^13.2.0",
    "jest-editor-support": "*",
    "rehype-attr": "^2.0.8",
    "rehype-autolink-headings": "^6.1.1",
    "rehype-external-links": "^1.0.1",
    "rehype-prism-plus": "^1.4.2",
    "rehype-raw": "^6.1.1",
    "rehype-slug": "^5.0.1",
    "rehype-stringify": "^9.0.3",
    "remark-parse": "^10.0.1",
    "remark-rehype": "^10.1.0",
    "rxjs": "~7.4.0",
    "tslib": "^2.3.0",
    "unified": "^10.1.2",
    "zone.js": "~0.11.4"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^14.1.2",
    "@angular-eslint/builder": "14.0.2",
    "@angular-eslint/eslint-plugin": "14.0.2",
    "@angular-eslint/eslint-plugin-template": "14.0.2",
    "@angular-eslint/schematics": "14.0.2",
    "@angular-eslint/template-parser": "14.0.2",
    "@angular/cli": "^14.1.2",
    "@angular/compiler-cli": "^14.1.2",
    "@ngrx/schematics": "^14.0.2",
    "@types/jasmine": "~3.10.0",
    "@types/node": "^12.11.1",
    "@typescript-eslint/eslint-plugin": "^5.29.0",
    "@typescript-eslint/parser": "^5.29.0",
    "eslint": "^8.18.0",
    "eslint-plugin-ngrx": "^2.0.0",
    "jasmine-core": "~3.10.0",
    "karma": "~6.3.0",
    "karma-chrome-launcher": "~3.1.0",
    "karma-coverage": "~2.1.0",
    "karma-jasmine": "~4.0.0",
    "karma-jasmine-html-reporter": "~1.7.0",
    "typescript": "~4.7.4"
  }
}
```

### NGRX関連ライブラリのアップデート

NGRX系がv13なので、これもupdateします。

``` powershell
> yarn run ng update @ngrx/store@14

yarn run v1.22.18
$ ng update @ngrx/store@14
Using package manager: yarn
Collecting installed dependencies...
Found 51 dependencies.
Fetching dependency metadata from registry...
    Updating package.json with dependency @ngrx/schematics @ "14.1.0" (was "14.0.2")...
    Updating package.json with dependency @ngrx/effects @ "14.1.0" (was "13.2.0")...
    Updating package.json with dependency @ngrx/router-store @ "14.1.0" (was "13.2.0")...
    Updating package.json with dependency @ngrx/store @ "14.1.0" (was "13.0.2")...
    Updating package.json with dependency @ngrx/store-devtools @ "14.1.0" (was "13.2.0")...
    Updating package.json with dependency rxjs @ "7.5.6" (was "7.4.0")...
UPDATE package.json (2306 bytes)
✔ Packages successfully installed.
** Executing migrations of package '@ngrx/router-store' **

> The road to v14.
  Migration completed.

Done in 35.67s.
```

## 関連項目

- [Angular v14 is now available!](https://blog.angular.io/angular-v14-is-now-available-391a6db736af)
- [router.selectors.ts - NGRX](https://github.com/santoshyadavdev/platform/blob/master/projects/ngrx.io/content/examples/router-store-selectors/src/app/router.selectors.ts)
