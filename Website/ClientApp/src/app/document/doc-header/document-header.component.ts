import { Component, Input } from '@angular/core';

import { DocumentInfo } from 'src/app/core/markdown/markdown.service';

@Component({
  selector: 'app-doc-header',
  templateUrl: './document-header.component.html',
  styleUrls: ['./document-header.component.scss'],
})
export class DocumentHeaderComponent {
  @Input() docInfo: DocumentInfo;

  constructor() {}
}
