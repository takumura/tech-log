---
title: "Angularで動的にHTMLタグをコンポーネントに埋め込む"
date: "2019-11-14"
category: "Angular"
tag:
  - angular
  - html
  - embed
---

Angularでは、データバインドを利用したテキストの埋め込み時にセキュリティ上の考慮がなされています。具体的には、scriptやhtmlは自動的にエスケープ処理され、原則的にはhtmlタグを埋め込めないようになっています。

Angularで、markdownから生成したhtmlをタグとして画面に挿入する方法を調査しました。

## 注意点

開発者は、**有害なhtmlデータ**がこれらの処理を通してユーザに送信されないよう、十分に考慮する必要があります。

## SafeHtml型のhtmlデータを[innerHTML]にバインドする

実装例を以下に示します。

**MarkdownService**

```ts
export class MarkdownService {
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    @Inject("BASE_URL") private baseUrl: string,
  ) {}

  getDocument(path: string): Observable<DocumentInfo> {
    let docInfo: DocumentInfo;
    const processor = unified()
      .use(markdown, { commonmark: true })
      .use(remarkAttr)
      .use(remarkRehype, { allowDangerousHTML: true })
      .use(raw)
      .use(slug)
      .use(autoLinkHeadings)
      .use(highlight)
      .use(html);

    return this.http.get<DocumentInfo>(this.baseUrl + path).pipe(
      map(result => {
        // this.baseUrl + pathにアクセスすると、docInfo型のデータがjsonで取得できる。それをそのまま代入。
        docInfo = result;

        // set default toc
        if (!docInfo.toc) {
          docInfo.toc = "h2,h3";
        }

        // docInfo.bodyはmarkdown形式のデータ。processor.processSync処理でhtmlに変換される
        docInfo.bodyHtml = processor.processSync(docInfo.body).contents;

        // bypassSecurityTrustHtmlはhtmlデータをSafeHTMLという特別な型に変換する
        docInfo.safeBody = this.sanitizer.bypassSecurityTrustHtml(docInfo.bodyHtml);
        return docInfo;
      }),
    );
  }
  ...
}
```

**document.component.html(抜粋)**

```html
<div fxFlex class="doc-body" [innerHTML]="docInfo?.bodyHtml" appRouteTransformer>
```

または

```html
<div fxFlex class="doc-body" [innerHTML]="docInfo?.safeBody" appRouteTransformer>
```

通常のhtmlデータ(docInfo.bodyHtml)をinnerHTMLにバインドした場合、idやスタイルなどの属性は自動的に取り除かれてしまいます。またブラウザのコンソール上に**安全でないhtmlデータがバインドされた**という警告が表示されます。

DomSanitizer.bypassSecurityTrustHtmlを利用すると、htmlデータはSafeHTML型に変換され、Angularはこのデータを無害なhtmlデータとして取り扱います。つまりすべてそのままの状態でバインドされます。

## ElementRef.nativeElementにバインドする

実装例を以下に示します。

**document.component.html(抜粋)**

```html
<div fxLayout="column" class="doc-container" [@openClose]="isOpen ? 'open' : 'closed'">
  <!-- <p *ngIf="!docInfo">loading...</p> -->
  <ng-container *ngIf="docInfo && docInfo?.toc === 'none'">
    ...
  </ng-container>
  <ng-container *ngIf="docInfo && docInfo?.toc !== 'none'">
    <div fxLayout="row">
      <div fxFlex="1 1 85%" fxFlex.lt-md="1 1 100%">
        <div fxLayout="column">
          ...
          <!-- <div fxFlex class="doc-body" [innerHTML]="docInfo?.safeBody" appRouteTransformer></div> -->
          <div #mdContent fxFlex class="doc-body" appRouteTransformer></div>
        </div>
      </div>
      <div fxFlex="1 1 15%" fxHide.lt-md>
        <app-document-toc [tocList]="tocList" appRouteTransformer></app-document-toc>
      </div>
    </div>
  </ng-container>
</div>
```

**document.component.ts**

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
    const path = this.location.normalize("assets/json/" + docRef + ".json");

    this.markdownService
      .getDocument(path)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        doc => {
          this.docInfo = doc;

          // 初期画面は<ng-container *ngIf="docInfo>の条件設定により
          // #mdContentを持つelementがまだ画面にない。
          //
          // this.docInfoをセットした後に、ChangeDetectorRef.detectChanges()することで
          // 仮想DOMの内容が更新され、<ng-container *ngIf="docInfo>内のelementに
          // アクセスすることができるようになる。
          this.changeDetector.detectChanges();

          // mdRef(#mdContentを持つdiv)のnativeElementにアクセスすることで
          // JQueryやjavascriptで過去に行っていたような、htmlタグの操作が可能になる。
          this.mdRef.nativeElement.innerHTML = doc.bodyHtml;
        },
        err => console.error("MarkdownService", err),
      );
  }
  ...
}
```

`nativeElement`に対する処理はjavascriptで直接実施されるので、safeHTML型にする必要はなく、サニタイズを考慮せずにhtmlをそのままバインドできます（出来てしまいます）。

## 関連項目

- [セキュリティ - angular.jp](https://angular.jp/guide/security#bypass-security-apis)
- [ElementRef - angular.jp](https://angular.jp/api/core/ElementRef)
- [\[Angular\]変数のバインドで、htmlタグを埋め込む](https://akamist.com/blog/archives/2223)
- [AngularでビューにHTML文書を「バインド」するには？（Property Binding）](https://www.atmarkit.co.jp/ait/articles/1702/13/news127.html)
