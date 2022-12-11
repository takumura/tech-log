---
title: "ASP.NET Core HTTPS 開発証明書を信頼する"
date: "2019-11-01"
category: "csharp"
tag:
  - csharp
  - asp.net core
  - https
  - dev-certs
---

ASP.NET CoreでHTTPSを利用したAppを開発し始めた際、初見のエラーが発生したエラーので対応方法を記録します。内容的にはMicrosoft learnの[Windows と macOS で ASP.NET Core HTTPS 開発証明書を信頼する](https://learn.microsoft.com/ja-jp/aspnet/core/security/enforcing-ssl?view=aspnetcore-7.0&tabs=visual-studio#trust-the-aspnet-core-https-development-certificate-on-windows-and-macos)です。

## エラーの再現方法

ASP.NET CoreのWebAppプロジェクトを作成しデバッグ起動します。

``` powershell
PS C:\\Repos\\github\\tech-log\\Website> dotnet run

C:\\Repos\\github\\tech-log\\Website\\Properties\\launchSettings.json からの起動設定を使用中...
info: Microsoft.AspNetCore.DataProtection.KeyManagement.XmlKeyManager[0]
      User profile is available. Using 'C:\\Users\\takum\\AppData\\Local\\ASP.NET\\DataProtection-Keys' as key repository and Windows DPAPI to encrypt keys at rest.
crit: Microsoft.AspNetCore.Server.Kestrel[0]
      Unable to start Kestrel.
System.InvalidOperationException: Unable to configure HTTPS endpoint. No server certificate was specified, and the default developer certificate could not be found.
To generate a developer certificate run 'dotnet dev-certs https'. To trust the certificate (Windows and macOS only) run 'dotnet dev-certs https --trust'.
For more information on configuring HTTPS see <https://go.microsoft.com/fwlink/?linkid=848054>.
   at Microsoft.AspNetCore.Hosting.ListenOptionsHttpsExtensions.UseHttps(ListenOptions listenOptions, Action`1 configureOptions)
   at Microsoft.AspNetCore.Hosting.ListenOptionsHttpsExtensions.UseHttps(ListenOptions listenOptions)
   at Microsoft.AspNetCore.Server.Kestrel.Core.Internal.AddressBinder.AddressesStrategy.BindAsync(AddressBindContext context)
   at Microsoft.AspNetCore.Server.Kestrel.Core.Internal.AddressBinder.BindAsync(IServerAddressesFeature addresses, KestrelServerOptions serverOptions, ILogger logger, Func`2 createBinding)
   at Microsoft.AspNetCore.Server.Kestrel.Core.KestrelServer.StartAsync[TContext]\(IHttpApplication\`1 application, CancellationToken cancellationToken)

Unhandled Exception: System.InvalidOperationException: Unable to configure HTTPS endpoint. No server certificate was specified, and the default developer certificate could not be found.
To generate a developer certificate run 'dotnet dev-certs https'. To trust the certificate (Windows and macOS only) run 'dotnet dev-certs https --trust'.
For more information on configuring HTTPS see <https://go.microsoft.com/fwlink/?linkid=848054>.
   at Microsoft.AspNetCore.Hosting.ListenOptionsHttpsExtensions.UseHttps(ListenOptions listenOptions, Action`1 configureOptions)
   at Microsoft.AspNetCore.Hosting.ListenOptionsHttpsExtensions.UseHttps(ListenOptions listenOptions)
   at Microsoft.AspNetCore.Server.Kestrel.Core.Internal.AddressBinder.AddressesStrategy.BindAsync(AddressBindContext context)
   at Microsoft.AspNetCore.Server.Kestrel.Core.Internal.AddressBinder.BindAsync(IServerAddressesFeature addresses, Kes   at Microsoft.AspNetCore.Server.Kestrel.Core.KestrelServer.StartAsync[TContext](IHttpApplication`1 application, Canc   at Microsoft.AspNetCore.Hosting.Internal.WebHost.StartAsync(CancellationToken cancellationToken)
   at Microsoft.AspNetCore.Hosting.WebHostExtensions.RunAsync(IWebHost host, CancellationToken token, String shutdownMessage)
   at Microsoft.AspNetCore.Hosting.WebHostExtensions.RunAsync(IWebHost host, CancellationToken token)
   at Microsoft.AspNetCore.Hosting.WebHostExtensions.Run(IWebHost host)
   at Karen.Web.Program.Main(String\[] args) in C:\\Repos\\github\\tech-log\\Website\\Program.cs:line 10
```

Startupの処理の中で`app.UseHsts()`していると発生するようです。

## 対応方法

エラーメッセージの中に対応方法まで記載されています。

``` powershell
PS C:\\Repos\\github\\tech-log\\Website> dotnet dev-certs https
The HTTPS developer certificate was generated successfully.
```

再度デバッグ実行すると、エラーは発生しなくなりました。

``` powershell
PS C:\\Repos\\github\\tech-log\\Website> dotnet run
C:\\Repos\\github\\tech-log\\Website\\Properties\\launchSettings.json からの起動設定を使用中...
info: Microsoft.AspNetCore.DataProtection.KeyManagement.XmlKeyManager[0]
      User profile is available. Using 'C:\\Users\\takum\\AppData\\Local\\ASP.NET\\DataProtection-Keys' as key repository and Windows DPAPI to encrypt keys at rest.
info: Karen.Web.DocWatchService[0]
      Start conversion for updated file.
```

## 追加で確認したこと

開発専用のSSL証明書を作成する必要があったということのようですが、`app.UseHsts`が何をしているのかよくわかっていませんでした。[HSTS - wikipedia](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security)によると、初回のhttpアクセス時のレスポンスヘッダに`"Strict-Transport-Security`を付与することで、次回以降httpsでの接続を強制するというルールの事でした。

また、今回の対応では`dotnet dev-certs https`で、証明書の作成をしていましたが、最初に挙げた記事など色々な参考文献をあたっても`dotnet dev-certs https --trust`という風にtrustオプションをつけていました。開発時証明書を（無ければ作成し）信頼する事になるのでしょう。

作業マシンで一度このコマンドを実行すればよいものなので、なかなか発生せず忘れてしまいそうです。`dotnet dev-certs`という文言を見かけたら、この記事を思い出すことにしようと思います。

## 関連項目

- [ASP.NET Core の概要 | Microsoft Learn](https://learn.microsoft.com/ja-jp/aspnet/core/getting-started/?view=aspnetcore-7.0&tabs=windows)
- [.NET CLI を使用して自己署名証明書を生成する | Microsoft Learn](https://learn.microsoft.com/ja-jp/dotnet/core/additional-tools/self-signed-certificates-guide)
