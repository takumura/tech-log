import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import unified from 'unified';
import markdown from 'remark-parse';
import remarkAttr from 'remark-attr';
import remarkRehype from 'remark-rehype';
import raw from 'rehype-raw';
import slug from 'rehype-slug';
import autoLinkHeadings from 'rehype-autolink-headings';
import highlight from 'rehype-highlight';
import html from 'rehype-stringify';

@Injectable({
  providedIn: 'root',
})
export class MarkdownService {
  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    @Inject('BASE_URL') private baseUrl: string,
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
        docInfo = result;

        // set default toc
        if (!docInfo.toc) {
          docInfo.toc = 'h2,h3';
        }

        docInfo.bodyHtml = processor.processSync(docInfo.body).contents;
        // docInfo.safeBody = this.sanitizer.bypassSecurityTrustHtml(docInfo.bodyHtml);
        return docInfo;
      }),
    );
  }

  getDocIndex(path: string, keyword: string): Observable<DocumentIndex[]> {
    if (!keyword.trim()) {
      return this.http.get<DocumentIndex[]>(this.baseUrl + path);
    }

    return this.http
      .get<DocumentIndex[]>(this.baseUrl + path)
      .pipe(
        map(indexes =>
          indexes.filter(docIndex => this.freewordSearch(docIndex.content, keyword.trim())),
        ),
      );
  }

  private freewordSearch(doc: DocumentInfo, keyword: string): boolean {
    const title = doc.title.toLowerCase();
    const category = doc.category ? doc.category.toLowerCase() : '';
    const tag = doc.tag
      ? Object.values(doc.tag)
          .toString()
          .toLowerCase()
      : '';
    const body = doc.body.toLowerCase();
    const searchWord = keyword.toString().toLowerCase();

    return (
      title.indexOf(searchWord) != -1 ||
      category.indexOf(searchWord) != -1 ||
      tag.indexOf(searchWord) != -1 ||
      body.indexOf(searchWord) != -1
    );
  }
}

export interface DocumentInfo {
  title: string;
  date: string;
  category: string;
  tag: string[];
  toc: string;
  body: string;
  bodyHtml: string;
  // safeBody: SafeHtml;
}

export interface DocumentIndex {
  docRef: string;
  content: DocumentInfo;
}
