---
title: "Windows11の開発ドライブを利用する"
date: "2023-11-10"
category: "環境設定"
tag:
  - 環境設定
  - Windows
  - DevDrive
  - npm cache
  - nuget cache
---

Windows11のvesrionを22H2に更新後、開発ドライブという機能が利用できるようになっていることを知りました。ドライブの作成と、利用に際しての設定を記録しておきます。

## 開発ドライブの作成

Microsoft Learnの[Windows 11でDev Driveを設定する](https://learn.microsoft.com/ja-jp/windows/dev-drive/)を読みながら進めました。作成方法が数パターンあるようなのですが、`%userprofile%\DevDrives`に仮想ディスクを作成する方法を選びました。

instructionに従って`設定`からボタンをポチポチするだけで完了します。わかりやすいようにドライブレターはDevelopmentの`D`にしました

## データの移動

開発ドライブ向けのデータはソースコード リポジトリやプロジェクト ファイル、パッケージキャッシュなどで、IDEやSDK、ビルドツールの格納は推奨されていないと記載されています。

Github repositoryは特に気にすることはなく、フォルダの移動だけで問題なさそうです。

パッケージキャッシュについては移動時に、それぞれのツールが参照しているキャッシュフォルダを変更する必要があります。私が主に利用しているのはnuget、npm、yarnです。

### nuget cache

nugetの現在のcacheフォルダは以下のコマンドから確認できました。

``` powershell
> dotnet nuget locals all --list
http-cache: %userprofile%\AppData\Local\NuGet\v3-cache
global-packages: %userprofile%\.nuget\packages\
temp: %userprofile%\AppData\Local\Temp\NuGetScratch
plugins-cache: %userprofile%\AppData\Local\NuGet\plugins-cache
```

コマンドを利用しての変更に手間取り、最終的にglobalのconfigファイル(`%appdata%\NuGet\NuGet.Config`)を直接修正しました

``` xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <!-- 以下のconfig要素を追記 -->
  <config>
    <add key="globalPackagesFolder" value="D:\nuget-cache" />
  </config>
  ...
</configuration>
```

### npm cache

npmの現在のcacheフォルダは以下のコマンドから確認できました。結果は`%userprofile%\AppData\Local\npm-cache`でした。

``` powershell
> npm config list -l
```

以下のコマンドを利用して、cacheフォルダを開発ドライブに変更しました。

``` powershell
> npm config set cache D:\npm-cache --global
```

### yarn cache

npmの現在のcacheフォルダは以下のコマンドから確認できました。結果は`%userprofile%\AppData\Local\Yarn\Cache\v6`でした。

``` powershell
> yarn cache dir
```

以下のコマンドを利用して、cacheフォルダを開発ドライブに変更しました。

``` powershell
> yarn config set cache-folder D:\yarn-cache
```

## 関連項目

- [(yarn) yarn cache](https://classic.yarnpkg.com/lang/en/docs/cli/cache/)
- [(Nuget) グローバル パッケージ、キャッシュ、および一時フォルダーを管理する](https://learn.microsoft.com/ja-jp/nuget/consume-packages/managing-the-global-packages-and-cache-folders)
