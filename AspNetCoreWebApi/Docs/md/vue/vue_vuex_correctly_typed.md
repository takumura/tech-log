---
title: "NuxtJS + Typescriptで正しく型推論させる"
date: "2021-01-24"
category: "Vue"
tag:
  - vue
  - nuxtjs
  - storybook
  - vuex
  - typed vuex
---

NuxtJSを使っていて「Typescriptなのに型推論が効いてなくてイマイチだなぁ」と思っていたのですが、設定が悪いだけでした。

## コンポーネント

実装を急ぐあまり、基本を理解していませんでした。そもそも`.vue`はjavasriptでしか書けないのかと思っていたのですが、ちゃんと[公式サイトに説明](https://typescript.nuxtjs.org/ja/cookbook/components)がありました。

``` ts
<script lang="ts">
  /** TypeScript はここに記述します **/
</script>
```

scriptのlangを設定していたり、していないものがあったのでtypescriptに統一しました。

### Options API

その後、ビルドは通りstorybookではエラーなく動いていたのですが`yarn dev`でNuxtJSのアプリを動かすと大量にエラーが出ることに気が付きました。

``` ts
TS2339: Property 'duration' does not exist on type '{ minutes(): number; seconds(): number; }'
```

設定不十分な状態でtypescriptにした結果、型がうまく見つからずにエラーが表示されるようになった模様。これについてもちゃんと[公式サイトを読んで](https://typescript.nuxtjs.org/ja/cookbook/components#options-api)いれば何ということはない話でした。

``` ts
import Vue, { PropOptions } from 'vue'

interface User {
  firstName: string
  lastName: string
}

export default Vue.extend({
  name: 'YourComponent',

  props: {
    user: {
      type: Object,
      required: true
    } as PropOptions<User>
  },

  data () {
    return {
      message: 'This is a message'
    }
  },

  computed: {
    fullName (): string {
      return `${this.user.firstName} ${this.user.lastName}`
    }
  }
})
```

対応方法はいくつかあるようですが、既存の書き方のまま`Vue.extened{()}`で囲むだけでよいOptions API方式を採用するのがお手軽で良さそうに感じました。

## Vuex with Typed Vuex

Vuex store自体はtypescriptで書けるのですが、component等から利用するときにAction、getter、mutationの型推論やインテリセンスが効きません。書き味は悪いけどそういうものかと思っていたのですが、改善策があるようなのでトライしてみます。

Typed VuexのNuxt用モジュールを[公式サイトの手順](https://typed-vuex.roe.dev/getting-started-nuxt)に従い導入しました。

``` powershell
> yarn add --dev nuxt-typed-vuex
```

``` ts
// nuxt.config.js 抜粋
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify',
    'nuxt-typed-vuex',
  ],
```

そしてstoreへのアクセスに利用する`$accessor`の型定義ファイルを追加します。

``` ts
// ~/types/index.d.ts
import { accessorType } from '~/store'

declare module 'vue/types/vue' {
  interface Vue {
    $accessor: typeof accessorType
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $accessor: typeof accessorType
  }
}
```

その後は[実装サンプル](https://github.com/danielroe/typed-vuex/blob/main/examples/nuxt/store/index.ts)や[参考記事](https://qiita.com/shindex/items/a90217b9e4c03c5b5215#vuex-%E3%81%AE-typescript-%E5%8C%96)などを見ながらstoreスクリプトをTyped Vuex仕様にしていきます。

store側が完了してしまえば、呼び出しているcomponent側の更新は非常に簡単です。getter/mutation/actionへのアクセスはthis.$accessorがイイ感じに行ってくれます。例えば`dispatch('アクション名')`としていた部分は`this.$accessor.{submodules}.アクション名()`とリテラルではなく直接呼出しになり、インテリセンスも効いています。素晴らしい！

### Storybook with Typed Vuex

これでめでたしめでたし！と思いきや、StorybookでTyped Vuexの`$accessor`にアクセスしている部分の処理がエラーを出すようになってしまいました。StorybookはNuxtJSとは異なるプロジェクトとして起動するので、`nuxt-typed-vuex`によるaccessor自動インポートが効いていないからだと推測しました。

> Nuxt Typed Vuex is made up of two packages:
>
> 1. typed-vuex - a typed store accessor with helper functions, with no Nuxt dependencies
> 1. nuxt-typed-vuex - a Nuxt module that auto-injects this accessor throughout your project

[Vue版のTyped Vuex setup](https://typed-vuex.roe.dev/getting-started-vue#setup)と[StackOverflowのこの回答](https://stackoverflow.com/a/62610041)を参考に`preview.js`を更新したところ、Storybookでも`$accessor`を利用できるようになりました。

``` diff
// .storybook/preview.js
import { addDecorator } from '@storybook/vue'
import Vue from 'vue'
import Vuex from 'vuex'
+import { useAccessor } from 'typed-vuex'

import Vuetify from 'vuetify'
import { VApp, VContent } from 'vuetify/lib'
import colors from 'vuetify/es5/util/colors'
import 'vuetify/dist/vuetify.min.css'
+import * as rootStore from '~/store/index'
+import * as todos from '~/store/todos'
+import * as tasks from '~/store/tasks'

+// setup Vuex with Typed Vuex
Vue.use(Vuex)
+export const storePattern = {
+  state: rootStore.state,
+  getters: rootStore.getters,
+  actions: rootStore.actions,
+  mutations: rootStore.mutations,
+  modules: {
+    todos: {
+      namespaced: true,
+      state: {
+        list: [
+          { name: 'task1', done: false, running: false },
+          { name: 'task2', done: false, running: false },
+          { name: 'task3', done: false, running: true },
+          { name: 'task4', done: false, running: false },
+          { name: 'task5', done: false, running: false },
+        ],
+      },
+      getters: todos.getters,
+      actions: todos.actions,
+      mutations: todos.mutations,
+    },
+    tasks,
+  },
+}
+const store = new Vuex.Store(storePattern)
+export const accessor = useAccessor(store, storePattern)
+Vue.prototype.$accessor = accessor
+
+export default store
+
+// Setup vuetify
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
  template: `<v-app><v-main><story/></v-main></v-app>`,
}))

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
}
```

story側ではstoreのモックを作成する代わりに、`preview.js`でexportしたstoreをそのまま利用できることに気が付きました。とっても便利！！

``` diff
-import Vuex from 'vuex'
+import store from '@/.storybook/preview'
import TodoList from '~/components/TodoList'

-const store = new Vuex.Store({
-  modules: {
-    todos: {
-      namespaced: true,
-      state: {
-        list: [
-          { name: 'task1', done: false },
-          { name: 'task2', done: true },
-          { name: 'task3', done: true },
-          { name: 'task4', done: true },
-        ],
-      },
-      getters: {
-        getTodoList: (state) => {
-          return state.list
-        },
-      },
-    },
-  },
-})

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { TodoList },
  template: '<todo-list />',
  store,
})

export const todoList = Template.bind({})
```

## 所感

色々な試行錯誤を通してVue/Nuxtに関する理解が深まってきたように感じます。

## 関連項目

- [Qiita - NuxtJS + Vuexでいい感じのTypescript環境をあまり頑張らないで構築する](https://qiita.com/shindex/items/a90217b9e4c03c5b5215)
- [Nuxt Typescript](https://typescript.nuxtjs.org/ja/)
- [Typed Vuex](https://typed-vuex.roe.dev/)
- [stack overflow - How can I make Vuex store work with Storybook?](https://stackoverflow.com/questions/56682493/how-can-i-make-vuex-store-work-with-storybook)
