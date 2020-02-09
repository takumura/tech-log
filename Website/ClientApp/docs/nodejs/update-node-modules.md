---
title: "node_modulesを更新する"
date: "2020-02-09"
category: "Nodejs"
tag: ["npm", "Dependabot"]
---

Github で管理している Node.js アプリケーションで、依存 package のバージョンにセキュリティリスクがある場合に、Dependabot が警告してくれました。この警告を解消する手順を確認します。

## 警告の内容を確認

tech-log のリポジトリで、2020-02-09 時点で 9 件の Security Alerts がレポートされていました。

<img src="" alt="security alerts" title="security alerts">

いずれも package.lock.json に対して変更行われており、間接的に依存している参照の更新が必要です。

## npm audit を確認

npm にも監査のコマンドがあったことを思い出し、状況を確認してみました。

```ps
> npm audit
...
found 625 vulnerabilities (2 low, 7 moderate, 615 high, 1 critical) in 42979 scanned packages
  run `npm audit fix` to fix 624 of them.
  1 vulnerability requires semver-major dependency updates.
```

625 件。。。今後の課題にしようと思います。

## 個々の PR を npm ci して確認

`npm ci`コマンドにより、pacakge.lock.json を元に node_modules を再構築してくれるようでした。なので「個々の PR に対してローカルリポジトリ上で`npm ci`し、app の挙動に問題がなければ master へ merge する」という方法を試しました。

```ps
> npm ci
npm WARN prepare removing existing node_modules/ before installation
...
added 1199 packages in 135.974s
```

作業開始時に node_modules は削除されると公式サイトに書いてありましたが、実行時にも警告が表示されました。

vulnerabilities も着実に減少しました。

```ps
tar 適用時 = found 623 vulnerabilities (2 low, 7 moderate, 613 high, 1 critical) in 42979 scanned packages
fstream 適用時 = found 622 vulnerabilities (2 low, 7 moderate, 612 high, 1 critical) in 42979 scanned packages
js-yaml 適用時 = found 617 vulnerabilities (2 low, 4 moderate, 610 high, 1 critical) in 42979 scanned packages
handlebars 適用時 = found 616 vulnerabilities (2 low, 6 moderate, 608 high) in 42978 scanned packages
lodash 適用時 = found 588 vulnerabilities (2 low, 7 moderate, 578 high, 1 critical) in 42979 scanned packages
```

残りは Angular のアップグレード後に確認しようと思いました。

## 関連項目

- [Configuring automated security updates](https://help.github.com/ja/github/managing-security-vulnerabilities/configuring-automated-security-updates)
- [npm-ci](https://docs.npmjs.com/cli/ci.html)
