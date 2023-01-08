import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { DocumentComponent } from 'src/app/shared/components/markdown/document/document.component';
import { DocumentRef } from 'src/app/store/models/document-ref.model';
import { selectDocumentByDocRef } from 'src/app/store/document-index/document-index.selectors';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DocumentComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  env = environment;
  document$: Observable<DocumentRef> = this.store.select(selectDocumentByDocRef('welcome'));

  constructor(private store: Store) {}
}
