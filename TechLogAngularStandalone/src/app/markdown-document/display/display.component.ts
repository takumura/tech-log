import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subject, takeUntil, delay } from 'rxjs';

import { DocumentComponent } from 'src/app/shared/components/markdown/document/document.component';
import { DocumentHeaderComponent } from 'src/app/shared/components/markdown/document-header/document-header.component';
import { DocumentTocComponent } from 'src/app/shared/components/markdown/document-toc/document-toc.component';
import { BreakpointObserverService } from 'src/app/shared/services/breakpoint-observer.service';
import { DocumentRef } from 'src/app/store/models/document-ref.model';
import { selectDocument } from 'src/app/store/document-index/document-index.selectors';
import { selectFragment } from 'src/app/store/router/router.selectors';

@Component({
  selector: 'app-display',
  standalone: true,
  imports: [CommonModule, DocumentComponent, DocumentHeaderComponent, DocumentTocComponent],
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayComponent implements OnInit, OnDestroy {
  document$: Observable<DocumentRef> = this.store.select(selectDocument);
  isMedium$: Observable<boolean> = this.breakpointObserverService.getMediumBreakpoint();

  private onDestroy = new Subject<void>();

  constructor(private breakpointObserverService: BreakpointObserverService, private store: Store) {}

  ngOnInit(): void {
    // need to add small delay to scroll after the component is ready on view.
    this.store
      .select(selectFragment)
      .pipe(takeUntil(this.onDestroy), delay(100))
      .subscribe((fragment) => {
        this.scrollToAnchor(fragment!);
      });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  private scrollToAnchor(anchor: string) {
    const elem = document.getElementById(anchor);
    const offsetTop = elem ? elem.offsetTop - 80 : 0;
    window.scrollTo(0, offsetTop);
  }
}
