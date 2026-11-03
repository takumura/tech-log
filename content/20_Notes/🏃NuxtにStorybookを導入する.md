---
created: 2021-01-04
updated: 2021-01-04
type: snapshot
category: article
tags:
  - activity
  - tech/lang/typescript/vuejs/nuxt
  - tech/web/design/storybook
  - tech/design_systems/vuetify
publish: "true"
---
# 🏃 活動概要
> [!ABSTRACT] Overview
> Nuxt + Electron を使って、デスクトップで動くオレオレ Todo アプリを作ってみたくなりました。まずは NuxtJS(Vue.js)に慣れるためのサンプル Todo アプリを作ります。Storybook を導入して、コンポーネントカタログも併せて作ってみます。

## 🧩 環境確認

- エディタ: VSCode
- nodejs: v12.16.0
- yarn: 1.22.4

## 🧩 詳細

### yarn のアップグレード

```sh frame="none"
> yarn -v
1.22.0

> yarn policies set-version
Resolving latest to a url...
Downloading https://github.com/yarnpkg/yarn/releases/download/v1.22.4/yarn-1.22.4.js...
Saving it into C:\Users\takum\.yarn\releases\yarn-1.22.4.js...
Updating C:\Users\takum/.yarnrc...
Done!

> yarn -v
1.22.4
```

### NuxtJS プロジェクトの新規作成

`yarn create nuxt-app nuxt-components-storybook`により`create-nuxt-app`モジュールが global に install され、プロジェクト生成が行われました。

デフォルトの設定でlinting toolなどお好みで選択できます。何度かプロジェクトを作って試してみた結果、以下の設定に落ち着きました。

```sh frame="none"
> yarn create nuxt-app nuxt-components-storybook

> yarn create nuxt-app nuxt-components-storybook
yarn create v1.22.4
[1/4] Resolving packages...
[2/4] Fetching packages...
[3/4] Linking dependencies...
[4/4] Building fresh packages...

success Installed "create-nuxt-app@3.2.0" with binaries:
      - create-nuxt-app

create-nuxt-app v3.2.0
✨  Generating Nuxt.js project in nuxt-components-storybook
? Project name: nuxt-components-storybook
? Programming language: TypeScript
? Package manager: Yarn
? UI framework: Vuetify.js
? Nuxt.js modules: (Press <space> to select, <a> to toggle all, <i> to invert selection)
? Linting tools: Prettier
? Testing framework: Jest
? Rendering mode: Single Page App
? Deployment target: Static (Static/JAMStack hosting)
? Development tools:

yarn install v1.22.4
info No lockfile found.

🎉  Successfully created project nuxt-components-storybook

  To get started:

        cd nuxt-components-storybook
        yarn dev

  To build & start for production:

        cd nuxt-components-storybook
        yarn build
        yarn start

  To test:

        cd nuxt-components-storybook
        yarn test


  For TypeScript users.

  See : https://typescript.nuxtjs.org/cookbook/components/
Done in 502.43s.
```

### 🧩 最初の動作確認

install 完了時メッセージに従い`yarn dev`を実行すると、localhost:3000 でサイトが起動しました。

```sh frame="none"
> yarn dev
yarn run v1.22.4
$ nuxt-ts

   ╭───────────────────────────────────────╮
   │                                       │
   │   Nuxt.js @ v2.14.1                   │
   │                                       │
   │   ▸ Environment: development          │
   │   ▸ Rendering:   client-side          │
   │   ▸ Target:      static               │
   │                                       │
   │   Listening: http://localhost:3000/   │
   │                                       │
   ╰───────────────────────────────────────╯

i Preparing project for development                 12:44:00
i Initial build may take a while                    12:44:00
√ Builder initialized                               12:44:00
√ Nuxt files generated                              12:44:01

√ Client
  Compiled successfully in 20.95s

i Waiting for file changes                          12:44:32
i Memory usage: 258 MB (RSS: 355 MB)                12:44:32
i Listening on: http://localhost:3000/              12:44:32
No issues found.                                    12:44:32
```

### Storybook の導入

storybook cliを利用することで、各フレームワーク/ツール向けの初期設定ができるようです。`@storybook/cli`をdevDependencies に追加、初期化コマンドを実行します。

```sh frame="none"
yarn add --dev @storybook/cli
yarn sb init --type vue
```

プロジェクト直下に`.storybook`フォルダと`stories`フォルダが作成され、`.storybook/main.js`といくつかのサンプルストーリーも作成されました。project.json には storybook 起動用 script が追加されており、実行するとデフォルトブラウザが起動し、localhost:6006 で storybook のサイトが表示されました。

```sh frame="none"
yarn storybook
```

### vuetify用の設定を追加する

[Nuxt + Vuetify の構成で Storybook を導入する](https://almond.milk200.cc/blog/2020/06/01/storybook.html)の設定を参考にして、`preview.js`と`webpack.config.js`を調整しました。

```ts
// .storybook/webpack.config.js
const path = require('path')
const rootPath = path.resolve(__dirname, '../')

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.s(c|a)ss$/,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'sass-loader',
      },
    ],
  })

  config.resolve.alias['~'] = rootPath
  config.resolve.alias['@'] = rootPath

  return config
}
```

```ts
// .storybook/preview.js
import { addDecorator } from '@storybook/vue'
import Vue from 'vue'
import Vuex from 'vuex'

import Vuetify from 'vuetify'
import { VApp, VContent } from 'vuetify/lib'
import colors from 'vuetify/es5/util/colors'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuex)
const vuetifyOptions = {}

Vue.use(Vuetify, {
  iconfont: 'mdi',
  customVariables: ['~/assets/variables.scss'],
  theme: {
    dark: true,
    themes: {
      light: {
        primary: colors.purple,
        secondary: colors.grey.darken1,
        accent: colors.shades.black,
        error: colors.red.accent3,
      },
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
})

addDecorator(() => ({
  vuetify: new Vuetify(vuetifyOptions),
  components: { VApp, VContent },
  template: `<v-app><v-content><story/></v-content></v-app>`,
}))

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
}
```

`Logo.vue`と`WeatherCard.vue`（テスト用に[Nuxt + Vuetify の構成で Storybook を導入する](https://almond.milk200.cc/blog/2020/06/01/storybook.html)のcomponentを借用）向けにストーリーを作成しました。

```ts
// Logo.stories.js
import { storiesOf } from '@storybook/vue'
import Logo from '@/components/Logo.vue'

storiesOf('Components/Default', module).add(
  'Logo',
  () => ({
    components: { Logo },
    template: `
    <logo />
`,
  }),
  {
    info: true,
    notes: `
        # Logo
        Nuxt.js default logo
      `,
  },
)
```

```ts
// WeatherCard.stories.js
import WeatherCard from '../components/WeatherCard.vue'

export default {
  title: 'Components/Vuetify',
  component: WeatherCard,
}

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { WeatherCard },
  template: '<weather-card :day-of-the-week-labels="dayOfTheWeekLabels"/>',
})

export const WeatherCardComponent = Template.bind({})
WeatherCardComponent.args = {
  dayOfTheWeekLabels: ['SU', 'MO', 'TU', 'WED', 'TH', 'FR', 'SA'],
}
```

`WeatherCard.vue`で利用している[Material Design Icon](https://material.io/resources/icons/?style=baseline)が正しく表示されなかったので、`.storybook/preview-head.html`を追加。

```html
<!-- .storybook/preview-head.html -->
<link
  href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&display=swap"
  rel="stylesheet"
/>
<link
  href="https://cdn.jsdelivr.net/npm/@mdi/font@3.x/css/materialdesignicons.min.css"
  rel="stylesheet"
/>
```

## 💡 振り返り / 次回へのアクション

### lint/formatについて

これまで Prettier をフォーマッター/リンターとして使ってきたのですが、vue のおすすめフォーマット設定がよくわかりませんでした。eslint + prettierのようなのですが、VSCode で一番人気がある vue 用拡張機能[Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)の標準フォーマッターはPrettier になっていて、eslintの推奨と競合するようになってしまいました。

各configを調整して、eslintとprettierを共存させる設定について解説しているサイトを調べたりもしましたが、私自身はeslintへのこだわりが無いのでprettierにすべてお任せするようにしました。しばらくこのまま開発を進め、問題点が出てきたらそのとき考えようと思います。

### vscodeのformatter設定について

angularとvueのプロジェクトをVSCodeで開発するようになると、VSCodeのグローバル設定で全てをまかなうのは難しいように感じました。グローバルの設定は最低限の共通事項に留め、各種プロジェクトに必要な設定を個別に適用した方が良さそうです。

なのでVSCodeの設定を、共通 / angular用 / vue用で分割する予定です。

## 🔗 関連リンク

- [[🏃vuexを利用したコンポーネントをStorybookで扱う]]
- [[🏃Nuxt + TypeScriptで正しく型推論させる]]

## 🔗 参考資料

- [Vue.js official](https://vuejs.org/)
- [awesome-vue - Github](https://github.com/vuejs/awesome-vue)
- [Vue CLI official](https://cli.vuejs.org/)
- [How to use Vue.js with Electron and Vuex](https://www.digitalocean.com/community/tutorials/vuejs-vue-electron)
- [Nuxt.js official](https://nuxtjs.org/)
- [ESLint と Prettier - NuxtJS](https://ja.nuxtjs.org/guide/development-tools/#eslint-%E3%81%A8-prettier)
- [An (almost) comprehensive guide on using Storybook with Nuxt.js](https://medium.com/js-dojo/a-guide-on-using-storybook-with-nuxt-js-1e0018ec51c9)
- [Storybook for Vue](https://storybook.js.org/docs/guides/guide-vue/)
- [Nuxt + Vuetify の構成で Storybook を導入する](https://almond.milk200.cc/blog/2020/06/01/storybook.html)
- [Story rendering - Storybook](https://storybook.js.org/docs/react/configure/story-rendering#adding-to-head)
