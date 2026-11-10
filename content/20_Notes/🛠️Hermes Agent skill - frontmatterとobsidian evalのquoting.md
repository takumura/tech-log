---
created: 2026-10-08
updated: 2026-10-08
type: snapshot
category: article
tags:
  - troubleshooting
  - tech/obsidian
  - tech/ai/agent/hermes_agent
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> バックリンク検索の照査中に遭遇した2つの課題 "`skill_manage` の frontmatter"、"`obsidian eval` の quoting"の検証とその解決策を確認します。

## ❓ 問題 / 背景

### 1. `skill_manage(action='patch')` が frontmatter で拒否される

`obsidian-mcp` の SKILL.md に frontmatter が無く、patch が以下で失敗しました。既存スキルでも frontmatter 検証が適用され、**batch全体がロールバック**されます。

> [!failure]
> Patch would break SKILL.md structure: SKILL.md must start with YAML frontmatter (---)

### 2. `obsidian eval` の quoting が bash で壊れる

`code="..."` に `(` や `'` を含むJSを直接渡すと bash 側で構文エラー。

> [!failure]
> /usr/bin/bash: eval: line 5: syntax error near unexpected token `('

また heredoc 経由の multi-line JS は `(no output)` や `Unexpected end of input` を返すことがあります。exit code は 0 なので失敗の判定が難しいです。

## ✅ 対応策

### 1. frontmatter 付き rewrite

本文の変更は対象セクションのみとし、`skill_manage` の `patch` に frontmatter を含む全文を渡して rewrite しました。スキル作成時は frontmatter を最初から付けます。

### 2. IIFE + return 形式で渡す

```sh frame="none"
cd "$TMPDIR" && cat > q.js <<'EOF'
(function(){var mc=app.metadataCache;var t="20_Notes/SDelete.md";
var inb=Object.keys(mc.resolvedLinks||{}).filter(p=>(mc.resolvedLinks[p]||{})[t]);
return JSON.stringify({inbound:inb});})()
EOF
cmd /c obsidian eval code="$(cat q.js)"
```

- 単文（ワンライナー）なら `js('...')` 相当の短い code で十分。
- 結果は `=> {...}` 形式で返ります。`print()` ではなく `return` を使います。
- エラーでも処理継続するので、**同じ結果を CLI 側（`obsidian backlinks`）と突き合わせて確認**する必要があります。

## 🔗 関連リンク

- [[🏃Obsidianバックリンク検索方針の検討]]
- [[Obsidian バックリンク検索のツール選択]]
- [[metadataCache]]
