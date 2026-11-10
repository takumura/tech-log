---
created: 2026-10-26
updated: 2026-10-30
type: evergreen
category: atomic
tags:
  - term
  - tech/lang/javascript
  - tech/obsidian
publish: "true"
---
# 📌 定義
> [!NOTE] Definition
> Obsidian vaultのnoteのうち、frontmatterに `publish: true` を持つファイルだけをQuartzの `content/` へcopyし、そのファイル集合がそのままビルド対象、つまり**repo上の内容を選んでcopyする**方式。公開すると決めたものだけがpublic repoに載り、それ以外のprivateな内容はrepoに掲載されません。

## 🧩 詳細

処理は4段で構成されます。
1. **frontmatterを解析**: ファイル冒頭の `---` blockだけを対象に `publish: true` を判定します。code fence内や本文の表記は誤検出しません。
2. **copy計画の組み立て**: flag付きnoteと、そのnoteが参照する画像ファイル（`![[...]]` をObsidianと同じbasename first-match解決で追跡）。
3. **管理領域を分ける**: `content/` 直下はQuartz-managed領域（home pageの `index.md` など）とし、スクリプトの管理外に置く。copy先（サブディレクトリ下）のみ管理領域。
4. **古くなったファイルを消してからcopy**: 管理領域では今回收められたファイル以外は削除します。再実行で同じ状態になります。

**警告の表示**: unflagged noteへのwikilink、解決できないasset参照、text transclusionを個別に通知します。機械で判定できるが、公開pageのlink先はflag付きnoteに揃える運用とします。

## 🧩 判定基準

- **日付の信頼源**: copy方式ではcontent/のgit historyがvault historyを引き継ぎません。CI buildではファイルmtimeがcheckout時刻になるため、created/modifiedはfrontmatterをgitより優先します（copyでもfrontmatterはそのまま残る）。
- **link解決の線引き**: unflagged noteへのwikilinkはbuildで解決できずplain text表示になります。graph viewやbacklinksで結ばれるのは公開page同士だけ（private noteは公開されないから、狙いどおり）。
- **transclusion**: 画像embedはhost noteのflagで足りるが、text transclusion `![[note]]` は target の flag が必須。
- **privateの線引き**: buildで非表示にするのではなく、repoに送ります。public repoでもflag付きファイルだけが掲載されます。

## 🧩 検討した代替案 / この方式を選んだ理由

| 方式                                                         | 露出                                     | 運用コスト                                                            | 判断                                                  |
| :--------------------------------------------------------- | :------------------------------------- | :--------------------------------------------------------------- | :-------------------------------------------------- |
| ExplicitPublish filter<br>（full vault sync + build時filter） | flagなしがpushで露出（public repo）            | filter plugin                                                    | repo内容とbuild対象が一致しない矛盾が残ります（docsの警告）。               |
| submodule<br>（Quartz推奨のcontent as vault）                   | submodule pointerのみ<br>private内容は露出しない | CIのprivate checkoutにPAT、publishの二段push（submodule pointer commit） | privacyは保てるが操作が増えます。                                |
| **flag copy（採用した方式）**                                      | flag付きファイルのみ                           | なし                                                               | repoの内容とbuild対象が一致し、filterそのものが不要になります。余計な操作が要りません。 |

**作り直さずに済む**、**運用をシンプルに保てる**、**privateが守れる**、この三つのバランスで採用しました。Quartzの既存workflow: `npx quartz sync`、`GitHub Actions deploy`でそのまま運用できます。

## 🧩 config設定

- `.gitignore`: Quartz版へ更新。`public/`、`node_modules`除外。
- `quartz.config.yaml`: `baseUrl`、`locale: ja-JP`、date priorityは `[frontmatter, git]`。
- `.base`、`00_Trash`、`01_Rules` はcopy対象外。スクリプト側の固定値で設定。
- ExplicitPublish pluginは不要。
	- build対象は`publish=true`と判定済みのcontent。enabledのままでも動くが、flag filterが二重に掛かってしまいます。

## 🧩 動作確認（2026-10-26、synthetic vaultで実測）

- flag付きnoteのcopy、参照画像のcopy、stale削除、再実行で再現を確認。
- content直下の `index.md` （Quartz-managed領域）は削除しない: root protection。

Live repo（`D:\github-repos\tech-log`）では、repo上のファイルがテスト済みスクリプトと完全一致することを確認。content/直下が `index.md` + flag付きnoteのcopyのみで構成されることをliveで確認。

## 🧩 制限

- pathが個人運用前提の定数。他の環境へ移す場合は変更が必要。
- basename first-match: 同名ファイルは走査順のfirst matchで解決。同名ファイルの衝突は検出しません。
- `![[folder/file.png]]` のpath指定embedは解決しません。basename参照のみ。
- frontmatter解析はファイル冒頭の `---` block限定。冒頭以外に `---` blockを持つファイルは解析対象になりません。

## 🔗 関連リンク

- [[🏃Obsidian-Quartzへのtech-logサイト移行（選択公開運用の設計）]]
- [[Obsidian Quartz - publish-sync.mjs 利用リファレンス]]
