import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Location } from '@angular/common';
import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, map } from 'rxjs/operators';

import { MarkdownService, DocumentIndex } from '../core/markdown/markdown.service';
import { LoadingBarService } from '../core/loading-bar/loading-bar.service';
import { SearchResult } from './search.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  docIndex: SearchResult[] | null;
  searchValue = '';
  searchSubject = new Subject<string>();
  private path: string;
  private onDestroy = new Subject();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private markdownService: MarkdownService,
    private location: Location,
    private loadingBarService: LoadingBarService,
  ) {}

  ngOnInit() {
    this.path = this.location.normalize('assets/json/index.json');

    this.searchSubject
      .pipe(debounceTime(1000), distinctUntilChanged(), takeUntil(this.onDestroy))
      .subscribe(term => {
        this.loadingBarService.show();
        this.docIndex = null;
        this.getDocuments(term);
      });

    // initial search
    this.loadingBarService.show();
    this.getDocuments(this.searchValue);
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  search(term: string) {
    this.searchSubject.next(term);
  }

  clearSearchInput() {
    this.loadingBarService.show();
    this.searchValue = '';
    this.search(this.searchValue);
  }

  private getDocuments(term: string) {
    this.markdownService
      .getDocIndex(this.path, term)
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        docs => {
          const categorizedList = this.getCategorizedDocList(docs);
          this.docIndex = categorizedList;
          this.loadingBarService.hide();
        },
        err => {
          console.error('MarkdownService', err);
          this.loadingBarService.hide();
        },
      );
  }

  private getCategorizedDocList(docs: DocumentIndex[]): SearchResult[] {
    const categories = this.getCategoris(docs);

    const categoryItemList: SearchResult[] = [];
    categories.forEach(x => {
      const item: SearchResult = {
        category: '',
        docs: [],
        count: 0,
      };
      item.category = x === undefined ? '[no categories]' : x;
      item.docs = docs.filter(doc => doc.content.category == x).sort(this.sortByDate(true));
      item.count = Object.keys(item.docs).length;
      categoryItemList.push(item);
    });

    return categoryItemList;
  }

  private getCategoris(docs: DocumentIndex[]): string[] {
    return docs
      .map(doc => doc.content.category)
      .filter((x, i, self) => self.indexOf(x) === i)
      .sort(this.sortByTitle());
  }

  private sortByTitle() {
    return (a, b) => {
      // refer to following site:
      // https://stackoverflow.com/questions/8996963/how-to-perform-case-insensitive-sorting-in-javascript
      const comparison = a.toLowerCase().localeCompare(b.toLowerCase());
      /* If strings are equal in case insensitive comparison */
      if (comparison === 0) {
        /* Return case sensitive comparison instead */
        return a.localeCompare(b);
      }
      /* Otherwise return result */
      return comparison;
    };
  }

  private sortByDate(desc: boolean) {
    return (a: DocumentIndex, b: DocumentIndex) => {
      const aDate = a.content.date;
      const bDate = b.content.date;
      let result = 0;
      if (!aDate && !bDate) {
        result = 0;
      } else if (!aDate) {
        result = -1;
      } else if (!bDate) {
        result = 1;
      } else if (bDate > aDate) {
        result = -1;
      } else if (aDate > bDate) {
        result = 1;
      }

      return desc ? result * -1 : result;
    };
  }
}
