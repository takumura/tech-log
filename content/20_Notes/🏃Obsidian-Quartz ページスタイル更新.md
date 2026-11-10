---
created: 2026-11-01
updated: 2026-11-10
type: snapshot
category: article
tags:
  - activity
  - tech/scm/github
  - tech/obsidian
  - tech/web/design
publish: "true"
---
# 🏃 活動概要
> [!ABSTRACT] Overview
> Obsidian Quartzで作成したtech-logサイトのスタイル調整を行い、公開の準備をします。

## 🧩 詳細

サイトの基本設定やpluginの表示位置は`quartz.config.yaml`で設定します。サイトのデザインはcore pluginが内部で用意しているcssとscssファイルにて管理されています。

### quartz.config.yamlの修正

以下3点の修正を行いました。
- Webサイトのタイトル。
- `header`, `body`, `interface`, `code`のフォント。
- frontmatterの表示項目変更。

```yaml
# Webサイトのタイトルを変更
configuration:
  pageTitle: Free time Tech Log
...

# fontの設定
  - source: "@quartz-community/quartz-fonts"
    enabled: true
    options:
      fontOrigin: googleFonts
      header:
        name: Zen Kaku Gothic New
        weights: [400, 700]
      body: Noto Sans JP
      interface: Noto Sans JP
      code: JetBrains Mono
...

# frontmatter表示項目にtypeとcategoryを追加
  - source: "@quartz-community/note-properties"
    enabled: true
    options:
      includeAll: false
      includedProperties:
        - type
        - category
        - tags
        - aliases
...
```

### scssファイルの修正

`base.scss`、`callouts.scss`、`custom.scss`、`syntax.scss`、`variables.scss`の5ファイルが用意されています。最後に読み込まれる`custom.scss`で、既存スタイルを上書きしました。

レスポンシブデザインのbreakpoint調整のため、`variables.scss`の一行だけ修正しました。

```scss title="variables.scss"
// <抜粋>
$breakpoints: (
  mobile: 800px,
  desktop: 1400px, // modify original "desktop: 1200px" to adjust with extended center pane
);

```

ベースとなっているスタイルをclearせずに必要な部分だけ`custom.scss`で調整を実施。

```scss  title="custom.scss"
@use "./variables.scss" as *;

// put your custom CSS here!

// ============================================================================
// Color adjustments for light/dark modes
// ============================================================================
:root {
  --border-header-color: var(--lightgray);
}

.theme-light {

// 案1 春日大社 — 白白木・朱鳥居・黄金・若苔
  // --h1-color: #5f5788;
  // --h2-color: #a4453a;
  // --h3-color: #8a6d25;
  // --h4-color: #47694c;

  // --base-bg-color: #eaeee3;
  // --center-bg-color: #f1f2ec;
  // --code-bg-color: #e2e2d6;

// 案2 夢白銀 — 浅香・琥珀・紫・志摩川（正倉院宝物）
  --h1-color: #a1423f;
  --h2-color: #85651f;
  --h3-color: #67568c;
  --h4-color: #3f6b62;

  --base-bg-color: #ece9e2;
  --center-bg-color: #f4f1ea;
  --code-bg-color: #e6e2d8;
}

.theme-dark {
  --h1-color: #8a5ceb;
  --h2-color: #d19a66;
  --h3-color: #cec167;
  --h4-color: #98c379;

  --base-bg-color: #1c1c1c;
  --center-bg-color: #282828;
  --code-bg-color: #030303;
}

#quartz-root,
.page > div#quartz-body div.sidebar,
ul.explorer-ul {
  background-color: var(--base-bg-color);
}

#quartz-body,
.page > div#quartz-body div.center,
footer {
  background-color: var(--center-bg-color) !important;
}

& code {
  background-color: var(--code-bg-color) !important;
}



// ============================================================================
// Heading style adjustments
// ============================================================================
// adjust width and max-width to extend center pane
div#quartz-root.page div#quartz-body {
  @media all and ($desktop) {
    width: min(100%, calc(1400px + 300px)) !important;
    max-width: min(100%, calc(1400px + 300px)) !important;
  }
}

h1 {
  font-size: 2.25rem;

  &:not(.article-title) {
    border-bottom: solid 2px var(--h1-color);
  }
}

h2:not(.page-title) {
  font-size: 1.75rem;
  border-bottom: solid 2px var(--h2-color);
  border-image-slice: 1;
  border-image-source: linear-gradient(to right, var(--h2-color), var(--h2-color), var(--border-header-color), var(--border-header-color));
}

h3 {
  font-size: 1.5rem;
  border-bottom: solid 2px var(--h3-color);
  border-image-slice: 1;
  border-image-source: linear-gradient(to right, var(--h3-color), var(--border-header-color), var(--border-header-color), var(--border-header-color));
}

h4,
h5,
h6 {
  font-size: 1.25rem;
}

.page-listing .section-ul .section-li .section .desc h3 {
  border-bottom: initial;
  border-image-slice: initial;
  border-image-source: initial;
}



// ============================================================================
// Link style adjustments
// ============================================================================
div.center a,
div.preview-container a {
    text-decoration: underline !important;

  &.internal-link {
    background-color: initial;
  }

  &.internal {
    background-color: initial !important;
  }

  &:hover {
    background-color: var(--nav-item-background-hover);
  }
}

.page-listing .section-ul .section-li .section .tags li {
  background-color: initial;
}


// ============================================================================
// Bold style adjustments only for light/dark modes
// ============================================================================

.theme-dark strong {
  // color: #e06c75; // coral red
  // color: #4fc3d9; // cyan
  // color: #ffd166; // amber
  // color: #ff79c6; // magenta
  color: #3ddc97; // mint green
}

.theme-light strong {
  color: #147a55; // darkened mint — 5.01:1
}


// ============================================================================
// Callout style adjustments
// ============================================================================
.callout {
  border: 1px solid var(--callout-color);
  background-color: color-mix(in oklch, var(--callout-color) 14%, transparent);
  border-radius: 5px;

  & div.callout-content {
    margin-top: 8px;

    & p {
      margin-block-end: 4px;
    }
  }
}

.callout-icon {
  background-color: var(--callout-color) !important;
}



// ============================================================================
// Indent adjustments
// ============================================================================
div.center,
div.preview-container {
  & h4,
  & p:not(.callout-title-inner),
  & ul,
  & ol,
  & dl,
  & table {
    margin-left: 1rem;
  }

  & blockquote {
    margin-left: 1rem;
    padding: 16px;
  }

  & .callout-title-inner p {
    margin-left: 0.25rem;
  }

  .note-properties-tags {
    & a {
      padding-left: 0;
      padding-right: 0;
    }

    & span.note-properties-separator {
      margin-right: 0.25rem;
    }
  }
}

// TOC plugin - indent for H4 internal links
ul.toc-content .depth-2 {
  margin-left: 1.5rem;
}



// ============================================================================
// Vertical margin adjustments
// ============================================================================
h1, h2 {
  margin-top: 2rem;
}

h3 {
  margin-top: 1.5rem;
}

div.left,
div.right {
  padding-top: 48px;
}

div.page-header {
  margin-top: 56px;
}



// ============================================================================
// Pre / Code style adjustments
// ============================================================================
div.center figure,
div.preview-container figure {
  & > figcaption {
    padding: 0 16px 4px 16px;
    margin-left: 16px;
    background-color: var(--code-bg-color);
    border-bottom: 1px solid var(--h2-color);
  }

  pre {
    margin-top: 0px;
    padding-top: 0px;
  }
}


// ============================================================================
// Plugin style adjustments
// ============================================================================
// Explorer plugin
// title button size - need to set 1rem for showing title when closing.
button.title-button {
  & > h2 {
    font-size: 1rem;
    width: 120px;
    margin-top: 0; // revert the vertical margin adjustments for h2
  }
}

// Explorer plugin
// list item font size
div.folder-outer > ul > li > a {
  font-size: 0.8rem;
}

// TOC plugin
// title button size - need to set 1rem for showing title when closing.
button.toc-header {
  & > h3 {
    font-size: 1rem;
    width: 200px;
    margin-top: 0;
    margin-bottom: 0;
  }
}

// TOC plugin
ul.toc-content {
  & > li {
    &:hover {
      background-color: var(--nav-item-background-hover);
    }

    & a {
      font-size: 0.8rem;
    }
  }
}

// Graph plugin
.graph {
  & > h3 {
    font-size: 1rem;
  }

  // graph size and border
  & .graph-outer {
    padding: 4px;
    width: 240px !important;
    height: 240px !important;
    // border: 1px solid var(--h3-color) !important;
    border: 1px solid var(--nav-item-background-hover) !important;

    & .graph-container canvas {
      width: 220px !important;
      height: 220px !important;
    }
  }
}

// Backlink plugin
div.backlinks {
  padding: 0;

  & > h3 {
    font-size: 1rem;
  }

  & > ul > li {
    &:hover {
      background-color: var(--nav-item-background-hover);
    }

    & > a {
      font-size: 0.8rem;
      color: var(--nav-item-color);
    }
  }
}

// ============================================================================
// Search style adjustments
// ============================================================================
.search > .search-container 
{
  & > .search-space > :not(.ghost-text):not(.tag-suggestions) {
    background: var(--light);
    border-radius: 7px;
    width: 100%;
    margin-bottom: 2em;
    box-shadow: 0 14px 50px #1b21301f,0 10px 30px #1b213029
  }

  & .search-layout {
    border: 1px solid var(--lightgray);
  }

  & .results-container {
    & a {
      padding-left: 16px;
      border-bottom: 1px solid var(--lightgray);

      &:hover {
        background-color: var(--nav-item-background-hover);
      }

      & > h3 {
        font-size: 1rem;
        color: var(--nav-item-color);
        border-bottom: initial;
      }
    }
  }
}
```

## 💡 振り返り / 次回へのアクション

久しぶりのスタイル調整で、必要なパーツのスタイルをピンポイントで調整することが出来なかったりして作業に4時間位を要しました。最終的には納得できるものになりました。

基本のダークテーマはObsidianのMinimal - atom調だったので、ほぼそのまま採用。calloutのデザイン調整に一番時間が掛かりました。Obsidian Editorでは実現できなかった段落`p`の字下げができたので、Webの方がむしろ見やすいです。

ライトテーマはQwen3.8FNにお願いして奈良をイメージしたテーマを用意してもらいました。結果かなり気に入りました。

## 🔗 関連リンク

- [[🏃Obsidian-Quartzへのtech-logサイト移行（選択公開運用の設計）]]

## 🔗 参考資料

- [Welcome to Quartz 5](https://quartz.jzhao.xyz/)
- [WEB色見本](https://www.colordic.org/)
