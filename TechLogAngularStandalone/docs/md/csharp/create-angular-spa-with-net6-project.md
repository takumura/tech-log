---
title: ".NET6とAngular v13でSPAサイトを作る（VSプロジェクト作成）"
date: "2021-12-26"
category: "csharp"
tag: ["net6","angular v13"]
---

本サイトは自作のwebサイト生成エンジンで生成されています。自作エンジンは2019年に.NET Core 2.1とAngular v7で開発しました。

それから時は流れ、2021年末時点でバックエンド側は.NET6に、フロントエンド側はAngular v13にそれぞれバージョンアップされています。

進化の波に取り残されないように、最新バージョンのモジュールを使ってwebサイト生成エンジンを再開発してみようと思います。

この記事では、VSプロジェクト作成編ということで.NET6のASP.NET Core SPAプロジェクトと、Angularプロジェクトをそれぞれ作成していきます。Microsoft Docsに[チュートリアル記事](https://docs.microsoft.com/en-gb/visualstudio/javascript/tutorial-asp-net-core-with-angular?view=vs-2022)を見つけたので、それを参考にしつつ作業を進めていきます。

## 開発準備

まずは.NET 6を利用するために、Visual Studio2022をinstallします。フロントエンド側は、nodejsも含めて個別に必要なpackageを手動インストールするつもりだったので、ワークロードは`ASP.NETとWeb開発`のみを選択しました。

新規プロジェクトを新しいAngular Templateから作成時に、globalにinstallしているAngular CLIがv9.1.12では古すぎるのかエラーが発生しました。

なのでnodejsとAngular CLIをアップグレードしました。

- nodejs: nodejs-lts: 14.16.1 -> 16.13.1
  - scoopで管理しているので`scoop update *`コマンドにて更新
- Angular CLI: 9.1.12 -> 12.2.14
  - 最新はv13.1.2ですが、このバージョンだと[プロジェクト作成時にエラーが発生](https://developercommunity.visualstudio.com/t/standalone-typescript-angular-merge-confilct/1611006)したため、まずはv12を使用

## 新規ソリューションとフロントエンドプロジェクトの作成

VS2022で`新しいプロジェクト`を選択し、`Standalone Angular Template`を使用してプロジェクトを作成しました。

`追加情報`ウィンドウが表示されたので、`Add integration for Empty ASP.NET Web API Project`にチェックを入れました。

プロジェクト生成処理が正常に終了すると、slnファイルとフロントエンドのAngularプロジェクトが生成されていました。見慣れない`{プロジェクト名}.esproj`というのが気になって調べたところ、VS2022から利用可能になった[新しいJavaScript/TypeScript Projectのファイル](https://docs.microsoft.com/en-gb/visualstudio/javascript/javascript-in-vs-2022?view=vs-2022#project-templates)ということでした。

## バックエンドプロジェクトの作成

先に作成したソリューションに追加する形で、ASP.NET Core Web APIプロジェクトを作成しました。

フレームワークには`.NET 6.0`を選択、承認は不要なので`なし`にしました。

C# 9.0の新機能 [最上位レベルのステートメント](https://docs.microsoft.com/ja-jp/dotnet/csharp/whats-new/csharp-9#top-level-statements)のおかげで、Program.csが驚くほどシンプル担っているのに驚きました。

C# 10からglobal namespaceが使えるようになったとのことですが、生成されたASP.NET Core APIのコードは以前のままだったので、global namespaceに変更してみました。

また、esprojのnpmを使うように指示している部分をyarnを使うように変更しました。

``` diff
 @@ -3,7 +3,7 @@
    <ProjectGuid>bab8cfe4-58b1-4e20-acee-2a2596812eb4</ProjectGuid>
  </PropertyGroup>
  <PropertyGroup Condition="'$(Configuration)|$(Platform)'=='Debug|AnyCPU'">
--    <StartupCommand>npm start</StartupCommand>
++    <StartupCommand>yarn start</StartupCommand>
    <JavaScriptTestFramework>Jasmine</JavaScriptTestFramework>
  </PropertyGroup>
  <ItemGroup>
 @@ -17,6 +17,6 @@
    </Exec>
    <Error Condition="'$(ErrorCode)' != '0'" Text="Node.js is required to build and run this project. To continue, please install Node.js from https://nodejs.org/, and then restart your command prompt or IDE." />
    <Message Importance="high" Text="Restoring dependencies using 'npm'. This may take several minutes..." />
--    <Exec WorkingDirectory="$(SpaRoot)" Command="npm install" />
++    <Exec WorkingDirectory="$(SpaRoot)" Command="yarn install" />
  </Target>
</Project>
```

[プロジェクトのプロパティ設定](https://docs.microsoft.com/en-gb/visualstudio/javascript/tutorial-asp-net-core-with-angular?view=vs-2022#set-the-project-properties)と[スタートアップ プロジェクトの設定](https://docs.microsoft.com/en-gb/visualstudio/javascript/tutorial-asp-net-core-with-angular?view=vs-2022#set-the-startup-project)は書かれている通りに実施しました。

最初はフロントエンドプロジェクトのプロパティ設定（起動するdebuggerに`launch.json`を指定）の画面がうまく表示されず、３０分ほどハマりました。

esprojファイルの先頭行が`<Project Sdk="Microsoft.VisualStudio.JavaScript.Sdk/0.4.0-alpha">`で始まっており、[nugetのサイト](https://www.nuget.org/packages/Microsoft.VisualStudio.JavaScript.SDK/)を確認すると、最新バージョン2021-12-01頃`0.5.0-alpha`に更新されていました。VS2022 previewでは`0.4.0-alpha`を利用しており、リリースのタイミングで`0.5.0-alpha`へ更新されたのにテンプレートが生成するesprojのバージョンが古いためにうまく動かなかったようです。

Project SDKのバージョンを以下のように`0.5.0-alpha`へ更新したところ、スクリプトファイルなどが正しくプロジェクトへincludeされた状態になり、プロパティもチュートリアルのように正しく表示されるようになりました。

``` diff
 @@ -1,4 +1,4 @@
-<Project Sdk="Microsoft.VisualStudio.JavaScript.Sdk/0.4.0-alpha">
+<Project Sdk="Microsoft.VisualStudio.JavaScript.Sdk/0.5.0-alpha">
  <PropertyGroup Label="Globals">
    <ProjectGuid>bab8cfe4-58b1-4e20-acee-2a2596812eb4</ProjectGuid>
  </PropertyGroup>
```

最後にバックエンド側`launchSettings.json`で指定しているApplicationURL(https)と、フロントエンド側`proxy.conf.js`のtarget APIサーバURLがポートまで一致するように設定したら、全ての設定が完了しました。

Visual Studio F5のデバッグ実行で、フロントエンド側とバックエンド側が両方同時に実行され、Weather Forcastのデモデータが想定通り表示されました。

proxy.conf.jsがポイントのようで、`angular.json`の`projects.{app name}.architect.serve.options.proxyConfig`にこのファイルが指定されていました。詳細は要調査ですが、HttpClient.getする際に、contextと一致するrequestのtarget apiサーバを指定しているようです。

``` js
// proxy.conf.js
const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",
    ],
    target: "https://localhost:7069",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
```

新しいAPIを実装したら、それを`proxy.conf.js`に追加すれば良さそうです。

## 関連項目

- [ASP.NET Core で Angular プロジェクト テンプレートを使用する](https://docs.microsoft.com/ja-jp/aspnet/core/client-side/spa/angular?view=aspnetcore-6.0&tabs=visual-studio)
- [チュートリアル: Visual Studio での Angular を使用した ASP.NET Core アプリの作成](https://docs.microsoft.com/ja-jp/visualstudio/javascript/tutorial-asp-net-core-with-angular?view=vs-2022)
- [dotnet new 用の .NET の既定のテンプレート](https://docs.microsoft.com/ja-jp/dotnet/core/tools/dotnet-new-sdk-templates#angular-react)
- [Visual Studio 2022 の JavaScript および TypeScript](https://docs.microsoft.com/ja-jp/visualstudio/javascript/javascript-in-vs-2022?view=vs-2022)
- [最上位レベルのステートメント - Main メソッドを使用しないプログラム](https://docs.microsoft.com/ja-jp/dotnet/csharp/fundamentals/program-structure/top-level-statements#global-namespace)
