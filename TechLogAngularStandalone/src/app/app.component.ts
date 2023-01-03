import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { NavComponent } from './nav/nav.component';

import { loadDocuments } from './store/document-index/document-index.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(private store: Store, matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    this.store.dispatch(loadDocuments());
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg'));
  }
}
