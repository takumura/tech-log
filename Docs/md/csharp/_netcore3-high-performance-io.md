---
title: ".NET Coreでハイパフォーマンスなファイル入出力処理"
date: "2020-02-29"
category: "csharp"
tag:
  - csharp
  - performance
---

C#7以降、パフォーマンス向上に寄与する機能が色々追加されましたが、その内容を確認できていませんでした。

これから作ろうとしているAngular Static webapp generatorの機能のうち、Markdown->JSON変換はC#で実装するつもりです。複数ファイルの入出力が必要なので、高効率な実装を探ります。

## 計測方法

Benchmark.netを利用して各種入出力処理の実行結果を計測します。テストデータには[Microsoft Docs](https://github.com/dotnet/docs.ja-jp)のmarkdownファイルを利用することにします。

## 関連項目

- [C#でTypeをキーにしたDictionaryのパフォーマンス比較と最速コードの実装](http://engineering.grani.jp/entry/2017/07/28/145035)
- [ファイルおよびストリーム入出力](https://docs.microsoft.com/ja-jp/dotnet/standard/io/index)
- [非同期ファイル I/O](https://docs.microsoft.com/ja-jp/dotnet/standard/io/asynchronous-file-i-o)
- [File I/O Performance Tips](https://jacksondunstan.com/articles/3318)
- [Parallel Foreach async in C#](https://medium.com/@alex.puiu/parallel-foreach-async-in-c-36756f8ebe62)
