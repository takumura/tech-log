---
created: 2023-11-10
updated: 2023-11-10
type: evergreen
category: article
tags:
  - reference
  - tech/windows
  - tech/setup
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> Windows11のversionを22H2に更新後、Dev Driveという機能が利用できるようになっていることを知りました。ドライブの作成と、利用に際しての設定を記録しておきます。

## 🧩 Dev Driveの作成

Microsoft Learnの[Windows 11でDev Driveを設定する](https://learn.microsoft.com/ja-jp/windows/dev-drive/)を読みながら進めました。作成方法が数パターンあるようなのですが、`%userprofile%\DevDrives`に仮想ディスクを作成する方法を選びました。

~~instructionに従って`設定`からボタンをポチポチするだけで完了します。わかりやすいようにドライブレターはDevelopmentの`D`にしました。~~

> [!tip]
> 設定からDev Driveを作成した場合、ブロックサイズが32MBで作成されてしまい、動的拡張設定のVHDXを指定した場合に、shrinkが効きにくくなる課題が発生。[Dev Drive/WSLのVHDXが縮まない原因はBlockSizeとrobocopyだった](https://zenn.dev/ichikawa_y/articles/devdrive-vhdx-block-size)を参考にして作成方法を変更しました。

```sh frame="none"
# 1. カスタムBlockSizeでVHD作成（ディスクサイズ: 動的拡張128GB, ブロックサイズ:1MB）
New-VHD -Path "C:\Users\picas\DevDrives\DevDrive_new.vhdx" -SizeBytes 137438953472 -Dynamic -BlockSizeBytes 1MB -LogicalSectorSizeBytes 512 -PhysicalSectorSizeBytes 4096

# 2. マウント・初期化・一時ドライブレター:Tでパーティション作成
$disk = Mount-VHD -Path "C:\Users\picas\DevDrives\DevDrive_new.vhdx" -Passthru | Get-Disk
Initialize-Disk -Number $disk.Number -PartitionStyle GPT
New-Partition -DiskNumber $disk.Number -DriveLetter T -UseMaximumSize

# 3. Dev Driveとしてフォーマット
Format-Volume -DriveLetter T -DevDrive -NewFileSystemLabel "DevDrive" -Confirm:$false
fsutil devdrv trust T:
```

## 🧩 データの移動

Dev Drive向けのデータはソースコード リポジトリやプロジェクト ファイル、パッケージキャッシュなどで、IDEやSDK、ビルドツールの格納は推奨されていないと記載されています。

Github repositoryは特に気にすることはなく、フォルダの移動だけで問題なさそうです。

パッケージキャッシュについては移動時に、それぞれのツールが参照しているキャッシュフォルダを変更する必要があります。私が主に利用しているのはnuget、npm、yarnです。

### 🧩 nuget cache

nugetの現在のcacheフォルダは以下のコマンドから確認できました。

```sh frame="none"
> dotnet nuget locals all --list
http-cache: %userprofile%\AppData\Local\NuGet\v3-cache
global-packages: %userprofile%\.nuget\packages\
temp: %userprofile%\AppData\Local\Temp\NuGetScratch
plugins-cache: %userprofile%\AppData\Local\NuGet\plugins-cache
```

コマンドを利用しての変更に手間取り、最終的にglobalのconfigファイル(`%appdata%\NuGet\NuGet.Config`)を直接修正しました。

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <!-- 以下のconfig要素を追記 -->
  <config>
    <add key="globalPackagesFolder" value="D:\nuget-cache" />
  </config>
  ...
</configuration>
```

### 🧩 npm cache

npmの現在のcacheフォルダは以下のコマンドから確認できました。結果は`%userprofile%\AppData\Local\npm-cache`でした。

```sh frame="none"
> npm config list -l
```

以下のコマンドを利用して、cacheフォルダを開発ドライブに変更しました。

```sh frame="none"
> npm config set cache D:\npm-cache --global
```

### 🧩 yarn cache

yarnの現在のcacheフォルダは以下のコマンドから確認できました。結果は`%userprofile%\AppData\Local\Yarn\Cache\v6`でした。

```sh frame="none"
> yarn cache dir
```

以下のコマンドを利用して、cacheフォルダを開発ドライブに変更しました。

```sh frame="none"
> yarn config set cache-folder D:\yarn-cache
```

## 🔗 参考資料

- [(yarn) yarn cache](https://classic.yarnpkg.com/lang/en/docs/cli/cache/)
- [(Nuget) グローバル パッケージ、キャッシュ、および一時フォルダーを管理する](https://learn.microsoft.com/ja-jp/nuget/consume-packages/managing-the-global-packages-and-cache-folders)
