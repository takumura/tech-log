---
created: 2026-11-01
updated: 2026-11-01
type: evergreen
category: article
tags:
  - reference
  - tech/obsidian
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> `npx quartz` のcli使用方法のリファレンスです。執筆しながらページを確認する際には development modeを使用します。公開の同期はCLIを直接実行するのではなく `publish-sync.mjs` 経由で行うので、syncを直接使う予定はありません。実行方法は[[Obsidian Quartz - publish-sync.mjs 利用リファレンス]]を参照してください。

## 🧩 詳細

### Development mode

`npx quartz build --serve` で local development server を起動し、ファイルが変わると自動で rebuild します。執筆しながらサイトの見た目を確認するのに使う、日常の中心となる操作です。

```sh frame="none"
npx quartz build --serve
```

`--serve` を使うと `--watch` も自動的に有効になります。ファイルの変更は `--wsPort`（既定3001）の WebSocket 接続経由でブラウザへ伝えられ、表示が自動で最新になります。この server は preview 専用で、production には向きません。

主要 flags:

| Flag | Shorthand | 説明 | 既定値 |
| --- | --- | --- | --- |
| `--directory` | `-d` | Quartz project が存在する directory | 現 directory |
| `--output` | `-o` | build 結果の出力先 | `public` |
| `--serve` | | development server の起動 | `false` |
| `--watch` | | 変更時の自動 rebuild | `false` |
| `--port` | | development server の port | 8080 |
| `--wsPort` | | hot reload の WebSocket port | 3001 |
| `--concurrency` | `-c` | build に使う worker thread 数 | CPU core数 |

`--watch` 単独では server が起動せず、rebuild だけ行われます。serving を別に用意して、自動 rebuild だけ欲しい CI などで使います。

```sh frame="none"
npx quartz build --serve --port 3000
npx quartz build --serve -c 2   # 大きなvaultではworker数を絞って実行するとメモリに余裕ができます
```

### 📌 Quick Reference

| Command | 目的 | 例 |
| --- | --- | --- |
| `create` | project の初期化（template 選択） | `npx quartz create` |
| `build` | static HTML の生成 | `npx quartz build` |
| `sync` | GitHub との同期 | `npx quartz sync` |
| `upgrade` | Quartz framework の更新（alias: `update`） | `npx quartz upgrade` |
| `restore` | content folder を local cache から復旧 | `npx quartz restore` |
| `plugin` | plugin の管理 | `npx quartz plugin list` |
| `tui` | interactive plugin manager | `npx quartz tui` |

全コマンド共通 flags:

| Flag | Shorthand | 説明 | 既定値 |
| --- | --- | --- | --- |
| `--directory` | `-d` | Quartz project が存在する directory | `content` |
| `--verbose` | `-v` | debug 用の詳細 log | `false` |
| `--concurrency` | `-c` | 並列 worker の上限（CPU core数） | CPU core数 |

並列処理をしない command にも `-c` を付けて問題ありません。単に無視されるだけです。

```sh frame="none"
npx quartz --help
npx quartz build --help
npx quartz --version
```

### 🧩 各コマンドの要点

- `create`: project を初期化し、設定template、base URL、Markdown の扱いを選択します。
	- Obsidian template は Obsidian Flavored Markdown（wikilink、callout等）を完全サポートし、link resolution は自動的に `shortest` に設定されます。
	- strategy は三つあります。既存vaultには原本に触れない `copy` が最も安全です。Obsidian での変更がそのまま反映される `symlink` は運用に便利です。
	- 例: `npx quartz create --template obsidian --strategy symlink --source <vault path>`
	- template の選択は必ず `quartz.config.yaml` を書き換え、適用後にtemplateが必要とするpluginのinstallまで自動で行います。
- `sync`: pull、add、commit、push の順で Git を操作し、GitHub と同期します。
	- 実際の運用ではこのcommandを直接実行しません。`publish-sync.mjs` 経由で実行します（[[Obsidian Quartz - publish-sync.mjs 利用リファレンス]]を参照）。
	- 内部で `git pull --rebase --autostash` を使う。unstaged 変更は一時退避されるが、競合時は標準の Git 工具で解決する。
- `plugin`: plugin管理の主commandです。pluginは `.quartz/plugins/` に保存され、versionは `quartz.lock.json` に記録されます。
	- subcommand: list、add、remove、install、enable、disable、config、prune。
	- `install --from-config` は `quartz.config.yaml` と照合し、足りないpluginをinstall、未参照のpluginをpruneします。`--dry-run` は変更なしで計画だけ見ます。
	- 指定したbranchは lockfile に記録されるので、以降の install はそのbranchを引き続けます。local directoryから追加したpluginはsymlinkなので、変更がすぐに反映されます。
	- 低 resource 環境で OOM や hang が出るなら `-c 1` に下げる。
- `upgrade`: upstream（`upstream/v5`）から framework を更新します。まずcontentをcacheにbackupしてからpullし、`npm install` とpluginの互換性確認まで行います。lockfileの競合は自動的に処理されますが、他のfileは自分で解決する必要があります。
- `restore`: content folder だけを local cache から復旧し、pluginや設定は対象になりません。upgradeの失敗、誤削除、merge競合を取り消したいときに使います。
- `tui`: terminal上のinteractiveな操作画面です。Bun runtime と TUI pluginが必要で、`npx quartz plugin add github:quartz-community/tui` で追加します。変更が `quartz.config.yaml` に直接書かれるため、使う前にGitの状態をcleanにしておくと安心です。

## 🔗 参考資料

- [[Obsidian Quartz - publish-sync.mjs 利用リファレンス]]（実行方法と出力例）
- [[Obsidian Quartz - publish-sync.mjs (publish flag copyによる選択公開)]]（処理詳細）
- 参照元: `D:\github-repos\tech-log\docs\cli`（vault外にはリンクできないためpath表記です。Quartz公式docsのローカルコピー）
