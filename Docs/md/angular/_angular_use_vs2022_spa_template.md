---
title: ".NET 8の新しいSPAテンプレートでangular v17を利用する"
date: "2023-11-11"
category: "Angular"
tag:
  - angular
  - template
  - spaproxy
  - version up
---

[Angular v17のapplicationを開発する(準備作業)](doc/angular/angular_create_v17_project)<!--rehype:class=internal-link-->に続き、.NET 8の新しいSPAテンプレートを確認します。

以下の順番で確認していく予定です。

- angular v17のapp作成と動作確認
- .NET 8の新しいSPAテンプレートでangular v17を利用する **<- 今回はココ**
- 状態管理をngrxからsignalに変更する
- angularのprerenderingを試す
- ~~angular v17のlibraryを作成し、ブログページ用のcomponentをappから利用できるようにする~~

当初はlibraryプロジェクトの作成を実施予定でしたが、予想以上に難易度が高く挫折しました。いずれリベンジしたいです。


## .NET 8の新しいSPAテンプレートについて

linkを探す。

spa proxyを使っている

`dotnet run`を実行するとclient側プロジェクトの実行も開始されるので、実行が簡単になったと言える。

Vite早過ぎ問題？

## Markdown Website engineの移行

手順

- angular.jsonを比較、変更を適用。
- assetやcss等のリソースをコピーする
- package.jsonを比較、必要なpackageを一通りインストールする
- app.component以外のcomponentをコピーしてくる
- app.componentとmain.tsを変更

これだけで動くようになった。

### 課題

index.jsonをJSON.parse()するとエラーが出る。build systemがViteに変わったのが影響？index.jsonのロード時にprocess.env.NODE_ENVが`"development"`に置き換わり、未エスケープのダブルクォーテーションが問題を起こす。

angular-cli-ghpagesを使ったdeployがエラー。

[angular-cliのissue](https://github.com/angular/angular-cli/issues/26632)が挙がっていた。builderが`"@angular-devkit/build-angular:application`の時、output pathが`dist/[appname]/`から`dist/[appname]/browser`に変更されるためエラー。

次バージョンで挙動を変更できるようになる模様。[cc246d50eのコミット](https://github.com/angular/angular-cli/commit/cc246d50ea8d92289c8be8dc58b376358a899ad6)が含まれたバージョンがリリースされたら`@angular-devkit/build-angular`をアップデートする。
