import { Component, Input } from '@angular/core';

import { TocItem } from './document-toc.model';

@Component({
  selector: 'app-document-toc',
  templateUrl: './document-toc.component.html',
  styleUrls: ['./document-toc.component.scss'],
})
export class DocumentTocComponent {
  @Input() tocList: TocItem[] | null;

  constructor() {}
}
