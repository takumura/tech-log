---
created: 2025-07-15
updated: 2026-10-07
type: evergreen
category: atomic
tags:
  - term
  - tech/azure
publish: "true"
---
# 📌 定義
> [!NOTE] Definition
> Azure App Service は、基になるインフラストラクチャの管理を気にすることなく、Web アプリケーション、モバイル バックエンド、RESTful API を実行できるプラットフォームです。優れたアプリケーションの作成に集中できるように重い作業を引き受けてくれるWebホスティングサービスです。

## 🧩 詳細

### サポートされるWebスタック

[公式サイト](https://learn.microsoft.com/ja-jp/azure/app-service/overview)より引用:

> .NET、Java（Java SE、Tomcat、JBoss フレーバー）、Node.js、Python、PHP など、さまざまな Web スタックがサポートされており、Windows と Linux の両方で実行できる。アプリがコンテナー化されている場合は、カスタム コンテナーとしてデプロイするだけで済む。

### 利用履歴

tech blogを[[🗺️DokuWiki]]で作成していた際、サイトをホストするのに使用していました。現在はサイト停止中。

### 無料mode・共有modeのアイドルシャットダウン

一定時間アクセスがない場合はシャットダウンされリソースが解放されます。シャットダウンされていた場合、サイトへのアクセスがエラーとなります。対策として以下が考えられます。
- `有料のモードに移行する。`
- `cronジョブを利用するなどして、サイトへ定期的にアクセスしwarm upさせる。`
	- [[QNAP TS-239 Pro QTS 4.1のAzure App Serviceウォームアップ設定]]参照。

### 容量

無料枠は1GB。Angularプロジェクトは`node_modules`が主な要因となり、ASP.NET Core 1.1で約450MB、Core 2.0で約550MBを消費します。同一リソースグループ・同一AppServiceプランに複数のAppを稼働させるのは難しいため、基本的には各App毎に専用のリソースグループとプランを用意します。

### node version

初期設定のnodeはバージョンが古く、App settingsにてKey-Valueの登録が必要。利用可能なバージョンは`kudu(*.scm.azurewebsites.net)`の`REST API` > `Runtime version`で確認できます。

- `{WEBSITE_NODE_DEFAULT_VERSION:6.11.1}`

## 🔗 参考資料

- [Azure App Service | Microsoft Learn](https://learn.microsoft.com/ja-jp/azure/app-service/overview)
