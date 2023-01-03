import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';

import { DocumentRef } from 'src/app/store/models/document-ref.model';
import { DocumentListItemComponent } from '../document-list-item/document-list-item.component';

@Component({
  standalone: true,
  selector: 'app-document-list',
  imports: [CommonModule, MatListModule, DocumentListItemComponent],
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentListComponent {
  @Input() documents: DocumentRef[] | null = [];

  constructor() {}
}
