---
title: "NuxtJS + Electronアプリで、セキュアなプロセス間通信を構成する"
date: "2021-02-12"
category: "Vue"
tag:
- vue
- nuxtjs
- electron
---

electronアプリでは脆弱性対応のため、ローカルファイルシステムやOSの処理をNuxtJS側（レンダラープロセス）では行わず、メインプロセス側で実行することが推奨されています。

メインプロセスとレンダラープロセス間の通信方法はelectronのバージョンアップと共に頻繁に変更されているようなので、現時点(electron v11)での安全な方法について調べ、実装していきます。

## 環境確認

- エディタ: VSCode
- nodejs: v12.16.0
- yarn: 1.22.4
- electron: 11.1.1

## 情報収集

electron-storeとsecure-electron-storeについて。secure-electron-storeでいけそう？

## secure-electron-store トライアル

まずはインストールします。

```ps
> yarn add secure-electron-store
```

## 関連項目

- [secure-electron-store - Github](https://github.com/reZach/secure-electron-store)
