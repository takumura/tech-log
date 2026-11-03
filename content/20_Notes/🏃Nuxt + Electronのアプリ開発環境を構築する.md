---
created: 2021-05-07
updated: 2021-05-07
type: snapshot
category: article
tags:
  - activity
  - tech/lang/typescript/vuejs/nuxt
  - tech/lang/javascript/electron
publish: "true"
---
# 🏃 活動概要
> [!ABSTRACT] Overview
> NuxtJS + Electron を使って、デスクトップで動くオレオレ Todo アプリを作ってみたくなりました。Vuejsに少し慣れてきたので、次にElectronとVuejsの組み合わせについて学んでいきます。

## 🧩 環境確認

- エディタ: VSCode
- nodejs: v12.16.0
- yarn: 1.22.4

## 🧩 詳細

ボイラープレート的なプロジェクトで、[electron-nuxt](https://github.com/michalzaq12/electron-nuxt)と[nuxtron](https://github.com/saltyshiomix/nuxtron)というのを見つけましたが、今回は勉強も兼ねて一から構築してみることにしました。

### NuxtJS プロジェクトの新規作成

前回同様、`yarn create nuxt-app`コマンドにてプロジェクトを生成します。ただし今回はLinting tools全部盛りで試してみます。

```sh frame="none"
> yarn create nuxt-app nuxt-electron-example
yarn create v1.22.4
[2/4] Fetching packages...
[3/4] Linking dependencies...
[4/4] Building fresh packages...

warning Your current version of Yarn is out of date. The latest version is "1.22.5", while you're on "1.22.4".
success Installed "create-nuxt-app@3.4.0" with binaries:
      - create-nuxt-app

create-nuxt-app v3.4.0
✨  Generating Nuxt.js project in nuxt-electron-example
? Project name: nuxt-electron-example
? Programming language: TypeScript
? Package manager: Yarn
? UI framework: Vuetify.js
? Nuxt.js modules: (Press <space> to select, <a> to toggle all, <i> to invert selection)
? Linting tools: ESLint, Prettier, Lint staged files, StyleLint, Commitlint
? Testing framework: Jest
? Rendering mode: Single Page App
? Deployment target: Static (Static/JAMStack hosting)
? Development tools: (Press <space> to select, <a> to toggle all, <i> to invert selection)
? Continuous integration: None
? Version control system: Git

yarn install v1.22.4
info No lockfile found.

yarn run v1.22.4
$ eslint --ext .js,.vue --ignore-path .gitignore . --fix
Done in 28.71s.

yarn run v1.22.4
$ stylelint **/*.{vue,css} --ignore-path .gitignore --fix
Done in 8.22s.

�🎉  Successfully created project nuxt-electron-example

  To get started:

        cd nuxt-electron-example
        yarn dev

  To build & start for production:

        cd nuxt-electron-example
        yarn build
        yarn start

  To test:

        cd nuxt-electron-example
        yarn test


  For TypeScript users.

  See : https://typescript.nuxtjs.org/cookbook/components/
Done in 8116.40s.
```

ビルド完了後に`yarn dev`で動作確認をしたところ問題なく実行できました。

### NuxtJSのソースをsrc\renderer以下に移動

[この記事](https://qiita.com/282Haniwa/items/a3b0a7d3c622ad82ac8d#%E3%83%87%E3%82%A3%E3%83%AC%E3%82%AF%E3%83%88%E3%83%AA%E6%A7%8B%E6%88%90%E3%82%92%E5%A4%89%E6%9B%B4%E3%81%99%E3%82%8B)を参考に、フォルダ構成を変更しました。

NuxtJSに必要なconfigファイルは`.babelrc`、`nuxt.config.js`、`tsconfig.json`の3つで、それ以外はトップフォルダのまま移動不要でした。ただしファイル場所が変わったためpackage.jsonのscripts記述は更新が必要でした。

``` json
// package.json 抜粋
{
  "name": "nuxt-electron-example",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev:renderer": "nuxt-ts src/renderer",
    "build:renderer": "nuxt-ts build src/renderer",
    "generate:renderer": "nuxt-ts generate src/renderer"
  },
  ...
}
```

### Electronの導入

必要なモジュールをyarnコマンドで追加しました。

```sh frame="none"
> yarn add --dev electron electron-builder electron-devtools-installer
> yarn add --dev cross-env
```

- [electron](https://github.com/electron/electron#readme) = Electron本体
- [electron-builder](https://github.com/electron-userland/electron-builder#readme) = Electronのpackage & buildツール
- [electron-devtools-installer](https://github.com/MarshallOfSound/electron-devtools-installer) = Electron用のDevTool拡張機能インストーラー
- [cross-env](https://github.com/kentcdodds/cross-env#readme) = node script実行時の環境変数を設定するツール

次にElectronのメイン処理を行う`index.ts`を`src/main`以下に作成しました。

後でわかったことなのですが、`process.env.NODE_ENV_ === 'development'`の場合、electron実行時に`nuxt.ready()`で非同期処理の完了を待たないと、vuexのstoreが使用できない（webpack処理が完了していないのかstoreのjsが一切見当たらない状態でした）問題がありました。また`process_env.NODE_ENV_ === 'production'`の場合、`nuxt.ready()`で非同期処理の完了を待ってしまうといつまでもwindowが表示されませんでした。

試行錯誤した結果、以下のような実装になりました

``` ts
// index.ts
import nuxtConfig from '../renderer/nuxt.config'
const http = require('http')
const path = require('path')
const { Nuxt, Builder } = require('nuxt')
const electron = require('electron')

// @ts-ignore
nuxtConfig.rootDir = path.resolve('src/renderer')
// @ts-ignore
const isDev = nuxtConfig.dev
let _NUXT_URL_ = ''

const nuxt = new Nuxt(nuxtConfig)
if (isDev) {
  nuxt.ready().then((n: { render: any }) => {
    const builder = new Builder(n)
    const server = http.createServer(n.render)

    builder.build().catch((err: any) => {
      console.error(err)
      process.exit(1)
    })
    server.listen()
    _NUXT_URL_ = `http://localhost:${server.address().port}`
    console.log(`Nuxt working on ${_NUXT_URL_}`)

    createElectronApp()
  })
} else {
  _NUXT_URL_ = 'file://' + path.resolve(__dirname, '../../dist/nuxt-build/index.html')
  createElectronApp()
}

function createElectronApp() {
  let win: any = null
  const app = electron.app
  const newWin = () => {
    win = new electron.BrowserWindow({
      width: 1400,
      height: 1000,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: false,
        preload: path.resolve(path.join(__dirname, 'preload.js')),
        webSecurity: false,
      },
    })

    win.on('closed', () => (win = null))

    if (isDev) {
      const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer')

      installExtension(VUEJS_DEVTOOLS.id)
        .then((name: any) => {
          console.log(`Added Extension:  ${name}`)
          win.webContents.openDevTools()
        })
        .catch((err: any) => console.log('An error occurred: ', err))

      const pollServer = () => {
        http
          .get(_NUXT_URL_, (res: any) => {
            if (res.statusCode === 200) {
              win.loadURL(_NUXT_URL_)
            } else {
              console.log('restart poolServer')
              setTimeout(pollServer, 300)
            }
          })
          .on('error', pollServer)
      }

      pollServer()
    } else {
      return win.loadURL(_NUXT_URL_)
    }
  }

  app.on('ready', newWin)
  app.on('window-all-closed', () => app.quit())
  app.on('activate', () => win === null && newWin())
}
```

記述中いくつかのエラーが発生したため、`.eslintrc.js`を修正しました。

1. windows環境特有の改行に関するエラー: [このissue](https://github.com/prettier/eslint-plugin-prettier/issues/211)を参照
1. `console`の利用不可エラー: [no-console](https://eslint.org/docs/rules/no-console)エラーを無視するように変更
1. 一行の長さを120文字に変更。

``` diff
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
  ],
  plugins: ['prettier'],
  // add your custom rules here
-  rules: {},
+  rules: {
+    'no-console': 'off',
+    'prettier/prettier': ['error', { endOfLine: 'auto', printWidth: 120 }],
+  },
}
```

electronのwindow起動時に`preload.ts`を指定しているので、`index.ts`と同じフォルダに空のファイル配置しました。

``` ts
  win = new electron.BrowserWindow({
    width: 1400,
    height: 1000,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: path.resolve(path.join(__dirname, 'preload.js')),
      webSecurity: false,
    },
  })
```

`nuxt.config.js`も併せて修正が必要でした。

``` diff
import colors from 'vuetify/es5/util/colors'

+ const isProduction = processenv.NODE_ENV_ === 'production'
+ const isDev = process.env.NODE_ENV_ === 'development'
+
export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - nuxt-electron-example',
    title: 'nuxt-electron-example',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [],

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

+  dev: isDev,
+  router: {
+
+    mode: 'hash',
+  },
  // Build Configuration (https://go.nuxtjs.dev/config-build)
-   build: {}
+   build: {
+     extend(config) {
+       if (!isDev) {
+         // absolute path to files on production (default value: '/_nuxt/')
+         config.output.publicPath = '_nuxt/'
+       }
+       config.node = {
+         __dirname: !isProduction,
+         __filename: !isProduction,
+       }
+     },
+   },
+   buildDir: '../../dist/nuxt-build',
+   generate: {
+     dir: '../../dist/nuxt-build',
+   },
+   telemetry: false,
}
```

最後に`package.json`のscriptを整理しました。スクリプトの同時実行に利用する`npm-run-all`を併せて導入しました。

```sh frame="none"
> yarn add --dev npm-run-all
```

``` diff
{
  "name": "nuxt-electron-example",
  "version": "1.0.0",
  "private": true,
+  "main": "dist/main/index.js",
  "scripts": {
-    "dev:renderer": "nuxt-ts src/renderer",
-    "build:renderer": "nuxt-ts build src/renderer",
-    "generate:renderer": "nuxt-ts generate src/renderer"
+    "dev:main": "cross-env NODE_ENV=development tsc -p src/main/tsconfig.json",
+    "dev:renderer": "cross-env NODE_ENV=development nuxt-ts src/renderer",
+    "dev:electron": "cross-env NODE_ENV=development electron .",
+    "build:main": "cross-env NODE_ENV=production tsc -p src/main/tsconfig.json",
+    "build:renderer": "cross-env NODE_ENV=production nuxt-ts generate src/renderer",
+    "build:electron": "cross-env NODE_ENV=production electron-builder",
+    "build:electron:win": "cross-env NODE_ENV=production electron-builder --win",
+    "build:electron:mac": "cross-env NODE_ENV=production electron-builder --mac",
+    "build:electron:linux": "cross-env NODE_ENV=production electron-builder --linux",
+    "build:win": "npm-run-all build:main build:renderer build:electron:win",
+    "build:mac": "npm-run-all build:main build:renderer build:electron:mac",
+    "build:linux": "npm-run-all build:main build:renderer build:electron:linux"
  },
  ...
}
```

## 🧩 動作確認

この状態で`yarn dev:main`を実行したところ、tsconfig.jsonが見つからないエラーが発生しました。

```sh frame="none"
> yarn dev:main
yarn run v1.22.4
$ cross-env NODE_ENV=development tsc -p src/main/tsconfig.json

error TS5058: The specified path does not exist: 'src/main/tsconfig.json'.
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
ERROR: "dev:main" exited with 1.
```

tsconfig.jsonを`src/main`以下に配置して再実行します。

``` js
// tsconfig.json
{
  "compilerOptions": {
    /* Visit https://aka.ms/tsconfig.json to read more about this file */

    /* Basic Options */
    // "incremental": true,                   /* Enable incremental compilation */
    "target": "es5",                          /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */
    "module": "commonjs",                     /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */
    // "lib": [],                             /* Specify library files to be included in the compilation. */
    "allowJs": true,                       /* Allow javascript files to be compiled. */
    // "checkJs": true,                       /* Report errors in .js files. */
    // "jsx": "preserve",                     /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */
    // "declaration": true,                   /* Generates corresponding '.d.ts' file. */
    // "declarationMap": true,                /* Generates a sourcemap for each corresponding '.d.ts' file. */
    "sourceMap": true,                     /* Generates corresponding '.map' file. */
    // "outFile": "./",                       /* Concatenate and emit output to single file. */
    "outDir": "../../dist",                        /* Redirect output structure to the directory. */
    // "rootDir": "./",                       /* Specify the root directory of input files. Use to control the output directory structure with --outDir. */
    // "composite": true,                     /* Enable project compilation */
    // "tsBuildInfoFile": "./",               /* Specify file to store incremental compilation information */
    // "removeComments": true,                /* Do not emit comments to output. */
    // "noEmit": true,                        /* Do not emit outputs. */
    // "importHelpers": true,                 /* Import emit helpers from 'tslib'. */
    // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
    // "isolatedModules": true,               /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */

    /* Strict Type-Checking Options */
    "strict": true,                           /* Enable all strict type-checking options. */
    // "noImplicitAny": true,                 /* Raise error on expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,              /* Enable strict null checks. */
    // "strictFunctionTypes": true,           /* Enable strict checking of function types. */
    // "strictBindCallApply": true,           /* Enable strict 'bind', 'call', and 'apply' methods on functions. */
    // "strictPropertyInitialization": true,  /* Enable strict checking of property initialization in classes. */
    // "noImplicitThis": true,                /* Raise error on 'this' expressions with an implied 'any' type. */
    // "alwaysStrict": true,                  /* Parse in strict mode and emit "use strict" for each source file. */

    /* Additional Checks */
    // "noUnusedLocals": true,                /* Report errors on unused locals. */
    // "noUnusedParameters": true,            /* Report errors on unused parameters. */
    // "noImplicitReturns": true,             /* Report error when not all code paths in function return a value. */
    // "noFallthroughCasesInSwitch": true,    /* Report errors for fallthrough cases in switch statement. */

    /* Module Resolution Options */
    // "moduleResolution": "node",            /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    "baseUrl": ".",
    "paths": {
      "~/*": [
        "./*"
      ],
      "@/*": [
        "./*"
      ]
    },
    // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. */
    // "typeRoots": [],                       /* List of folders to include type definitions from. */
    // "types": [],                           /* Type declaration files to be included in compilation. */
    // "allowSyntheticDefaultImports": true,  /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true,                  /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */
    // "allowUmdGlobalAccess": true,          /* Allow accessing UMD globals from modules. */

    /* Source Map Options */
    // "sourceRoot": "",                      /* Specify the location where debugger should locate TypeScript files instead of source locations. */
    // "mapRoot": "",                         /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
    // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

    /* Experimental Options */
    // "experimentalDecorators": true,        /* Enables experimental support for ES7 decorators. */
    // "emitDecoratorMetadata": true,         /* Enables experimental support for emitting type metadata for decorators. */

    /* Advanced Options */
    "skipLibCheck": true,                     /* Skip type checking of declaration files. */
    "forceConsistentCasingInFileNames": true  /* Disallow inconsistently-cased references to the same file. */
  },
  "includes": [
    "./*.(js|ts)"
  ]
}
```

これで、`yarn dev:main`が正常終了し、`yarn dev:electron`で、electron appをデバッグ実行できるようになりました。

最後に`electron-builder.yml`をproject直下に配置し`build:win`を実行します。

``` yml
<!-- electron-builder.yml -->
appId: com.nuxt-electron-example.app
productName: nuxt-electron-example
asar: true

directories:
  output: build/

files:
  - package.json
  - dist/main/
  - dist/renderer/
  - dist/nuxt-build/

dmg:
  contents:
    - type: link
      path: /Applications
      x: 410
      y: 150
    - type: file
      x: 130
      y: 150

mac:
  target: dmg
  category: public.app-category.developer-tools

win:
  target: portable

linux:
  target:
    - deb
    - AppImage
```

```sh frame="none"
> yarn build:win
yarn run v1.22.4
$ npm-run-all build:main build:renderer build:electron:win
$ cross-env NODE_ENV=production tsc -p src/main/tsconfig.json
$ cross-env NODE_ENV=production nuxt-ts generate src/renderer
i Doing webpack rebuild because pages\index.vue modified
i Production build
i Bundling only for client side
i Target: static
√ Builder initialized
√ Nuxt files generated
√ Client
  Compiled successfully in 44.10s

Hash: 93e7999117d5727b31d3
Version: webpack 4.44.2
Time: 44106ms
Built at: 2021-01-11 23:30:39
                         Asset       Size  Chunks                                Chunk Names
../server/client.manifest.json   14.7 KiB          [emitted]
                    1643269.js   24.7 KiB       6  [emitted] [immutable]         vendors/pages/index
                    380d0fb.js   3.83 KiB       0  [emitted] [immutable]         app
                    45a7178.js    521 KiB       5  [emitted] [immutable]  [big]  vendors/app
                    95ff23c.js   2.32 KiB       4  [emitted] [immutable]         runtime
                      LICENSES  389 bytes          [emitted]
                    bbcb20a.js    199 KiB       1  [emitted] [immutable]         commons/app
                    eaca075.js    5.4 KiB       2  [emitted] [immutable]         pages/index
                    fb55579.js   8.67 KiB       3  [emitted] [immutable]         pages/inspire
 + 1 hidden asset
Entrypoint app = 95ff23c.js bbcb20a.js 45a7178.js 380d0fb.js

WARNING in asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).
This can impact web performance.
Assets:
  45a7178.js (521 KiB)
i Generating output directory: nuxt-build/
i Generating pages
√ Generated route "/"
√ Client-side fallback created: 200.html
$ cross-env NODE_ENV=production electron-builder --win
  • electron-builder  version=22.9.1 os=10.0.19041
  • loaded configuration  file=C:\Repos\github\nuxt-electron-example\electron-builder.yml
  • description is missed in the package.json  appPackageFile=C:\Repos\github\nuxt-electron-example\package.json
  • author is missed in the package.json  appPackageFile=C:\Repos\github\nuxt-electron-example\package.json
  • writing effective config  file=build\builder-effective-config.yaml
  • packaging       platform=win32 arch=x64 electron=11.1.1 appOutDir=build\win-unpacked
  • default Electron icon is used  reason=application icon is not set
  • building        target=portable file=build\nuxt-electron-example 1.0.0.exe archs=x64
Done in 337.16s.
```

約5分でbuildが完了しました。distフォルダに`build:main`、`build:renderer`で生成されたビルドモジュールが配置され、それらを使って`build:electron`が各環境用の実行ファイルを生成する、という流れのようです。

今回はwindowsのビルド設定を`target: portable`にしているので、単独実行可能な`nuxt-electron-example 1.0.0.exe`(約60MB)が生成されました。

```sh frame="none"
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        2021/01/11     23:32                win-unpacked
-a----        2021/01/11     23:30            534 builder-effective-config.yaml
-a----        2021/01/11     23:34       61868355 nuxt-electron-example 1.0.0.exe
```

これで完璧！と思ったのですが、実行時に`nuxt.config.js`の`import colors from 'vuetify/es5/util/colors'`を解決できないエラーが発生してしまいました。詳細を調査できていないのですが、`yarn add vuetify`でdependeciesにvuetifyを追加することで解決するところまで確認できました。

## 💡 振り返り / 次回へのアクション

- renderer/static フォルダに配置している画像等のリソースがelectronで利用できなくなっていました。electron用の設定が必要そうなので引き続き調査が必要です。

## 🔗 関連リンク

- [[🏃Nuxt + TypeScriptで正しく型推論させる]]
- [[🏃Nuxt + Electronアプリでセキュアなプロセス間通信を構成する]]

## 🔗 参考資料

- [Electron + Nuxt.js + TypeScriptの環境構築 - Qiita](https://qiita.com/282Haniwa/items/a3b0a7d3c622ad82ac8d)
- [Electronでデスクトップアプリを作ろうとしたメモ](https://tenderfeel.xsrv.jp/javascript/4471/)
- [Nuxt.js+Electronを試してみるv2 - Qiita](https://qiita.com/tamfoi/items/aa5b795d4559fa06f0e3)
- [electron-nuxtを使ってデスクトップアプリケーションを作ってみる - Qiita](https://qiita.com/yakiniku0220/items/c78ee5c61bd245e80d7a)
