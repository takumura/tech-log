---
created: 2025-01-25
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
> QNAPのQTSで、Music Stationを使用するための設定を確認します。

## 🧩 詳細

firmware: `QTS4`で確認。Music Stationを使用するには`Media Library`の機能を有効にする必要があります。index作成処理に非常に時間が掛かるため注意。index作成が完了すると、Web UIのMusic StationやmobileのQMusic appからmusic fileを再生します。

## 🧩 設定手順

App CenterからMusic Stationをinstallします。

Firmware update直後などで、Media Libraryのindex作成処理が実行されている場合は、sshでloginして以下のコマンドを実行し処理を停止します。

```console frame="none"
$ /etc/init.d/StartMediaService.sh stop
```

コントロールパネルの`メディアライブラリー` > `設定`にて`Media library`を有効にします。必要によりmedia folderを追加してください。共有folderがうまく作れない場合は、`/etc/config/smb.conf`を直接修正し、sambaをrestartします。

```console frame="none"
$ /etc/init.d/smb.sh restart
```

`Media library`のscan方法を指定します。長時間（数週間）CPUが100%に張り付く可能性があるので、実行時間を指定しておきます。また過去に中途半端な`Media library`が作成されていた場合は、`Media library`の再構築を実施します。実体は`/share/MD0_Data/.system`以下のfile群です。

> [!tips]
multimedia code pageの設定は、defaultでUnicodeとなります。iTunes11のdefaultはUnicodeなので、このままで問題ありません。それでも文字化けするものについては、ASCII to ISO Latin-1への変換を行います。
