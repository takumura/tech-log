---
title: ".NET(BFF)とAngularでMarkdown Webサイト生成エンジンを作る（Angular Library）"
date: "2023-12-28"
category: "csharp"
tag:
  - .NET 8
  - angular
  - library
  - storybook
  - unified
  - remark
  - rehype
---

本サイトは自作のwebサイト生成エンジンで生成されています。

- 当初は2019年に .NET Core 2.1とAngular v7で開発
- 2022年にバックエンド側は .NET6、フロントエンド側はAngular v13にそれぞれバージョンアップ

2023年末時点で、バックエンド側は .NET 8、フロントエンド側はAngular v17が最新版となっています。進化の波に取り残されないように、最新バージョンのモジュールや技術を活用してwebサイト生成エンジンを再開発してみようと思います。

この記事では、フロントエンドのライブラリ編ということで、Angular SPAサイトをパーツとなるコンポーネントをlibraryとして作成します。また、Storybookを導入してlibrary単体で動作確認できるようにすることを目指します。

## 開発方針

- 最初にAngularのlibrary projectとStorybookの設定を完了させて、各パーツをStorybook上で確認しながら作っていく
- [新しいControl flow](https://angular.dev/essentials/conditionals-and-loops)や[Deferrable Views](https://angular.dev/guide/defer)など、新しい機能を積極的に試してみる
- これまでは状態管理にNGRXを利用していたが、今回はSignalを利用した開発にチャレンジする

### やろうとしたけど一旦諦めたこと

- これまではデザインシステムにAngular Materialを利用していたが、今回は[Tailwind CSS](https://tailwindcss.com/)を試してみる
  - [Using tailwindcss in custom angular library - Stack Overflow](https://stackoverflow.com/questions/67706691/using-tailwindcss-in-custom-angular-library)や[Tailwind not being applied to library - Stack Overflow](https://stackoverflow.com/questions/71695814/tailwind-not-being-applied-to-library)を読むに、libraryプロジェクトではcssスタイルの適用に難ありな感じなので、後日チャレンジする
- yarn 2へのupgrade
  - [Yarn PnP Support Status](https://github.com/angular/angular-cli/issues/16980)のチケットがまだOpenで、PnPの機能を使う際には注意する必要がありそう。PnPを使わず、これまで通りnode_modulesを利用することもできるようだが、後日チャレンジする。一旦package managerをnpmに戻す

## Angular libraryの作成

Angular cliを最新の状態(17.0.8 @2023-12-29)に更新

``` powershell
> npm update -g @angular/cli
> ng config --global cli.packageManager npm
> > ng version

     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/


Angular CLI: 17.0.8
Node: 20.10.0
Package Manager: npm 10.2.3
OS: win32 x64

Angular:
...

Package                      Version
------------------------------------------------------
@angular-devkit/architect    0.1700.8 (cli-only)
@angular-devkit/core         17.0.8 (cli-only)
@angular-devkit/schematics   17.0.8 (cli-only)
@schematics/angular          17.0.8 (cli-only)
```

[Creating libraries](https://angular.dev/tools/libraries/creating-libraries)を参考に、新しいプロジェクトを`--no-create-application`optionで作成してlibraryプロジェクトを追加

```
> ng new docupacker-angular-lib --no-create-application
CREATE docupacker-angular-lib/angular.json (139 bytes)
CREATE docupacker-angular-lib/package.json (1005 bytes)
CREATE docupacker-angular-lib/README.md (1074 bytes)
CREATE docupacker-angular-lib/tsconfig.json (903 bytes)
CREATE docupacker-angular-lib/.editorconfig (274 bytes)
CREATE docupacker-angular-lib/.gitignore (548 bytes)
CREATE docupacker-angular-lib/.vscode/extensions.json (130 bytes)
CREATE docupacker-angular-lib/.vscode/launch.json (470 bytes)
CREATE docupacker-angular-lib/.vscode/tasks.json (938 bytes)
✔ Packages installed successfully.
    Directory is already under version control. Skipping initialization of git.

> cd docupacker-angular-lib

> ng generate library docupacker-angular-lib
CREATE projects/docupacker-angular-lib/ng-package.json (171 bytes)
CREATE projects/docupacker-angular-lib/package.json (226 bytes)
CREATE projects/docupacker-angular-lib/README.md (1105 bytes)
CREATE projects/docupacker-angular-lib/tsconfig.lib.json (314 bytes)
CREATE projects/docupacker-angular-lib/tsconfig.lib.prod.json (240 bytes)
CREATE projects/docupacker-angular-lib/tsconfig.spec.json (273 bytes)
CREATE projects/docupacker-angular-lib/src/public-api.ts (166 bytes)
CREATE projects/docupacker-angular-lib/src/lib/docupacker-angular-lib.component.spec.ts (696 bytes)
CREATE projects/docupacker-angular-lib/src/lib/docupacker-angular-lib.component.ts (270 bytes)
CREATE projects/docupacker-angular-lib/src/lib/docupacker-angular-lib.service.spec.ts (429 bytes)
CREATE projects/docupacker-angular-lib/src/lib/docupacker-angular-lib.service.ts (149 bytes)
UPDATE angular.json (1209 bytes)
UPDATE package.json (1082 bytes)
UPDATE tsconfig.json (1007 bytes)
✔ Packages installed successfully.
```

## Angular Materialの導入

[Add Angular Material to a custom library - Stack Overflow](https://stackoverflow.com/questions/53359301/add-angular-material-to-a-custom-library)を参考に、peerDependenciesに`@angular/material`を設定しました。

> TODO: project直下のpackage.jsonなのか、lib配下のpackage.jsonなのか？後で確認する

``` powershell
> ng add @angular/material
ℹ Using package manager: npm
✔ Found compatible package version: @angular/material@17.0.4.
✔ Package information loaded.

The package @angular/material@17.0.4 will be installed and executed.
Would you like to proceed? Yes
✔ Packages successfully installed.
? Choose a prebuilt theme name, or "custom" for a custom theme: Indigo/Pink        [ Preview: https://material.angular.io?theme=indigo-pink ]
? Set up global Angular Material typography styles? No
? Include the Angular animations module? Include and enable animations
UPDATE package.json (1148 bytes)
✔ Packages installed successfully.
    Angular Material has been set up in your workspace. There is no additional setup required for consuming Angular Material in your library project.
    
    If you intended to run the schematic on a different project, pass the `--project` option.
```

## Storybookの導入

[StorybookのGet Started](https://storybook.js.org/docs/get-started/install)のページを参考にしていきます。

`storybook init`を実行後、途中の選択肢は`Do you want to use Compodoc for documentation?`だけで、ほぼ自動的に設定が完了します。設定完了後、すぐにstorybookの起動が行われていたのですが気が付かず、しばらく待ってしまいました。

``` powershell
> > npx storybook@latest init
Need to install the following packages:
storybook@7.6.7
Ok to proceed? (y) y

 storybook init - the simplest way to add a Storybook to your project. 

 • Detecting project type. ✓
 • Preparing to install dependencies. ✓



up to date, audited 1071 packages in 1s

123 packages are looking for funding
  run `npm fund` for details

4 moderate severity vulnerabilities

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
. ✓
 • Adding Storybook support to your "Angular" app    Adding Storybook support to your "docupacker-angular-lib" project
√ Do you want to use Compodoc for documentation? ... yes

  ✔ Getting the correct version of 11 packages
  ✔ Installing Storybook dependencies
 • Preparing to install dependencies. ✓



up to date, audited 1888 packages in 3s

265 packages are looking for funding
  run `npm fund` for details

4 moderate severity vulnerabilities

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
. ✓

attention => Storybook now collects completely anonymous telemetry regarding usage.
This information is used to shape Storybook's roadmap and prioritize features.
You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
https://storybook.js.org/telemetry

╭─────────────────────────────────────────────────────────────────────────────────────────────╮
│                                                                                             │
│   Storybook was successfully installed in your project! 🎉                                  │
│   To run Storybook manually, run ng run docupacker-angular-lib:storybook. CTRL+C to stop.   │
│                                                                                             │
│   Wanna know more about Storybook? Check out https://storybook.js.org/                      │
│   Having trouble or want to chat? Join us at https://discord.gg/storybook/                  │
│                                                                                             │
╰─────────────────────────────────────────────────────────────────────────────────────────────╯

Running Storybook
Option '--' has been specified multiple times. The value '--quiet' will be used.
Error: Schema validation failed with the following errors:
  Data path "" must NOT have additional properties().
```

install後の自動実行はエラーで終了しましたが、`npm run storybook`では正常に実行されました。`--quiet`optionの指定が何かおかしいのかもしれません。

Defaultで`Button`、`Header`、`Page`のstoryが追加され、画面上で動作を確認できる状態になりました。

### angular.jsonの編集

component作成を始める前に、以下の２点の挙動を調整するためにangular.jsonを編集しました。prefixに関しては`ng new`時にoptionを設定できるようなので、次回からはそれを使おうと思いました。

- component作成時のdefault styleをscssで作成する
- prefixを"docup"にする

``` diff
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "docupacker-angular-lib": {
      "projectType": "library",
+      "schematics": {
+        "@schematics/angular:component": {
+          "style": "scss"
+        }
+      },
      "root": "projects/docupacker-angular-lib",
      "sourceRoot": "projects/docupacker-angular-lib/src",
-      "prefix": "lib",
+      "prefix": "docup",
      "architect": {
....
```

また、[SB not load Angular material styles when the project is library](https://github.com/storybookjs/storybook/issues/14912#issuecomment-1306775233)を参考に、angular.jsonの`architect > storybook`のoptionでstyleを指定することで、Angular MaterialのテーマがStorybook上で反映されました。

``` diff
...
"storybook": {
  "builder": "@storybook/angular:start-storybook",
  "options": {
    "configDir": "projects/docupacker-angular-lib/.storybook",
    "browserTarget": "docupacker-angular-lib:build",
+    "styles": ["node_modules/@angular/material/prebuilt-themes/indigo-pink.css"],
    "compodoc": true,
    "compodocArgs": [
      "-e",
      "json",
      "-d",
      "projects/docupacker-angular-lib"
    ],
    "port": 6006
  }
},
...
```

### preview-head.htmlの作成

[AngularプロジェクトにStorybookを導入するときに行ったこと - Qiita](https://qiita.com/taaabooon/items/24cf819a04b6fd0608bd#4-angular-material%E3%81%AE%E8%A8%AD%E5%AE%9A%E3%82%92%E3%81%84%E3%82%8C%E3%82%8B)を参考に、Angular Material Iconを表示するためのlink要素をpreview-head.htmlに設定しました。Google Fonts(Noto Sans JP)の設定も併せて実施されました。

### preview.tsの編集

Storyがタイトル昇順で並ぶように、`storySort`optionを追加しました。

```diff
import type { Preview } from "@storybook/angular";
import { setCompodocJson } from "@storybook/addon-docs/angular";
import docJson from "../documentation.json";
setCompodocJson(docJson);

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
+    options: {
+      storySort: {
+        method: 'alphabetical'
+      },
+    }
  },
};

export default preview;

```

## library componentsの作成

前準備が完了したので、Markdown Webサイト生成エンジン専用のcomponentとstoryを追加していきました。
