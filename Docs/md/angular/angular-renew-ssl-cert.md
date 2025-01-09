---
title: 'Angularでng servのssl certを更新する'
date: '2025-01-09'
category: 'Angular'
tag:
- angular
- certification
- ssl
---

一年以上前にASP.NET coreのAngular templateを利用したプロジェクトで開発をしていました。久しぶりにそのプロジェクトの動作確認をしていて、デバッグ実行時に`ng serve`をsslオプションで実行しているのに`SSL証明書が安全でない`と表示されることに気が付きました。証明書を確認すると有効期限が切れていました。証明書の更新方法を調べます。

## 対応方法

package.jsonからsslオプションの記述を確認。ASP.NET CoreのAngular templateを利用して作成しており、ssl証明書のpathは`%APPDATA%\\ASP.NET\\https\\`となっていました。

``` json
"scripts": {
  ...
  "start": "ng serve --ssl --ssl-cert %APPDATA%\\ASP.NET\\https\\%npm_package_name%.pem --ssl-key %APPDATA%\\ASP.NET\\https\\%npm_package_name%.key",
  ...
}
```

該当pathには`%npm_package_name%`、すなわちpackage.jsonに記載した`name`fieldを利用して、`{name}.pem`と`{name}.key`とのファイルが二つ作成されていました。これらを削除して、`yarn start`を実行すると、ssl証明書が再作成されました。

有効期限は1年に設定されているので、来年になったらまた同じ手順でssl証明書の再作成が必要です。

また、再作成したlocalhost ssl証明書を使用しても警告が消えない場合があります。その時は`CertMgr.msc`から`信頼されたルート証明機関`に再作成したlocalhost ssl証明書が存在しているか確認します。もし存在しない、または古いlocalhost ssl証明書しかない場合は、再作成した証明書を手動で登録する事でエラーが解消します。

## ssl証明書の再作成処理について

ASP.NET CoreのAngular templateの中に`aspnetcore-https.js`が含まれており、この中で`dotnet`コマンドを使ったssl自己証明書の作成を行っていました。

``` typescript
// This script sets up HTTPS for the application using the ASP.NET Core HTTPS certificate
const fs = require('fs');
const spawn = require('child_process').spawn;
const path = require('path');

const baseFolder =
  process.env.APPDATA !== undefined && process.env.APPDATA !== ''
    ? `${process.env.APPDATA}/ASP.NET/https`
    : `${process.env.HOME}/.aspnet/https`;

const certificateArg = process.argv.map(arg => arg.match(/--name=(?<value>.+)/i)).filter(Boolean)[0];
const certificateName = certificateArg ? certificateArg.groups.value : process.env.npm_package_name;

if (!certificateName) {
  console.error('Invalid certificate name. Run this script in the context of an npm/yarn script or pass --name=<<app>> explicitly.')
  process.exit(-1);
}

const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
  spawn('dotnet', [
    'dev-certs',
    'https',
    '--export-path',
    certFilePath,
    '--format',
    'Pem',
    '--no-password',
  ], { stdio: 'inherit', })
  .on('exit', (code) => process.exit(code));
}
```

pacakge.jsonのscriptの中で`prestart`を定義することで、`yarn start`実行時にhookして`aspnetcore-https.js`をcallするという処理の流れになっていることを確認しました。

``` json
"scripts": {
  ...
  "prestart": "node aspnetcore-https",
  ...
},
```
