import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { initialMarkdownDocumentModel, MarkdownDocument } from 'src/app/store/models/markdown-document.model';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';

import { TocService, TocItem } from '../../../services/toc.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-document-toc',
  imports: [CommonModule, RouterModule],
  templateUrl: './document-toc.component.html',
  styleUrls: ['./document-toc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentTocComponent implements OnInit, OnDestroy {
  @Input() document: MarkdownDocument | undefined = initialMarkdownDocumentModel;
  tocList: TocItem[] = [];
  activeItemIndex = new ReplaySubject<number | null>(1);

  private onDestroy = new Subject<void>();

  constructor(private tocService: TocService) {}

  ngOnInit(): void {
    this.tocService.tocList.pipe(takeUntil(this.onDestroy)).subscribe((tocList) => {
      this.tocList = tocList;
    });

    this.activeItemIndex = this.tocService.activeItemIndex;
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
