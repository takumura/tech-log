import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagListComponent } from 'src/app/shared/components/tags/tag-list/tag-list.component';
import { initialMarkdownDocumentModel, MarkdownDocument } from 'src/app/store/models/markdown-document.model';

@Component({
  selector: 'app-document-header',
  standalone: true,
  imports: [CommonModule, TagListComponent],
  templateUrl: './document-header.component.html',
  styleUrls: ['./document-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentHeaderComponent {
  @Input() document: MarkdownDocument | undefined = initialMarkdownDocumentModel;

  constructor() {}
}
