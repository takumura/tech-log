---
created: 2025-05-14
updated: 2026-08-30
type: evergreen
category: article
tags:
  - reference
  - tech/obsidian
publish: "true"
---
# 🔍 概要
> [!ABSTRACT] Overview
> Obsidian の外観（Theme）をシンプルかつ洗練されたものにするために、**Minimal Theme**および関連プラグインを用いて行ったカスタマイズに関するリファレンスです。

## 🎨 テーマ

[Minimal](https://github.com/kepano/obsidian-minimal) を使用して、ミニマルで美しいインターフェースを実現しています。

### インストール手順

1. `Appearance` > `Themes` を開く。
2. `Manage` から **Minimal** を選択し、インストール・適用します。

## 🛠️ Custom Settings

### 基本外観

- **Accent color**: `#8A5CDC`

### CSSスニペット - custom-header

ヘッダー（H1, H2, H3）のスタイル調整のため`custom-header.css`を作成し、`.obsidian\snippets`以下に配置。

```css frame="code" title="custom-header.css"
body {
  --border-header-color: var(--background-primary, black);
}

h1,
.HyperMD-header-1 {
  border-bottom: solid 2px var(--h1-color);
}

h2,
.HyperMD-header-2 {
  border-bottom: solid 2px var(--h2-color);
  border-image-slice: 1;
  border-image-source: linear-gradient(to right, var(--h2-color), var(--h2-color), var(--border-header-color), var(--border-header-color));
}

h3,
.HyperMD-header-3 {
  border-bottom: solid 2px var(--h3-color);
  border-image-slice: 1;
  border-image-source: linear-gradient(to right, var(--h3-color), var(--border-header-color), var(--border-header-color), var(--border-header-color));
}

```

### CSSスニペット - custom-callout

コールアウトのスタイル調整のため`compact-callout.css`を作成し、`.obsidian\snippets`以下に配置。

```css frame="code" title="compact-callout.css"
.callout {
    padding-top: 0.5em !important;
    padding-bottom: 0.8em !important;
    padding-left: 1em !important;
    margin-top: 0.5em !important;
}

.callout-title {
    margin-top: 0.5em !important;
}

.callout-content p {
    margin-top: 0.2em !important;
    margin-bottom: 0.2em !important;
    margin-left: 1.0em !important;
}
```

### CSSスニペット - custom-hr

水平線（hr）のスタイル調整のため`custom-hr.css`を作成し、`.obsidian\snippets`以下に配置。

```css frame="code" title="custom-hr.css"
/* Margin adjustments */
.markdown-source-view.mod-cm6 hr {
  margin-block-start: 0.8em;
  margin-block-end: 0.2em;
}
.markdown-preview-view hr {
  margin-block-start: 2em;
  margin-block-end: 1.2em;
}

/* Common hr styles for both markdown views */
.markdown-source-view.mod-cm6 hr,
.markdown-preview-view hr {
  position: relative;
  overflow: initial;
  border: none;
  height: 1px;
  border-bottom: 1px solid;
  border-image-slice: 1;
  border-width: 2px;
  border-image-source: linear-gradient(to right,  
    transparent 0%,
    #9884e4 16%,
    #713DDC 46%,
    transparent 48%,  /* Center fully transparent */
    transparent 52%,  /* Center fully transparent */
    #713DDC 54%, 
    #9884e4 84%,
    transparent 100%);
}

/* Common hr::after styles for both markdown views */
.markdown-source-view.mod-cm6 hr::after,
.markdown-preview-view hr::after {
  content: '✧';
  display: inline-block;
  font-size: 1.4rem;
  border-width: 2px;
  position: absolute;
  color: #8A5CDC !important;
  left: 50%;
  transform: translate(-50%, -50%);

  /* ✨ Add neon effect */
  text-shadow:  
    0 0 3px #8A5CDC,  /* Very small glow */
    0 0 6px #8A6BDC,  /* Moderate glow */
    0 0 12px #8A32DC; /* Softly diffused glow */
}
```

### Minimal Theme Settings (Plugin)

UIの細かな調整のために [Minimal Theme Settings](https://github.com/kepano/obsidian-minimal-settings) プラグインを使用。

> [!TIP] 現在の設定
>  **Dark mode color scheme**: `atom`
>  **Colorful active states**: `On`
>  **Colorful headings**: `On`

### Style Settings (Plugin)

ヘッダーのスタイル（サイズ・カラー）を詳細に制御するために [Style Settings](https://github.com/mgmeyers/obsidian-style-settings) プラグインを使用。
- コミュニティプラグイン: `Style Settings`の設定画面で、`Minimal` > `Headdings` より H1, H2, H3 の設定を変更。

設定内容のエクスポートより変更点を確認。

```json
{
  "minimal-style@@h1-size": "1.9em",
  "minimal-style@@h1-color@@dark": "#8A5CEB",
  "minimal-style@@h1-color@@light": "#8A5CEB",
  "minimal-style@@h2-size": "1.5em",
  "minimal-style@@h3-size": "1.2em",
  "minimal-style@@bold-color@@dark": "#62AFEF"
}
```

## 🔗 参考情報

- [Minimal Documentation](https://minimal.guide/home)
- [Just Sharing a Small CSS Tweak for Horizontal Rule - reddit](https://www.reddit.com/r/ObsidianMD/comments/1j07gj5/just_sharing_a_small_css_tweak_for_horizontal_rule/?show=original)
