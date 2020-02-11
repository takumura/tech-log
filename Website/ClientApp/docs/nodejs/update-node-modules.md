---
title: "node_modulesを更新する"
date: "2020-02-09"
category: "Nodejs"
tag: ["npm", "Dependabot"]
---

Githubで管理している Node.jsアプリケーションで、依存packageのバージョンにセキュリティリスクがある場合に、Dependabotが警告してくれました。この警告を解消する手順を確認します。

## 警告の内容を確認

tech-logのリポジトリで、2020-02-09 時点で9件のSecurity Alertsがレポートされていました。

<img src="assets/images/update-node-modules/update-node-modules-1.png" alt="security alerts" title="security alerts">

いずれもpackage.lock.jsonに対しての変更が提案されており、間接的に依存している参照の更新が必要です。

## npm auditを確認

npmにも監査のコマンドがあったことを思い出し、状況を確認してみました。

```ps
> npm audit
...
found 625 vulnerabilities (2 low, 7 moderate, 615 high, 1 critical) in 42979 scanned packages
  run `npm audit fix` to fix 624 of them.
  1 vulnerability requires semver-major dependency updates.
```

625件。。。今後の課題にしようと思います。

## 個々のPRをnpm ciして確認

`npm ci`コマンドにより、pacakge.lock.json を元にnode_modulesを再構築してくれるようでした。なので「個々のPRに対してローカルリポジトリ上で`npm ci`し、appの挙動に問題がなければmasterへmergeする」という方法を試しました。

```ps
> npm ci
npm WARN prepare removing existing node_modules/ before installation
...
added 1199 packages in 135.974s
```

作業開始時にnode_modulesは削除されると公式サイトに書いてありましたが、実行時にも警告が表示されました。

vulnerabilitiesも着実に減少しました。

```ps
tar 適用時 = found 623 vulnerabilities (2 low, 7 moderate, 613 high, 1 critical) in 42979 scanned packages
fstream 適用時 = found 622 vulnerabilities (2 low, 7 moderate, 612 high, 1 critical) in 42979 scanned packages
js-yaml 適用時 = found 617 vulnerabilities (2 low, 4 moderate, 610 high, 1 critical) in 42979 scanned packages
handlebars 適用時 = found 616 vulnerabilities (2 low, 6 moderate, 608 high) in 42978 scanned packages
lodash 適用時 = found 588 vulnerabilities (2 low, 7 moderate, 578 high, 1 critical) in 42979 scanned packages
lodash.mergewith 適用時 = found 574 vulnerabilities (2 low, 3 moderate, 569 high) in 42978 scanned packages
mixin-deep 適用時 = found 387 vulnerabilities (2 low, 3 moderate, 382 high) in 42978 scanned packages
```

まだまだ多くの更新が残っていますが、以前気軽に`npm update`したら意図せずangularのバージョンが上がって酷い目にあったので、残りはAngularのアップグレード後に確認しようと思います。。

## 作業時に参照した情報

- [Configuring automated security updates](https://help.github.com/ja/github/managing-security-vulnerabilities/configuring-automated-security-updates)
- [npm-ci](https://docs.npmjs.com/cli/ci.html)
