---
created: 2013-08-24
updated: 2026-10-01
type: evergreen
category: article
tags:
  - reference
  - tech/nas/qnap
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> QNAPのQTSで、httpサービスをウォームアップするための定期ジョブを実行する設定を確認します。

## 🧩 詳細

firmware: `QTS 4.1.0`で確認。[[🗺️QNAP TS-239 Pro]]から[[Azure App Service]]にホストしているWebsiteへ定期的にアクセスして、サイトをウォームアップします。

## 🧩 設定手順

`コントロールパネル` > `Telnet / SSH`の画面から`SSH接続を許可する`のチェックを入れて`適用`ボタンを押下。
	![[20130824_crontab_01.jpg|700]]

ターミナルからQNAP TS-239 Proに接続し、viで`/etc/config/crontab`を編集します。
	![[20130824_crontab_02.jpg|500]]

以下の一文を最後の行に追加。

```sh frame="code" title="crontab"
*/5 * * * * wget -q --spider http://takumura-tech-memo.azurewebsites.net/doku.php >/dev/null 2>&1
```

  ![[20130824_crontab_03.jpg|600]]

crontabに先ほど編集したファイルを渡してcron処理の内容を設定。`/etc/init.d/crond.sh restart`でcronデーモンをリスタートして新しいcrontabを実行します。
	![[20130824_crontab_04.jpg|600]]

## 🔗 参考資料

- [Windows Azureで定期ジョブを実行する方法 - 蒼の王座](https://sqlazure.jp/b/windows-azure/1435/)
