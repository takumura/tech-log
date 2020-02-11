---
title: "Angularでgistを表示する"
date: "2019-11-14"
category: "Angular"
tag: ["gist", "embed", "PostScribe"]
---

[Angularで動的にHTMLタグをコンポーネントに埋め込む](docs/angular/angular-embed-html-tag){.internal-link}により、htmlを埋め込むことができたが、その中にscriptタグが含まれていた場合、表示させただけではscriptが実行されません。JQueryでいうところの`$()`に相当する、画面描画後にscriptを実行する処理が必要になります。

本tech-log内で、gistのembedを表示するのに本課題を対応する必要があり、解決方法を調査しました。

## PostScribeを利用する

非同期にscriptを実行し、結果をDOMに書き込む[PostScribe](https://krux.github.io/postscribe/)というライブラリを利用することで、gistのembedを実現しました。

**Markdownファイル(抜粋)**

```html
gistの表示デモ。class="gist"のdivでgistのembedスクリプトを囲います
<div class="gist">
  <script src="https://gist.github.com/takumura/bbff68078afb2d0846773965d1678c7c.js"></script>
</div>
```

**document.component.ts（抜粋）**

```ts
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import postscribe from 'postscribe';

@Component({
  selector: "app-document",
  templateUrl: "./document.component.html",
  styleUrls: ["./document.component.scss", "./vs2015.css"],
  animations: [defaultRouteAnimation],
})
export class DocumentComponent implements OnInit, OnDestroy, AfterViewInit {
  docInfo: DocumentInfo | null;
  isOpen: boolean = true;
  tocList: TocItem[] | null;

  // template html中の<div #mdContent>を参照するオブジェクトを定義
  @ViewChild("mdContent")
  mdRef: ElementRef<HTMLElement>;

  private fragment: string;
  private previousPath: string;
  private onDestroy = new Subject();
  private routeChangeSubject = new Subject();

  constructor(
    private markdownService: MarkdownService,
    private location: Location,
    private route: ActivatedRoute,
    private loadingBarService: LoadingBarService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    ...
    this.route.url.pipe(takeUntil(this.onDestroy)).subscribe(params => {
      const docRef = params.map(x => x.path).join("/");
      if (docRef !== this.previousPath) {
        this.docInfo = null;
        this.isOpen = false;
        this.getMarkdownDocInfo(docRef);
      } else {
        this.loadingBarService.hide();
      }
      this.previousPath = docRef;
    });
  }
  ...
  private getMarkdownDocInfo(docRef: string) {
    const path = this.location.normalize('assets/json/' + docRef + '.json');

    this.markdownService
      .getDocument(path)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        doc => {
          this.docInfo = doc;

          // detect change to update virtual DOM
          // and allow to access mdContentRef
          this.cdRef.detectChanges();
          this.mdContentRef.nativeElement.innerHTML = this.docInfo.bodyHtml;

          this.showGist();
          this.generateToc();
          this.routeChangeSubject.next();
        },
        err => console.error('MarkdownService', err),
      );
  }

  private showGist() {
    const gists = this.mdContentRef.nativeElement.querySelectorAll('div.gist');
    gists.forEach(gist => {
      postscribe(gist, gist.innerHTML);
    });
  }
  ...
}
```

`this.mdContentRef.nativeElement.innerHTML = this.docInfo.bodyHtml;`でhtmlをDOMに反映させた後で、`showGist()`関数を呼んでいます。

`showGist`関数では、`this.mdContentRef.nativeElement.querySelectorAll('div.gist')`で`gist`クラスを持つ`div`タグをリストアップし、発見したすべての`div`に対して`div.innerHTML`、すなわちembedのscriptを実行しています。

```ts
postscribe(
  gist,           // div.gistのtag。このdivの中にscript実行結果が書き込まれる。
  gist.innerHTML  // div.innerHTML = gistのembed script
);
```

## 関連項目

- [postscribe - Github](https://github.com/krux/postscribe)
- [VSCode: Settings Syncで環境設定を共有する](docs/env/vscode-settings-sync){.internal-link}
