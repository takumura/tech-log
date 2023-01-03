import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { initialMarkdownDocumentModel, MarkdownDocument } from 'src/app/store/models/markdown-document.model';
import { TagListComponent } from '../../tags/tag-list/tag-list.component';

@Component({
  standalone: true,
  selector: 'app-document-header',
  imports: [CommonModule, TagListComponent],
  templateUrl: './document-header.component.html',
  styleUrls: ['./document-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentHeaderComponent {
  @Input() document: MarkdownDocument | undefined = initialMarkdownDocumentModel;

  constructor() {}
}
