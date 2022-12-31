---
title: ".NET6とAngular v13でSPAサイトを作る（バックエンド）"
date: "2022-01-06"
category: "csharp"
tag:
  - csharp
  - net6
  - angular
---

本サイトは自作のwebサイト生成エンジンで生成されています。自作エンジンは2019年に.NET Core 2.1とAngular v7で開発しました。

それから時は流れ、2021年末時点でバックエンド側は.NET6に、フロントエンド側はAngular v13にそれぞれバージョンアップされています。

進化の波に取り残されないように、最新バージョンのモジュールを使ってwebサイト生成エンジンを再開発してみようと思います。

この記事では、バックエンド編ということで.NET6のASP.NET Core SPAプロジェクト側のBackground Serviceと、Markdownを記事ファイルをJsonへ変換する機構を実装していきます。

## Backend Service

旧webサイト生成エンジンでは、[この記事](https://docs.microsoft.com/en-gb/dotnet/architecture/microservices/multi-container-microservice-net-applications/background-tasks-with-ihostedservice)を参考に、MarkdownファイルをJsonに変換するBackgroundServiceをASP.NET Coreのプロセスに登録していました。

[この記事](https://docs.microsoft.com/en-us/aspnet/core/migration/50-to-60-samples?view=aspnetcore-6.0#add-services)を見るに、ASP.NET Core アプリの新しい .NET 6 最小ホスティング モデル(minimal hosting model)でも、登録方法の書き方が変わっただけで同じようにBackground Serviceを登録できそうです。

``` diff
// Program.cs

 @@ -1,3 +1,5 @@
+using Net6MarkdownWebEngine.Backend.Services;
+
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

 @@ -7,6 +9,27 @@ builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

+// // Add md2json converter service
+//builder.Services.AddSingleton<IService, MarkdownConverterService>();
+
+// Add Documents Watch Service
+var contetRootPath = builder.Environment.ContentRootPath;
+var isDevelopment = builder.Environment.IsDevelopment();
+builder.Services.Configure<DocumentsWatchServiceOptions> (options =>
+{
+    // TODO: review correct input/output directory path
+    options.InputDirectry = Path.Combine(contetRootPath, "../AngularStandalone/src/assets/docs");
+    if (isDevelopment)
+    {
+        options.OutputDirectry = Path.Combine(contetRootPath, "../AngularStandalone/src/assets/json");
+    }
+    else
+    {
+        options.OutputDirectry = Path.Combine(contetRootPath, "../AngularStandalone/dist/assets/+json");
+    }
+});
+builder.Services.AddSingleton<Microsoft.Extensions.Hosting.IHostedService, DocumentsWatchService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
```

## Markdown to Json Converter

コンソールアプリケーションのプログラムも、.NET 6からはシンプルな最上位レベルのステートメントのテンプレートで生成されていました。

ですが、シンプルな形式でのうまい記述方法が見いだせなかったので、以前と同様にクラスを宣言する書き方で実装しました。この部分は将来への宿題です。

せっかくのリライトなので、以前の実装で気になっていた部分について書き直してみました。

- 再帰してフォルダとファイルを探索する際、folder構成が深い場合に速度低下が発生していた。再帰を使わずに対象ファイルをリストアップするように変更。
- ファイルの読み込み/書き込みは並列処理可能なので、.NET 6で追加されたParallel.ForEachAsycを利用した非同期並列処理を実装
- JSON serializer/deserializerをJson.NETからDynaJsonに変更
  - [DynaJsonではJSONデータをRFCに則り厳密にparseする](https://dev.to/fujieda/how-to-make-json-parser-strict-4a85)とのことで、escape characterの差分が現れました。フロントエンド側での表示に影響が出る懸念あり（後で要確認）

パフォーマンスの測定も時間ができたら試してみたいと思います。

### Exponential backoff on StreamWriter.WriteAsync

以前のバージョンから気になっていたことなのですが、Markdownファイルの読み込み時に以下のエラーが発生することが度々ありました。

``` powershell
System.IO.IOException: The process cannot access the file 'xxxx.md' because it is being used by another process.
```

VSCodeがファイルの保存時にPrettierのコードフォーマットでファイルを保持するためと思われます。リトライの機構を組み込まなければと思いつつ放置していたので今回対応することにしました。

調べてみると[Polly](https://github.com/App-vNext/Polly)というライブラリがすごく充実していて便利そうだったので試してみました。

``` cs
private AsyncRetryPolicy GetRetryPolicy()
{
    return Policy.Handle<IOException>()
        .WaitAndRetryAsync(4,
            sleepDurationProvider: retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
            onRetry: (exception, retryCount) =>
            {
                logger.LogInformation($"catch IOException, retrying... ({retryCount})");
            }
        );
}

private async ValueTask<string> ReadToEndFileAsync(string filePath)
{
    logger.LogTrace($"read file: {filePath}");
    var result = string.Empty;

    result = await GetRetryPolicy().ExecuteAsync(async () =>
    {
        using var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, fileStreamBufferSize, FileOptions.Asynchronous);
        using var streamReader = new StreamReader(fileStream, Encoding.UTF8);
        return await streamReader.ReadToEndAsync();
    });
    return result;
}

private async ValueTask WriteJsonFileAsync(string jsonText, string jsonFilePath)
{
    logger.LogTrace($"write file: {jsonFilePath}");
    var targetFolder = Path.GetDirectoryName(jsonFilePath) ?? "";
    if (!Directory.Exists(targetFolder)) Directory.CreateDirectory(targetFolder);

    await GetRetryPolicy().ExecuteAsync(async () =>
    {
        using var fileStream = new FileStream(jsonFilePath, FileMode.Create, FileAccess.Write, FileShare.Write, fileStreamBufferSize, FileOptions.Asynchronous);
        using var streamWriter = new StreamWriter(fileStream);
        await streamWriter.WriteAsync(jsonText);
    });
}
```

上記のようにPollyの`Policy`を作成し、Policy.ExecuteAsyncすることで、非同期taskに対して定義したpolicyの通りにリトライしてくれます。Retry回数は4回、待機時間はExponential Back-offのロジックにしてみました。[Polly.Contrib.WaitAndRetry](https://github.com/Polly-Contrib/Polly.Contrib.WaitAndRetry)という追加ライブラリには[Backoff.ExponentialBackoff](https://github.com/Polly-Contrib/Polly.Contrib.WaitAndRetry#wait-and-retry-with-exponential-back-off)が用意されていて、Enterprise Appにはこちらを使うのが良さそうでした。

``` powershell
# 実行ログ
info: Net6MarkdownWebEngine.Backend.Services.DocumentsWatchService[0]
      Watch documents updated after 07/31/2022 18:01:58
info: Net6MarkdownWebEngine.Backend.Services.DocumentsWatchService[0]
      File change detected. Start md2json conversion for updated file(s).
info: Net6MarkdownWebEngine.Converter.MarkdownConverterService[0]
      target source directory: C:\Repos\net6-markdown-web-engine\AspNetCoreWebApi\Docs/md
info: Net6MarkdownWebEngine.Converter.MarkdownConverterService[0]
      target destination directory: C:\Repos\net6-markdown-web-engine\AspNetCoreWebApi\Docs/json
info: Net6MarkdownWebEngine.Converter.MarkdownConverterService[0]
      No target files found to delete
info: Net6MarkdownWebEngine.Converter.MarkdownConverterService[0]
      1 target files found to check updates
info: Net6MarkdownWebEngine.Converter.MarkdownConverterService[0]
      catch IOException, retrying... (00:00:02)
info: Net6MarkdownWebEngine.Converter.MarkdownConverterService[0]
      No target files found to add
info: Net6MarkdownWebEngine.Converter.MarkdownConverterService[0]
      generate index.json to index directory: C:\Repos\net6-markdown-web-engine\AspNetCoreWebApi\../AngularStandalone/src/assets
info: Net6MarkdownWebEngine.Backend.Services.DocumentsWatchService[0]
      Watch documents updated after 07/31/2022 18:02:01
```

## 関連項目

- [IHostedService と BackgroundService クラスを使ってマイクロサービスのバックグラウンド タスクを実装する](https://docs.microsoft.com/ja-jp/dotnet/architecture/microservices/multi-container-microservice-net-applications/background-tasks-with-ihostedservice)
- [.NET の Worker サービス](https://docs.microsoft.com/ja-jp/dotnet/core/extensions/workers)
- [Parallel Foreach async in C#](https://medium.com/@alex.puiu/parallel-foreach-async-in-c-36756f8ebe62)
- [Parallel.ForEachAsync in .NET 6](https://www.hanselman.com/blog/parallelforeachasync-in-net-6)
- [C#でParallelの処理速度比較(for, foreach, AsParallel(), AsParallel().ForAll(), Parallel.ForEach())](https://dasuma20.hatenablog.com/entry/cs/parallel-of-speed)
- [Retry: Exponential backoff - Polly](https://github.com/App-vNext/Polly/wiki/Retry#exponential-backoff)
