---
created: 2022-10-10
updated: 2022-10-10
type: snapshot
category: article
tags:
  - activity
  - tech/lang/csharp
  - tech/lang/typescript/angular
  - tech/web/markdown
publish: "true"
---
# 🏃 活動概要
> [!ABSTRACT] Overview
> 旧サイトは自作のwebサイト生成エンジンで生成されています。自作エンジンは2019年に.NET Core 2.1とAngular v7で開発しました。それから時は流れ、2021年末時点でバックエンド側は.NET6に、フロントエンド側はAngular v13にそれぞれバージョンアップされています。
> 進化の波に取り残されないように、最新バージョンのモジュールを使ってwebサイト生成エンジンを再開発してみようと思います。
> \
> 本Noteでは、フロントエンド編ということでAngularのSPAサイトをを実装していきます。

## 🧩 開発準備

VSプロジェクト作成時、最新のAngular v13ではエラーが発生したので、一時的にAngular v12を利用していました。本格的にサイト実装を始める前に、まずはv13へバージョンアップします。

angularのバージョンアップといえば`ng update`を使うべきだと思うのですが、VSが作成したテンプレートが非常に質素で通常のサイトとは異なっていました。変更点を探るため、v13のcliで`ng new`した内容と比較してみます。

```sh frame="none"
> npm uninstall -g @angular/cli
> npm install -g @angular/cli
> ng version
added 183 packages, and audited 184 packages in 33s

22 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
PS C:\WINDOWS\system32> ng version

     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/


Angular CLI: 13.1.2
Node: 16.13.1
Package Manager: yarn 1.22.15
OS: win32 x64

Angular:
...

Package                      Version
------------------------------------------------------
@angular-devkit/architect    0.1301.2 (cli-only)
@angular-devkit/core         13.1.2 (cli-only)
@angular-devkit/schematics   13.1.2 (cli-only)
@schematics/angular          13.1.2 (cli-only)
```

```sh frame="none"
> ng new net6-markdown-web-engine
? Would you like to add Angular routing? Yes
? Which stylesheet format would you like to use? SCSS   [ https://sass-lang.com/documentation/syntax#scss
 ]
CREATE net6-markdown-web-engine/angular.json (3315 bytes)
CREATE net6-markdown-web-engine/package.json (1088 bytes)
CREATE net6-markdown-web-engine/README.md (1067 bytes)
CREATE net6-markdown-web-engine/tsconfig.json (863 bytes)
CREATE net6-markdown-web-engine/.editorconfig (274 bytes)
CREATE net6-markdown-web-engine/.gitignore (620 bytes)
CREATE net6-markdown-web-engine/.browserslistrc (600 bytes)
CREATE net6-markdown-web-engine/karma.conf.js (1441 bytes)
CREATE net6-markdown-web-engine/tsconfig.app.json (287 bytes)
CREATE net6-markdown-web-engine/tsconfig.spec.json (333 bytes)
CREATE net6-markdown-web-engine/.vscode/extensions.json (130 bytes)
CREATE net6-markdown-web-engine/.vscode/launch.json (474 bytes)
CREATE net6-markdown-web-engine/.vscode/tasks.json (938 bytes)
CREATE net6-markdown-web-engine/src/favicon.ico (948 bytes)
CREATE net6-markdown-web-engine/src/index.html (307 bytes)
CREATE net6-markdown-web-engine/src/main.ts (372 bytes)
CREATE net6-markdown-web-engine/src/polyfills.ts (2338 bytes)
CREATE net6-markdown-web-engine/src/styles.sass (80 bytes)
CREATE net6-markdown-web-engine/src/test.ts (745 bytes)
CREATE net6-markdown-web-engine/src/assets/.gitkeep (0 bytes)
CREATE net6-markdown-web-engine/src/environments/environment.prod.ts (51 bytes)
CREATE net6-markdown-web-engine/src/environments/environment.ts (658 bytes)
CREATE net6-markdown-web-engine/src/app/app-routing.module.ts (245 bytes)
CREATE net6-markdown-web-engine/src/app/app.module.ts (393 bytes)
CREATE net6-markdown-web-engine/src/app/app.component.html (23364 bytes)
CREATE net6-markdown-web-engine/src/app/app.component.spec.ts (1127 bytes)
CREATE net6-markdown-web-engine/src/app/app.component.ts (229 bytes)
CREATE net6-markdown-web-engine/src/app/app.component.sass (0 bytes)
/ Installing packages (yarn)...
√ Packages installed successfully.
```

比較したところ、apiのproxy（VSテンプレート独自の変更点）以外の際はほとんどありませんでした。IE11が正式にサポート対象から外れたようで、polifills.ts等からIE11の記述が消えているくらいで、angular.jsonもほぼほぼ同じ。移行はとても簡単そうです。せっかくなので、サーバサイドapiを使うページは名前を変えて残した状態でv12とv13のソースをマージしました。

## 🧩 linterのセットアップ

TSlintからESLintへのマイグレーションは[AngularのRoadmapでCompleted Q4 2020](https://angular.io/guide/roadmap#migrate-to-eslint)となっており、`ng new`したコード中からlintの設定がなくなったようです。

ググったところ[angular-eslint](https://github.com/angular-eslint/angular-eslint)を利用する記事が多く目についたので、今回はこれを試してみます。1コマンドで作業は完了です。

```sh frame="none"
> ng add @angular-eslint/schematics
ℹ Using package manager: yarn
✔ Found compatible package version: @angular-eslint/schematics@13.0.1.
✔ Package information loaded.

The package @angular-eslint/schematics@13.0.1 will be installed and executed.
Would you like to proceed? Yes
✔ Package successfully installed.

    All @angular-eslint dependencies have been successfully installed 🎉

    Please see https://github.com/angular-eslint/angular-eslint for how to add ESLint configuration to your project.


    We detected that you have a single project in your workspace and no existing linter wired up, so we are configuring ESLint for you automatically.

    Please see https://github.com/angular-eslint/angular-eslint for more information.

CREATE .eslintrc.json (984 bytes)
UPDATE package.json (1662 bytes)
UPDATE angular.json (3692 bytes)
✔ Packages installed successfully.
```

## 🛠️ Angular Materialの設定

デザインシステムにAngular Materialを設定します。当初はFluent UI web componentsを試そうと思ったのですが、Angular Materialを前回利用したときに、やり残していた課題があったので今回再チャレンジします。

```sh frame="none"
> ng add @angular/material
ℹ Using package manager: yarn
✔ Found compatible package version: @angular/material@13.1.3.
✔ Package information loaded.

The package @angular/material@13.1.3 will be installed and executed.
Would you like to proceed? Yes
✔ Package successfully installed.
? Choose a prebuilt theme name, or "custom" for a custom theme: Indigo/Pink        [ Preview: https://material.angular.io?theme=indigo-pink ]
? Set up global Angular Material typography styles? No
? Set up browser animations for Angular Material? Yes
UPDATE package.json (1727 bytes)
✔ Packages installed successfully.
UPDATE src/app/app.module.ts (737 bytes)
UPDATE angular.json (3982 bytes)
UPDATE src/index.html (613 bytes)
UPDATE src/styles.scss (182 bytes)
```

## 🧩 nav componentの追加

以前のバージョンで利用していたNav Componentをほぼそのまま移行することができました。

以前のバージョンではAngular.ioの実装から、レイアウトのbreakpoint設定を拝借していたのですが、`handset`を利用していると画面のwidthを変えたときに変なところでサイドバーが出るので、この実装を変更することにしました。

[AngularMaterialのレイアウト設定](https://material.angular.io/cdk/layout/overview#predefined-breakpoints)によると、handsetのルールは`(max-width: 599.98px) and (orientation: portrait), (max-width: 959.98px) and (orientation: landscape)`でした。orientationの関係でmax-widthが600-960の間でもisHandSetがtrueになる瞬間があるのだと思います。

`XSmall`と`Small`のときはサイドバーを表示しないように変更したらイイ感じになりました。

``` ts
isSmall$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.XSmall, Breakpoints.Small])
    .pipe(map((result) => result.matches));
```

## 🧩 loading bar componentの追加

こちらも以前のバージョンで実装したcomponentをほぼそのまま移行できました。勉強不足でasync pipeを使わずにstateをローカル変数に持ち直して表示/非表示の制御をしていた部分を、シンプルに書き直す修正だけ行いました。

## 🧩 NGRXの導入

markdownからコンバートしたjsonファイルを`ngrx store`に読み込んだら、どのcomponetからでも好きに呼び出せてイイ感じにならないかな？という発想から、今回はNGRXを利用してみることにします。

```sh frame="none"
> ng add @ngrx/store@latest
ℹ Using package manager: yarn
✔ Package information loaded.

The package @ngrx/store@latest will be installed and executed.
Would you like to proceed? Yes
✔ Package successfully installed.

    The NgRx ESLint Plugin is installed and configured with the recommended config.

    If you want to change the configuration, please see https://github.com/timdeschryver/eslint-plugin-ngrx/#eslint-plugin-ngrx.

UPDATE src/app/app.module.ts (1090 bytes)
UPDATE package.json (1793 bytes)
UPDATE .eslintrc.json (1098 bytes)
✔ Packages installed successfully.
✔ Packages installed successfully.
``

公式のガイドに[ESLint NgRx Plugin](https://ngrx.io/guide/eslint-plugin)が載っていたので導入してみます。
``` powershell
> ng add eslint-plugin-ngrx
Skipping installation: Package already installed
? Which config would you like to use? recommended (all the recommended rules configured with the recommended severity) [https://github.com/timdeschryver/eslint-plugin-ngrx/blob/main/src/configs/recommended.ts]

      The NgRx ESLint Plugin is installed and configured with the 'recommended' config.

      If you want to change the configuration, please see https://github.com/timdeschryver/eslint-plugin-ngrx/#eslint-plugin-ngrx.

UPDATE .eslintrc.json (1098 bytes)
```

## markdownのhtml変換処理

以前からmarkdown⇒htmlへの変換処理はクライアント(angular)側で行っていました。

- バックエンド側でfrontmatter付きmarkdownをmarkdown記法のままjsonに変換
  - 変換元mdファイルと1対1対応するjsonファイル
  - すべてのjsonファイルをまとめたindex.json
- 検索画面ではindex.jsonを利用してサーチを実施
- 個々のドキュメントページはurlから対象のjsonファイルを取得
- clientはmarkdown部分をjsonから抜き出して、[unified(remark, rehype)](https://unifiedjs.com/)を利用してhtmlに変換

### jsonファイル読み込み処理の変更点

前半のjsonファイルの読み込み部分について、index.jsonを直接importする記述に変更しました

- ngrxのactionでindex.jsonを読み込み、個々のドキュメントも探すようにしたので個々のドキュメントファイルをfetchする必要がなくなった
- debug実行時、index.jsonに変更が発生すると自動でreloadが掛かるので、markdownの更新が画面に自動反映されるようになった。（嬉しい副産物）

### unifiedのプラグインチェック

後半のunifiedによる変換処理について、remarkのmarkdownパーサーエンジンが[micromark](https://github.com/micromark/micromark)に置き換わるという大きな変更が起きていたようです。その影響で、以前使っていたプラグインが使えなくなるといった影響が出ていました。この機会に使用するプラグインの厳選を行いました。

- remark-parse
  - 標準plugin。markdownをmdast(syntax tree)に変換
- [remark-attr](https://github.com/arobase-che/remark-attr)
  - markdownに記述したattributeを変換後のhtmlに付与。cssクラスをセットする等の用途で使用していたが、micromarkの移行により利用不可になった。
  - <https://github.com/arobase-che/remark-attr/issues/22>
- remark-gfm
  - 標準plugin。GitHub Flavored Markdown(autolink literals, footnotes, strikethrough, tables, tasklists)を利用するために利用
- remark-rehype
  - 標準plugin。mdastをhastに変換
- rehype-raw
  - 標準plugin:。markdown内のhtmlタグをsyntax treeのnodeに含める
- rehype-slug
  - 標準plugin。Hタグにidを付与
- rehype-autolink-headings
  - 標準plugin。Hタグへのlinkを作成
- rehype-External-Links
  - 今回新たに採用。標準plugin。外部サイトへのリンクを制御。target="_blank"を付与するのに使用
- rehype-attrs
  - remarkAttrの代わりに採用。markdownに記述したattributeを変換後のhtmlに付与。cssクラスをセットする等の用途で使用
- rehypeHighlight
  - 以前利用していたsyntax highlight用のplugin。標準で登録済み担っている言語でbundleサイズが膨らんでしまい、取り除くのが簡単ではなさそうだったので`rehypePrismPlus`に変更することに
- rehypePrismPlus
  - syntax highlight用のplugin。ハイライト対象の設定ファイルを柔軟に登録できるので、bundleサイズ削減が期待できる

``` ts
const processor = unified()
    .use(remarkParse)
    // .use(remarkAttr)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener'] })
    .use(rehypeAttrs, { properties: 'attr' })
    // .use(highlight)
    .use(rehypePrismPlus, { showLineNumbers: true })
    .use(rehypeStringify); // 標準plugin: hastをhtmlに変換

const html = String(processor.processSync(document.content.body));
```

## 💡 振り返り / 次回へのアクション

- prettierの[bracket line](https://prettier.io/docs/en/options.html#bracket-line)をtrueにする
- loading barのshow/hideにアニメーションを付ける

## 🔗 関連リンク

- [[🏃NET6とAngular v13でSPAサイトを作る（VSプロジェクト作成）]]
- [[🏃NET6とAngular v13でSPAサイトを作る（バックエンド）]]

## 参考資料

- [How to upgrade Angular CLI to the latest version](https://stackoverflow.com/questions/43931986/how-to-upgrade-angular-cli-to-the-latest-version)
- [angular-eslint](https://github.com/angular-eslint/angular-eslint)
- [Tasks in Visual Studio Code - Compound tasks](https://code.visualstudio.com/docs/editor/tasks#_compound-tasks)
- [Getting Started with Angular Material](https://material.angular.io/guide/getting-started)
- [Remark plugins list](https://github.com/remarkjs/remark/blob/main/doc/plugins.md)
- [Rehype plugins list](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md)
