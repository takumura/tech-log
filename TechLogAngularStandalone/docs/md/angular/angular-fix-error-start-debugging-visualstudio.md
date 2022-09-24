---
title: "新しいAngularテンプレートのVisualStudioデバッグエラー: デバッグアダプターを起動できませんでした"
date: "2022-09-23"
category: "Angular"
tag: ["Visual Studio", "Angular", "esproj"]
---

[ASP.NET Coreの新しいAngular template](https://learn.microsoft.com/ja-jp/visualstudio/javascript/tutorial-asp-net-core-with-angular?view=vs-2022)を使って作成したプロジェクトを試しています。

今回、Visual Studio 2022で新規にプロジェクトを作成後に、Angularのフロントエンドプロジェクト名を変更したところ、デバッグ実行時に「デバッグアダプターを起動できませんでした」というエラーが発生するようになってしまいました。原因と解消法について調査します。

<img src="assets/images/angular-fix-error-start-debugging-visualstudio/angular-fix-error-start-debugging-visualstudio-1.png" alt="debug error" title="debug error">

## 原因

「デバッグアダプターを起動できませんでした」は、デバッグ開始時にアタッチするブラウザを見つけられない場合に発生するエラーのようです。

新テンプレートでは、デバッグ開始時にMultiple Startupプロジェクトという形で、ASP.NET CoreのバックエンドプロジェクトとAngularのフロントエンドプロジェクトを同時に指定します。ASP.NET Coreのプロジェクト単体では、デバッグ実行が正常に動作するので、Angularのプロジェクト(esproj形式)の方に問題がありそうです。

プロジェクト名を変えたことがきっかけでエラーが始まったので、何か古いキャッシュが影響しているのかと再起動やtempデータ削除、プロジェクトの完全rebuildなどを試してみましたが効果がありません。

ほぼ変更前と同じ別プロジェクトが残っており、そちらではデバッグ実行が正常に行えたので比較を行い、プロジェクトのパーソナル設定ファイル`*.esproj.user`に差異を見つけました。

``` diff
<?xml version="1.0" encoding="utf-8"?>
<Project ToolsVersion="Current" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <PropertyGroup Condition="'$(Configuration)|$(Platform)'=='Debug|AnyCPU'">
+    <DebuggerFlavor>LaunchJsonDebugger</DebuggerFlavor>
+    <LaunchJsonTarget>
+      {
+      "type": "pwa-msedge",
+      "request": "launch",
+      "name": "localhost (Edge)",
+      "url": "https://localhost:4200",
+      "webRoot": "C:\\Repos\\tech-log\\AngularStandalone"
+      }
+    </LaunchJsonTarget>
  </PropertyGroup>
</Project>
```

パーソナル設定ファイルの中に`<DebugFlavor>`と`launch.json`に出てくるようなブラウザ接続の設定が記載されていました。これらの設定を追加したところデバッグのエラーも解消しました。

`webRoot`の値が、各開発者のローカルパスになるため`.user`ファイルでの記述になるのはわかるのですが、`.gitignore`では`.user`ファイルは除外指定にしているので、repositoryからクローンした開発者環境ではVisual Studioのデバッグに問題がありそうです。

## 暫定対応

試行錯誤してみたところ、`webRoot`の指定がなくても`LaunchJsonTarget`の指定があればdebugエラーが解消するので、ローカルパスを抜いた記述を`esproj`のほうにおまじない的に書いておいて様子を見ようと思います。
