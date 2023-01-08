import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';

import { DocumentListItemComponent } from 'src/app/shared/components/lists/document-list-item/document-list-item.component';
import { DocumentRef } from 'src/app/store/models/document-ref.model';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule, MatListModule, DocumentListItemComponent],
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentListComponent {
  @Input() documents: DocumentRef[] | null = [];

  constructor() {}
}
