import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { DocumentInfo, MarkdownService } from '../core/markdown/markdown.service';
import { LoadingBarService } from '../core/loading-bar/loading-bar.service';
import { TocItem } from './doc-toc/document-toc.model';
import { defaultRouteAnimation } from '../core/animations';
import postscribe from 'postscribe';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss', './vs2015.css'],
  animations: [defaultRouteAnimation],
})
export class DocumentComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mdContent')
  mdContentRef: ElementRef;

  docInfo: DocumentInfo | null;
  tocList: TocItem[] | null;
  isOpen: boolean = true;
  private fragment: string;
  private previousPath: string;
  private onDestroy = new Subject();
  private routeChangeSubject = new Subject();

  constructor(
    private markdownService: MarkdownService,
    private location: Location,
    private route: ActivatedRoute,
    private loadingBarService: LoadingBarService,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.routeChangeSubject.pipe(debounceTime(100), takeUntil(this.onDestroy)).subscribe(_ => {
      if (this.fragment) {
        this.scrollToAnchor(decodeURI(this.fragment));
      } else {
        this.scrollToTop();
      }
      this.isOpen = true;
      this.loadingBarService.hide();
    });

    this.route.fragment.pipe(takeUntil(this.onDestroy)).subscribe(fragment => {
      this.fragment = fragment;
      this.routeChangeSubject.next();
    });

    this.route.url.pipe(takeUntil(this.onDestroy)).subscribe(params => {
      const docRef = params.map(x => x.path).join('/');
      if (docRef !== this.previousPath) {
        this.docInfo = null;
        this.isOpen = false;
        this.getMarkdownDocInfo(docRef);
      }
      this.previousPath = docRef;
    });
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  ngAfterViewInit() {
    this.routeChangeSubject.next();
  }

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

  private generateToc() {
    if (this.docInfo && this.docInfo.toc !== 'none') {
      const href = this.location.path();
      const headings = this.findTocHeadings(this.docInfo.toc);
      if (headings) {
        this.tocList = headings.map(heading => ({
          href: href,
          fragment: heading.id,
          level: heading.tagName.toLowerCase(),
          title: (heading.textContent || '').trim(),
        }));
      }
    }
  }

  private findTocHeadings(toc: string): HTMLHeadingElement[] | null {
    if (this.docInfo) {
      const tmpDiv = document.createElement('div');
      tmpDiv.innerHTML = this.docInfo.bodyHtml;

      const headings = tmpDiv.querySelectorAll(toc);
      const skipNoTocHeadings = (heading: HTMLHeadingElement) =>
        !/(?:no-toc|notoc)/i.test(heading.className);
      return Array.prototype.filter.call(headings, skipNoTocHeadings);
    } else {
      return null;
    }
  }

  private scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  private scrollToAnchor(anchor: string) {
    const elem = document.getElementById(anchor);
    const offsetTop = elem ? elem.offsetTop - 80 : 0;
    window.scrollTo(0, offsetTop);
  }
}
