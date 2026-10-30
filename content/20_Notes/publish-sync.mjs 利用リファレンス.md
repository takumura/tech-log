---
created: 2026-10-26
updated: 2026-10-30
type: evergreen
category: article
tags:
  - reference
  - tech/lang/javascript
  - tech/scm/github
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
>publish-sync.mjsの使い方に関する説明。処理詳細は[[publish-sync.mjs (publish flag copyによる選択公開)]]を参照。

## 🧩 実行方法

script`publish-sync.mjs`はtech-log repo直下に配置し、repo rootから実行する。`VAULT`（Obsidian vault path）と `CONTENT`（copy先）はスクリプト冒頭の定数。個人運用を前提に、スクリプト冒頭で固定値として書いている。

```sh frame="none"
node publish-sync.mjs --dry-run   # 計画とWarningのみ（copy・syncしない）
node publish-sync.mjs             # copy > npx quartz sync（commit + push）
node publish-sync.mjs --no-sync   # 人が確認してからsyncする
```

### 出力例

```sh frame="none"
publish:true notes: 1, copies: 2
copy 20_Notes\pub.md -> content\20_Notes\pub.md
copy 02_Assets\img.png -> content\02_Assets\img.png
WARN link to unflagged note: [[Secret]] <- 20_Notes\pub.md
```

## 🔗 関連リンク

- [[publish-sync.mjs (publish flag copyによる選択公開)]]
