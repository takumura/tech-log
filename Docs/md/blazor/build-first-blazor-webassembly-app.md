---
title: "Blazor WebAssemblyアプリを作成する"
date: "2020-05-05"
category: "Blazor"
tag:
  - blazor
  - webassembly
---

NET5でproduction readyになる予定のBlazor WebAssemblyの情報収集と、空のアプリ作成を作成してみる。

## 情報収集

MS Docsにある[チュートリアル - 最初の Blazor アプリをビルドする](https://docs.microsoft.com/ja-jp/aspnet/core/tutorials/build-your-first-blazor-app?view=aspnetcore-3.1)を試してみる事にします。

注意書きには".NET Core 3.1ではプレビュー段階である"と書いてあるので、NET5になったら手順等改めて振り返る必要がありそうです。

```plaintext
プレビュー段階の Blazor WebAssembly
" Blazor サーバー" は ASP.NET Core 3.0 でサポートされています。 " Blazor WebAssembly" は、ASP.NET Core 3.1 のプレビュー段階です。
```

また[ASP.NET Core Blazor の概要](https://docs.microsoft.com/ja-jp/aspnet/core/blazor/get-started?view=aspnetcore-3.1&tabs=visual-studio)には、

```plaintext
Blazor WebAssembly エクスペリエンス (Visual Studio 16.6 Preview 2 以降) については、 [Blazor WebAssembly アプリ] テンプレートを選択します。
````

と記載されているので、Visual Studioで開発を行う場合は16.6以降が必要なようです。

今日(2020-05-05)時点の最新は16.5.4だったので、Visual Studio 2019 Previewをインストールして開発に使用します。

また、以下のコマンドを実行して、テンプレートをインストールします。実行前にプロジェクトを作成してもBlazorサーバテンプレートしか表示されず、Blazor WebAssemblyプロジェクトを開始できませんでした。

``` powershell
> dotnet new -i Microsoft.AspNetCore.Components.WebAssembly.Templates::3.2.0-preview5.20216.8
```

実行後の利用可能なテンプレートは以下の通り。

```plaintext
Templates                                         Short Name               Language          Tags
----------------------------------------------------------------------------------------------------------------------------------
Console Application                               console                  [C#], F#, VB      Common/Console
Class library                                     classlib                 [C#], F#, VB      Common/Library
WPF Application                                   wpf                      [C#]              Common/WPF
WPF Class library                                 wpflib                   [C#]              Common/WPF
WPF Custom Control Library                        wpfcustomcontrollib      [C#]              Common/WPF
WPF User Control Library                          wpfusercontrollib        [C#]              Common/WPF
Windows Forms (WinForms) Application              winforms                 [C#]              Common/WinForms
Windows Forms (WinForms) Class library            winformslib              [C#]              Common/WinForms
Worker Service                                    worker                   [C#]              Common/Worker/Web
Unit Test Project                                 mstest                   [C#], F#, VB      Test/MSTest
NUnit 3 Test Project                              nunit                    [C#], F#, VB      Test/NUnit
NUnit 3 Test Item                                 nunit-test               [C#], F#, VB      Test/NUnit
xUnit Test Project                                xunit                    [C#], F#, VB      Test/xUnit
Razor Component                                   razorcomponent           [C#]              Web/ASP.NET
Razor Page                                        page                     [C#]              Web/ASP.NET
MVC ViewImports                                   viewimports              [C#]              Web/ASP.NET
MVC ViewStart                                     viewstart                [C#]              Web/ASP.NET
Blazor Server App                                 blazorserver             [C#]              Web/Blazor
Blazor WebAssembly App                            blazorwasm               [C#]              Web/Blazor/WebAssembly
ASP.NET Core Empty                                web                      [C#], F#          Web/Empty
ASP.NET Core Web App (Model-View-Controller)      mvc                      [C#], F#          Web/MVC
ASP.NET Core Web App                              webapp                   [C#]              Web/MVC/Razor Pages
ASP.NET Core with Angular                         angular                  [C#]              Web/MVC/SPA
ASP.NET Core with React.js                        react                    [C#]              Web/MVC/SPA
ASP.NET Core with React.js and Redux              reactredux               [C#]              Web/MVC/SPA
Razor Class Library                               razorclasslib            [C#]              Web/Razor/Library/Razor Class Library
ASP.NET Core Web API                              webapi                   [C#], F#          Web/WebAPI
ASP.NET Core gRPC Service                         grpc                     [C#]              Web/gRPC
dotnet gitignore file                             gitignore                                  Config
global.json file                                  globaljson                                 Config
NuGet Config                                      nugetconfig                                Config
Dotnet local tool manifest file                   tool-manifest                              Config
Web Config                                        webconfig                                  Config
Solution File                                     sln                                        Solution
Protocol Buffer File                              proto                                      Web/gRPC
```

`Blazor WebAssembly App`テンプレートを選択すると、`ASP.NET Core hosted`と`Progressive Web Application`のチェックボックスが表示されました。

`ASP.NET Core hosted`については[ASP.NET Core Blazor のホスティング モデル](https://docs.microsoft.com/ja-jp/aspnet/core/blazor/hosting-models?view=aspnetcore-3.1)に詳細が書かれており、チェックするとBlazorサーバと同様にサーバ側で処理が行われるようになるので、チェックしないことにしました。

`Progressive Web Application`については[ASP.NET Core Blazor WebAssembly を使用してプログレッシブ Web アプリケーションをビルドする](https://docs.microsoft.com/ja-jp/aspnet/core/blazor/progressive-web-app?view=aspnetcore-3.1&tabs=visual-studio)に記載があり、チェックすることで何も損しなさそうなので、チェックをしてプロジェクトを作成しました。

プロジェクト作成後、`F5`キーで実行すると、問題なくBlazor WebAssemblyアプリが起動しました。Chrome DevToolsでネットワークリソースを確認したところ、6.5MBと噂通り巨大なアプリサイズです（これでも少なくなったらしいですが）。

``` powershell
68 requests, 6.5MB transferred, 18.0MB resources, Finish: 3.51s, DOMContentLoaded: 282ms, Load:291ms
```

2度目のページ取得ではだいぶ軽くなります。

``` powershell
11 requests, 171kB transferred 508kB resources, Finish:1.63s, DOMContentLoaded: 359ms, Load:361ms
```

その後、todoページの作成まで一通り写経して、Blazorの基礎の基礎を理解しました。スタイルを一切変えていないので、見た目は少しヘンテコリンです。

デフォルトテンプレートはbootstrap4のcssで装飾されています。公式のFluent Design実装はまだなく、[open issue](https://github.com/dotnet/aspnetcore/issues/11229)で議論されているようです。

## 関連項目

- [Awesome Blazor](https://awesomeopensource.com/project/AdrienTorris/awesome-blazor)
