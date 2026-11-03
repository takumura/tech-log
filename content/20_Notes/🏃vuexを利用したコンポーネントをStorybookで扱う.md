---
created: 2021-01-10
updated: 2021-01-10
type: snapshot
category: article
tags:
  - activity
  - tech/lang/typescript/vuejs/nuxt
  - tech/lang/typescript/vuejs/vuex
  - tech/web/design/storybook
publish: "true"
---
# 🏃 活動概要
> [!ABSTRACT] Overview
> NuxtJS + Electron を使って、デスクトップで動くオレオレ Todo アプリを作ってみたくなりました。component毎にstoryを作ってテストを行い、Nuxt側でそれをViewにまとめていこうと思います。
> \
> データはvuexのstoreからくるので、storybookとvuexの連携が必要になりました。

## 🧩 詳細

storybookの構成として、`preview.js`にvuexを利用するための設定が必要です。

```ts
...
import Vuex from 'vuex'
...
Vue.use(Vuex)
...
```

動作確認のため、ドラフトのtask storeを作成します。getterだけの簡単なモノにしました。

```ts
import { GetterTree } from 'vuex'
import { RootState } from '~/store'

export interface Task {
  name: string
  done: boolean
}

export interface TaskState {
  list: Task[]
}

export const state = () => ({
  list: [],
})

export const getters: GetterTree<TaskState, RootState> = {
  getTasks: (state: TaskState) => {
    return state.list
  },
}
```

同様にtask componentを作成。

```ts
<template>
  <v-list>
    <v-list-item v-for="task in getTasks" :key="task.name">
      <v-list-item-content>
        <div>
          <span>{{ task.name }}</span>
          <v-btn small depressed color="primary">start</v-btn>
        </div>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>
<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      getTasks: 'tasks/getTasks',
    }),
  },
}
</script>
<style></style>
```

このcomponentのstoryは以下のような記述で動くようになりました。テスト用のmock storeがポイントだと思います。今後mock storeが煩雑に感じてきたら、全コンポーネント共通の汎用mock storeを作ることになりそうです。

```ts
import Task from '../../components/Task'
import Vuex from 'vuex'

export default {
  title: 'Components/Task',
  component: Task,
  argTypes: {},
}

// テスト用のmock store
const store = new Vuex.Store({
  modules: {
    tasks: {
      namespaced: true,
      state: {
        list: [
          { name: 'task1', done: false },
          { name: 'task2', done: true },
          { name: 'task3', done: true },
        ],
      },
      getters: {
        getTasks: (state) => {
          return state.list
        },
      },
    },
  },
})

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { Task },
  template: '<task />',
  store,
})

export const TaskComponent = Template.bind({})
```

## 🔗 関連リンク

- [[🏃NuxtにStorybookを導入する]]
- [[🏃Nuxt + TypeScriptで正しく型推論させる]]

## 🔗 参考資料

- [実践StorybookでVuexに立ち向かう](https://medium.com/studist-dev/storybook-with-vuex-7084bea6b509)
- [【Nuxt.js】VuexをStorybookで使う方法](https://sawami.net/2019/11/01/tech/nuxt-js-vuex-and-storybook/)
