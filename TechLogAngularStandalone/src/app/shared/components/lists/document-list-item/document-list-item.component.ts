import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { TagListComponent } from 'src/app/shared/components/tags/tag-list/tag-list.component';
import { BreakpointObserverService } from 'src/app/shared/services/breakpoint-observer.service';
import { DocumentRef } from 'src/app/store/models/document-ref.model';
import { initialMarkdownDocumentModel } from 'src/app/store/models/markdown-document.model';

@Component({
  selector: 'app-document-list-item',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, TagListComponent],
  templateUrl: './document-list-item.component.html',
  styleUrls: ['./document-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentListItemComponent implements OnInit {
  @Input() item: DocumentRef = {
    docRef: '',
    content: initialMarkdownDocumentModel,
  };
  @Input() showCategory: boolean = true;

  documentRef: string = '/doc';
  isSmall$: Observable<boolean> = this.breakpointObserverService.getSmallBreakpoint();

  constructor(private breakpointObserverService: BreakpointObserverService) {}

  ngOnInit(): void {
    this.documentRef = `/doc/${this.item?.docRef}`;
  }
}
