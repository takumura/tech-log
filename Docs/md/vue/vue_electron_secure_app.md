---
title: "NuxtJS + Electronアプリで、セキュアなプロセス間通信を構成する"
date: "2021-05-10"
category: "Vue"
tag:
  - vue
  - nuxtjs
  - electron
  - electron-store
---

electronアプリでは脆弱性対応のため、ローカルファイルシステムやOSの処理をNuxtJS側（レンダラープロセス）では行わず、メインプロセス側で実行することが推奨されています。

メインプロセスとレンダラープロセス間の通信方法はelectronのバージョンアップと共に頻繁に変更されているようなので、現時点(electron v11)での安全な方法について調べ、実装していきます。

## 環境確認

- エディタ: VSCode
- nodejs: v12.16.0
- yarn: 1.22.4
- electron: 11.1.1

## 情報収集

色々なやり方があるようで、書きつつ試しつつかなり試行錯誤しました。

まず初めにこの記事を読みました。

- [Electron（v.12.0.0 現在）の IPC 通信入門 - よりセキュアな方法への変遷](https://qiita.com/hibara/items/c59fb6924610fc22a9db)
- [Electronのセキュリティについて大きく誤認していたこと](https://qiita.com/sprout2000/items/2b65f7d02e825549804b)

どうやら「renderer側でnodejsのコードを走らせない」「main側ではpreload.tsの中でrenderer側から呼び出せる処理をexposeする」のが大事なようです。

当初は[vuex-electron-persisted-state](https://github.com/chenjietao/vuex-electron-persisted-state)を使えばいいのかなと思ったのですが、mainとrendererの処理が分離できない感じだったので、このモジュールの中で使用している[electron-store](https://github.com/sindresorhus/electron-store)を使って自分で実装することにしました。

## electron-storeを使った実装トライアル

まずはインストールします。

``` powershell
> yarn add electron-store
```

そしてmain.tsから更新していきます。

``` diff
// main.ts
import nuxtConfig from '../renderer/nuxt.config'
const http = require('http')
const path = require('path')
const { Nuxt, Builder } = require('nuxt')
- const electron = require('electron')
+ const { app, BrowserWindow, ipcMain } = require('electron')

// @ts-ignore
nuxtConfig.rootDir = path.resolve('src/renderer')
// @ts-ignore
const isDev = nuxtConfig.dev
let _NUXT_URL_ = ''

const nuxt = new Nuxt(nuxtConfig)
+ const storeFilePathString = path.join(app.getPath('documents'), './electron-app')
+
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
-
-     createElectronApp()
  })
} else {
  _NUXT_URL_ = 'file://' + path.resolve(__dirname, '../../dist/nuxt-build/index.html')
-   createElectronApp()
}

+ createElectronApp()
+
function createElectronApp() {
+  // Keep a global reference of the window object, if you don't, the window will
+  // be closed automatically when the JavaScript object is garbage collected.
  let win: any = null
-  const app = electron.app
+
  const newWin = () => {
-     win = new electron.BrowserWindow({
+     win = new BrowserWindow({
      width: 1400,
      height: 1000,
      webPreferences: {
-        nodeIntegration: false,
-        contextIsolation: false,
+        contextIsolation: true,
        preload: path.resolve(path.join(__dirname, 'preload.js')),
-        webSecurity: false,
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

+  // setup electron-store for persisted state
+  const Store = require('electron-store')
+  const store = new Store({ cwd: storeFilePathString })
+  ipcMain.handle('GET_STORE_VALUE', (_: any, key: any) => {
+    const result = store.get(key)
+    return result
+  })
+  ipcMain.on('SYNC_STORE', (_: any, args: any) => {
+    store.set('data', args)
+  })
+
+  // This method will be called when Electron has finished
+  // initialization and is ready to create browser windows.
+  // Some APIs can only be used after this event occurs.
  app.on('ready', newWin)
-  app.on('window-all-closed', () => app.quit())
+
+  app.on('window-all-closed', () => {
+    // On macOS it is common for applications and their menu bar
+    // to stay active until the user quits explicitly with Cmd + Q
+    if (process.platform !== 'darwin') {
+      app.quit()
+    }
+  })
+
  app.on('activate', () => win === null && newWin())
}
```

ポイントはこの部分。

- ipcMain.handle('GET_STORE_VALUE', ...)は、renderer側から初期stateを取得する際に呼ばれ、store全体を返します。keyには`data`が入ります。
- ipcMain.on('SYNC_STORE', ...)は、rendererのstoreを`store.set()`でファイルに書き出しています。argsには最新の状態のstore全体が入ります。

``` ts
  // setup electron-store for persisted state
  const Store = require('electron-store')
  const store = new Store({ cwd: storeFilePathString })
  ipcMain.handle('GET_STORE_VALUE', (_: any, key: any) => {
    const result = store.get(key)
    return result
  })
  ipcMain.on('SYNC_STORE', (_: any, args: any) => {
    store.set('data', args)
  })
```

renderer側から処理が呼び出せるようにpreload.tsに処理を追加します。

``` ts
// preload.ts
const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  getInitialState: () => ipcRenderer.invoke('GET_STORE_VALUE', 'data'),
  syncStore: (state: string) => ipcRenderer.send('SYNC_STORE', state),
})
```

renderer側では`fecth()`と`mounted()`のライフサイクルフックを追加して、main側とstateデータのやり取りを行います。

``` diff
// TodoList.vue
<template>
  <v-container>
    <v-list>
      <v-list-item v-for="todoData in getTodoList" :key="todoData.name">
        <v-list-item-content class="px-2">
          <todo-data :todo="todoData" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-container>
</template>
<script lang="ts">
import Vue from 'vue'
import TodoData from './TodoData.vue'
+ import { accessorType } from '~/store'
export default Vue.extend({
  components: {
    TodoData,
  },
+  async fetch() {
+    if (window.api) {
+      const state: typeof accessorType = await window.api.getInitialState()
+      if (state) {
+        this.$store.replaceState(state)
+      }
+    }
+  },
+  data() {
+    return {
+      unsubscribe() {},
+    }
+  },
  computed: {
    getTodoList() {
      return this.$accessor.todos.getTodoList
    },
  },
+  mounted() {
+    this.unsubscribe = this.$store.subscribe((mutation, state) => {
+      if (mutation.type === 'todos/add' || mutation.type === 'todos/remove') {
+        if (window.api) window.api.syncStore(state)
+      }
+    })
+  },
+  beforeDestroy() {
+    this.unsubscribe()
+  },
})
</script>
```

this.$store.subscribeで作成したsubscriptionをunsubscribeするための記述が色々トリッキーでした。インテリセンスに頼って書いたため、正直完璧には理解できませんでした。

さらに、contextBridgeでexposeした`getInitialState`と`syncStore`は`window.api`以下に注入されるのですが、このままでは型がanyのため存在しないと怒られてしまいます。

エラーを抑制するために、型定義ファイルを追加しました。

``` ts
// types/global.d.ts
import { accessorType } from '~/store'

declare global {
  interface Window {
    api: Sandbox
  }
}

export interface Sandbox {
  getInitialState: () => Promise<typeof accessorType>
  syncStore: (state: string) => void
}
```

これで実装は完了です。`todos/add`または`todos/remove`のmutationが行われるとconfig.jsonファイルが`[ユーザのドキュメントフォルダ]\electron-app`以下に作成されました（削除を実装してなかったのでaddしか試していませんが。。。）

そしてTodo画面を再度開いた時には、前回作成したタスクが読み込まれてタスク一覧に表示されます。

## electronのdebug実行

なかなか実装がうまくいかず試行錯誤する中で、electron appをdebugする方法を少し学びました。今のところmain側とrenderer側を同時にdebugすることができず、それぞれ別の方法でdebug実行しました。

### renderer側のdebug

renderer側のdebugに関して特に難しいことはありません。electron appをdevelopment modeで実行し、vue.js devtoolsを使ってchromeと同じ感覚でjavascriptのdebugができます。

### main側のdebug

.vscode\launch.jsonを用意することで、vscodeからdebug実行が可能です。注意点として、renderer側はbuild済みのモジュールが使われるようなので、事前に`nuxt-ts generate`しておく必要があります。そうしないとrenderer側が古い状態で尚且つrenderer側のコードがdebugできないため、状況が全く掴めずハマります。（ハマりました）

``` json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Main Process",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
      "windows": {
        "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron.cmd"
      },
      "args": ["."],
      "outputCapture": "std"
    }
  ]
}
```

## 関連項目

- [Nuxt × TypeScript × Electron × SQLiteを動かしてみた2](https://blog.mamansoft.net/2019/12/29/nuxt-typescript-electron-sqlite-project2/)
- [secure-electron-store - Github](https://github.com/reZach/secure-electron-store)
