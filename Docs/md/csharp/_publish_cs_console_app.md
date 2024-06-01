---
title: "C# Console App発行を最適化する"
date: "2024-06-01"
category: "csharp"
tag:
  - console
  - aot
  - trim
---

記事は段落ではなく、通常の文から始める。

## 単一ファイルの配置(Single-file deployment)

MS Learnの[Single-file deployment](https://learn.microsoft.com/en-gb/dotnet/core/deploying/single-file/overview)を参照して、csprojファイルにプロパティをセットしていきます。

公式の説明をそのまま引用します。

- `PublishSingleFile`: Enables single file publishing. Also enables single file warnings during dotnet build.
- `SelfContained`: Determines whether the app is self-contained or framework-dependent.
- `RuntimeIdentifier`: Specifies the OS and CPU type you're targeting. Also sets `<SelfContained>true</SelfContained>` by default.

`RuntimeIdentifier`を指定する場合は、クロスプラットフォームではなくなるがSelfContained（自己完結型展開）が標準で有効になるようです。

また、バンドル内にPBDファイルを含めたいので`<DebugType>embedded</DebugType>`も指定することにします。

発行にはVisual Studioを利用します。[発行に関するMS Learnの説明](https://learn.microsoft.com/en-gb/dotnet/core/deploying/single-file/overview?tabs=vs#publish-a-single-file-app)の通りに発行を実行すると、exeファイルの１つのみが作成されていました。サイズは__77.4MB__でした。

動作確認を行い、一つのexeだけでappが正常に動作しています。

## ReadyToRun

[ReadyToRunに関するMS Learnの説明](https://learn.microsoft.com/en-gb/dotnet/core/deploying/ready-to-run)によると、この機能を有効にすることapp起動時間の高速化が期待できるようです。

- <PublishReadyToRun>true</PublishReadyToRun>

変更後に発行を実行すると、exeファイルのサイズは__66.5MB__で14%(10.9MB)削減されました。

## トリミング(trim)

exeファイルを最適化して、ファイルサイズを小さくできたら最高です。トリミングオプションを適用して、利用していない不要なモジュールを取り除くことに挑戦します。

[トリミングに関するMS Learnの説明](https://learn.microsoft.com/en-gb/dotnet/core/deploying/trimming/trimming-options?pivots=dotnet-8-0)を参照して、csprojファイルにプロパティをセットしていきます。

- `<PublishTrimmed>true</PublishTrimmed>`
- `<SuppressTrimAnalysisWarnings>false</SuppressTrimAnalysisWarnings>`

変更後に発行を実行すると、exeファイルのサイズは__13.5MB__で82%(64MB)も削減されました。しかし利用しているライブラリ`ConsoleAppFramework`で以下の警告が表示されました。

`D:\nuget-cache\consoleappframework\4.2.4\lib\net6.0\ConsoleAppFramework.dll(0,0): 警告 IL2104: Assembly 'ConsoleAppFramework' produced trim warnings. For more information see https://aka.ms/dotnet-illink/libraries`

Appを実行すると実行時エラーが発生してしまいます。

```
Fail to create ConsoleAppBase instance. Type:ConsoleAppFramework.DefaultCommands
System.InvalidOperationException: A suitable constructor for type 'ConsoleAppFramework.DefaultCommands' could not be located. Ensure the type is concrete and all parameters of a public constructor are either registered as services or passed as arguments. Also ensure no extraneous arguments are provided.
   at Microsoft.Extensions.DependencyInjection.ActivatorUtilities.FindApplicableConstructor(Type , Type[], ConstructorInfo& , Nullable`1[]& )
   at Microsoft.Extensions.DependencyInjection.ActivatorUtilities.CreateInstance(IServiceProvider, Type , Object[] )
   at ConsoleAppFramework.ConsoleAppEngine.RunCore(Type, MethodInfo, Object , String[] , Int32)
```

必要なライブラリまで不要と認識して取り除かれてしまっているようです。解決するには`TrimmerRootAssembly`プロパティで必要なライブラリをroot指定することでTrim対象から除外できるようです。

- `<TrimmerRootAssembly Include="ConsoleAppFramework" />`

再度発行を行い、動作確認をしますがやはりエラーになります。ConsoleAppFrameworkが内部でリフレクションを利用しており、これが原因でtrimに影響があるようです。

## Native AOT発行

[Native AOT発行に関するMS Learnの説明](https://learn.microsoft.com/en-gb/dotnet/core/deploying/native-aot/?tabs=net8plus%2Cwindows)によると、この機能を有効にすることでapp起動時間の高速化と少ないメモリでの起動が期待できるようです。機能有効化のためのプロパティをセットしていきます。

- `<PublishAot>true</PublishAot>`

発行を実行したところ失敗し、エラー:`PublishAot and PublishSingleFile cannot be specified at the same time.`が表示されました。`PublishAot`と`PublishSingleFile`は同時に指定できないようです。

`PublishAot`だけを指定して発行を行うと、別のエラーが発生しました。

`Platform linker not found. Ensure you have all the required prerequisites documented at https://aka.ms/nativeaot-prerequisites, in particular the Desktop Development for C++ workload in Visual Studio. For ARM64 development also install C++ ARM64 build tools.	PhotoRenamer.Console	D:\nuget-cache\microsoft.dotnet.ilcompiler\8.0.5\build\Microsoft.NETCore.Native.Windows.targets	123`

Native AOT使用の[前提条件](https://learn.microsoft.com/en-gb/dotnet/core/deploying/native-aot/?tabs=net8plus%2Cwindows#prerequisites)を確認しろ、とのことで改めてみてみると`Desktop development with C++ workload`のインストールが必要とのこと。

インストール後に再度発行を行い、動作確認をしますがやはりエラーになります。トリミングと同様、リフレクションを利用しているライブライを使っている場合は対応が難しいようです。

## 妥協案

[Trimming granularity](https://learn.microsoft.com/en-gb/dotnet/core/deploying/trimming/trimming-options?pivots=dotnet-8-0#trimming-granularity)によると、TrimModeをPartialにすることで、トリミングをオプトインしたアセンブリのみを対象にすることができるとのこと。

- `<TrimMode>partial</TrimMode>`

変更後に発行を実行すると、exeファイルのサイズは__14.1MB__で81%(63MB)削減されました。full modeでのトリミングより1%サイズが増加しました。この1%が本来必要なConsoleAppFrameworkの分と思われます。

動作確認したところエラーが改善しており、appを正常動作させることができました。

## 現状のまとめ

リフレクションを利用したライブラリで実行時optionのハンドリングを行っている場合、トリミングやNative AOT発行に影響があるようです。妥協案によりトリミングは可能でしたがNative AOT発行を行うことはできませんでした。

引き続き調査を続け、代替ライブラリを探すか、実行時optionのハンドリングを自身で実装した場合にどうなるのか確認する必要があります。

## 関連項目
