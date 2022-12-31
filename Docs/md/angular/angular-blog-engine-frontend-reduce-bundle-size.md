---
title: "Angularで作成したmarkdownブログサイトのbundleサイズを削減する"
date: "2022-10-02"
category: "Angular"
tag:
  - angular
  - javascript
  - source-map-explorer
---

Angularでmarkdownデータを表示するブログサイトのようなものを作成しました。ドラフト版が完成しリリースビルドを生成したところ約2MBのサイズになり、生成処理中にサイズが大きいと怒られてしまいます。

リリースモジュールのbundle内訳を確認し、削減する方法を考えます。

## リリースbundleを分析する

生成したリリースbundleを分析するツールとしては`webpack-bundle-analyzer`が有名で、以前作成した旧バージョンのmarkdownブログサイトもこのツールで分析しました。ですが、Angularのbuildプロセスでは独自の最適化が施されており、`webpack-bundle-analyzer`では正しい分析ができなくなっているとのこと。

Angularチームではbundleの分析に[source-map-explorer](https://github.com/danvk/source-map-explorer)の使用を推奨しているようなので、今回はこの`source-map-explorer`ツールを使って分析してみます。

### 分析手順

source-map-explorerをdev dependencyに追加します。

``` powershell
> yarn add --dev source-map-explorer
```

次に`ng build`コマンドでリリースビルドを作成します。Angular 14では`prod`オプションはデフォルトでtrueのため指定は不要です。ですがsource mapの生成が必要だったため、`--source-map`オプションを指定しています。

``` powershell
>　yarn ng build --source-map
```

最後にpackage.jsonにsource-map-explorerコマンドを追加し、実行します。注意点として`dist/{project name}/main.*.js`のアスタリスクの部分はbuild毎に異なるので、実行する都度書き換えないといけません。

``` json
"scripts": {
    "ng": "ng",
    "start": "ng serve --ssl --ssl-cert %APPDATA%\\ASP.NET\\https\\%npm_package_name%.pem --ssl-key %APPDATA%\\ASP.NET\\https\\%npm_package_name%.key",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "prestart": "node aspnetcore-https",
    "lint": "ng lint",
    "deploy": "ng deploy",
    "source-map-explorer": "source-map-explorer ./dist/net6-markdown-web-engine/main.e156c1b9a1485b3e.js"
  },
```

``` powershell
> yarn run source-map-explorer
```

処理が正常に進むとブラウザが起動し、バンドル内で各モジュールが占める内訳の詳細が表示されました。

<img src="assets/images/angular-blog-engine-frontend-reduce-bundle-size/angular-blog-engine-frontend-reduce-bundle-size_1.png" alt="bundle analysis" title="bundle analysis">

この中で気になったのは33.8%(576.31KB)を占めるrefactorと1.7%(28.52KB)を占めるlunr/lunr.jsでした。

## rehype-prism-plusで利用するファイルフォーマットを限定する

[refactor](https://github.com/wooorm/refractor)モジュールは[rehype-prism-plus](https://github.com/timlrx/rehype-prism-plus)で利用されているcode highlightingのコアモジュールです。

angular側で`import rehypePrismPlus from 'rehype-prism-plus';`のように`rehype-prism-plus`を参照するとrefactorが参照するすべての言語定義が読み込まれます。そのため非常に巨大なbundleになっていました。当然すべての言語定義は必要ないので、利用している分だけを登録するように変更します。

[公式readme](https://github.com/timlrx/rehype-prism-plus#generating)を参考に、既存の記事で使用した9言語のみを読み込むように書き換えました。

``` ts
refractor.register(csharp);
refractor.register(css);
refractor.register(diff);
refractor.register(markup);
refractor.register(javascript);
refractor.register(json);
refractor.register(powershell);
refractor.register(typescript);
refractor.register(yaml);
const myPrismPlugin = rehypePrismGenerator(refractor);

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings)
  .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener'] })
  .use(rehypeAttrs, { properties: 'attr' })
  .use(myPrismPlugin, { showLineNumbers: true })
  .use(rehypeStringify);
const html = String(processor.processSync(document.content.body));
```

結果は576.31KB -> 27.68KBの大幅削減になりました。

<img src="assets/images/angular-blog-engine-frontend-reduce-bundle-size/angular-blog-engine-frontend-reduce-bundle-size_2.png" alt="bundle analysis" title="bundle analysis">

## 検索機能を簡易にする

登録している記事の検索については、今回の実装時にclient側での全文検索に取り組みました。日本語にも対応した全文検索のライブラリ [Lunr.js](https://lunrjs.com/)をangularで利用する方法について試行錯誤しながら実装を行いました。

Lunr.jsのtypescript対応が不十分なため、Angularコードから利用するのは単純ではありませんでした。

公式のLunr languageライブラリにある[Lunr.ja.js](https://github.com/MihaiValentin/lunr-languages/blob/master/lunr.ja.js)は、内部で使用している[tinysegmenter](https://github.com/SamuraiT/tinysegmenter)の依存がtypescriptのimport構文では解決できませんでした。

なので、tinysegmenterの実装を直接埋め込んだカスタムのLunr.ja.jsを作成して、それをimportすることで無理やり利用させていました。

``` ts
// markdown-document.reducer.ts

// create type JPlunr to use "ja" language feature
type Ilunr = (config: lunr.ConfigFunction) => lunr.Index;
type JPlunr = Ilunr & {
  ja: any;
};

// Setup Japanese support for lunr
ja(lunr);

export const lunrIndex = lunr((builder) => {
  builder.use((lunr as unknown as JPlunr).ja);
  builder.field('title', { extractor: (doc: {}) => (doc as DocumentRef).content.title });
  builder.field('category', { extractor: (doc: {}) => (doc as DocumentRef).content.category });
  builder.field('body', { extractor: (doc: {}) => (doc as DocumentRef).content.body });
  builder.ref('docRef');

  documents.forEach((doc) => {
    builder.add(doc);
  });
});
```

色々頑張って実装した割には、日本語と英語が混ざった検索などは思ったような結果が返ってきませんでした。。。ちょっとした文章管理で使う分には全文検索にこだわらず、`includes`や`indexOf`による検索でも十分なのかもしれません。

ということで、色々頑張ってみましたがLunr.jsの実装は全部削除して、javascriptの単純な文字列検索に切り替えます。googleでの検索では、結局`indexOf`が一番有名でパフォーマンスも安定しているようなので、これを採用することにしました。

Lunrを削除した結果はTotal1.13MB -> 1.07MBで、ほんの少しですが削減できました。

<img src="assets/images/angular-blog-engine-frontend-reduce-bundle-size/angular-blog-engine-frontend-reduce-bundle-size_3.png" alt="bundle analysis" title="bundle analysis">

## 関連項目

- [Angular CLI output - how to analyze bundle files | stack overflow](https://stackoverflow.com/questions/46567781/angular-cli-output-how-to-analyze-bundle-files)
- [Analyzing Angular bundle with Source Map Explorer](https://dev.to/salimchemes/analyzing-angular-bundle-with-source-map-explorer-341)
- [Supported languages - Prism](https://prismjs.com/#languages-list)
- [TypeScriptで全文検索を実行する – lunr編](https://wp-kyoto.net/lunr-search-by-typescript/#lunr-launguages%E3%81%8CTypeScript%E9%9D%9E%E5%AF%BE%E5%BF%9C%E3%81%AA%E3%81%AE%E3%81%A7%E5%8A%9B%E6%8A%80%E3%82%92%E4%BD%BF%E3%81%86)
- [Top 6 ways to search for a string in JavaScript — And performance benchmarks](https://koukia.ca/top-6-ways-to-search-for-a-string-in-javascript-and-performance-benchmarks-ce3e9b81ad31)
