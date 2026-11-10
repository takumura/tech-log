---
created: 2026-10-26
updated: 2026-10-30
type: snapshot
category: article
tags:
  - activity
  - tech/scm/github
  - tech/obsidian
publish: "true"
---
# 🏃 活動概要
> [!ABSTRACT] Overview
> 自作Angular site（`takumura/tech-log`）をQuartzに置き換えました。選択したNoteのみを公開する方式を採用し、そのためのツール `publish-sync.mjs` をLocalLLMで作成・テストして動作確認を行いました。処理の詳細は [[Obsidian Quartz - publish-sync.mjs（publish flag copyによる選択公開）]]に、利用手順・テスト記録は [[Obsidian Quartz - publish-sync.mjs 利用リファレンス]] に分離しました。

## 🧩 詳細

### 決定した構成（設計）

| 項目           | 決定                                             | 根拠                                                                                                                                              |
| :----------- | :--------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| Pages source | main branch + GitHub Actions                   | submodule方式の場合、**.nojekyll問題**や**GITHUB_TOKENのトリガー問題**の対応が必要。main branch + GitHub Actions方式であればいずれの対応も不要になります。gh-pages branch deploy構成も不要になります。 |
| Branch       | mainで作業 > 動作確認後にdefault branchを切替え、他のbranchは削除 | `master`は旧defaultの名残。deploy.ymlのtriggerは `branches: - main` へ修正。                                                                                |
| 選択公開方式       | flag copy方式（`publish-sync.mjs`）                | submodule方式に必要なCI用PAT・二段push（submodule pointer commit）を消せます。repo上の内容がbuild対象となり、privateの内容がrepoに出ません。                                           |

- **.nojekyll問題**: branch deployはJekyll処理が入り、Quartz出力の"\_"始まりファイル（\_static等）がSKIPされます。deploy actionは .nojekyllを含める設定が必要。
- **GITHUB_TOKENのトリガー問題**: angular-cli-ghpagesのREADMEが指摘している通り、public repoではGITHUB_TOKENによるcommitではsiteが更新されないケースがあります（自分自身をトリガーできない制約）。submodule方式ならPAT（GH_TOKEN）push、あるいはPages API経由のdeploy actionで回避できます。

### 実施作業

- 環境確認: Node v26.7.0 / npm 11.19.0 / git 2.53.0 （Quartzの要件Nodejs > v22）。
- `takumura/tech-log` の確認: public repo、default branch = `master`、gh-pages branch deployで稼働中（HTTP 200）。Pages APIは404エラー（source未設定）。
- tech-logのmain branchへQuartz templateを展開。`npx quartz create`（Empty Quartz） > `npx quartz build --serve`でブランクページ表示まで確認。
- `publish-sync.mjs` をsynthetic vaultでテストし、次の挙動を実行出力で確認。
	- `publish: true` のnoteのみcontent/へcopy。
	- そのnoteが参照する画像のみcopy（basename first-match解決）。
	- 前回収めのstaleファイルの削除 （再実行で同じ結果）。
- 問題の発生と修正: Quartz側が管理するcontent直下の`index.md`（home page）をstale扱いで削除し、トップページが消えました。content直下をスクリプトの管理領域外とするよう修正し、テストを実施しました。
	- index.mdが削除されないことを確認。
	- stale削除が動くことを確認。
	- 再実行で同じ状態になることを確認。
- テスト済みスクリプトがrepo上のファイルと完全一致することをdiffチェックで確認し、live repoのcontent/が想定どおり（`index.md` + flag付きnoteのみ）であることを確認しました。

## 💡 振り返り / 次回へのアクション

- 判定基準（日付の信頼源、link解決の線引き、transclusionの扱い）はterm noteへ正本として一元化した > [[Obsidian Quartz - publish-sync.mjs（publish flag copyによる選択公開）]]。
- 次回へのアクション:
	- quartzで作成したページのレイアウトチェックとスタイル修正。
	- deploy.ymlのtriggerをmainへ修正し、first buildを走らせてからPages sourceをGitHub Actionsへ変更。順序が重要で先に切り替えると初回ビルド待ちで404になります。
	- `quartz.config.yaml`: `baseUrl`、`locale: ja-JP`、created/modifiedの日付はfrontmatterの値を優先してセットします。
	- default branch切替えとgh-pages/masterの削除は動作確認後に実施。
- 運用: 公開操作はflag設定 > `node publish-sync.mjs`（copy + `npx quartz sync`）。コミット・pushはLocal LLMではなく手動で実施します。

## 🔗 関連リンク

- [[Obsidian Quartz - publish-sync.mjs（publish flag copyによる選択公開）]]
- [[Obsidian Quartz - publish-sync.mjs 利用リファレンス]]

## 🔗 参考資料

- [Quartz Installation](https://quartz.jzhao.xyz/getting-started/installation#option-a-use-the-github-template-recommended)
- [Hosting](https://quartz.jzhao.xyz/hosting) 
- [ExplicitPublish plugin](https://quartz.jzhao.xyz/plugins/explicitpublish)
