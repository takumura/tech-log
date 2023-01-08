import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { Store } from '@ngrx/store';

import { searchDocumentsByAdvancedOptions } from 'src/app/store/document-search/document-search.actions';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [MatChipsModule],
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  @Input() value = '';

  constructor(private router: Router, private store: Store) {}

  searchByTag(event: Event): void {
    event.stopPropagation();
    this.store.dispatch(searchDocumentsByAdvancedOptions({ tags: [this.value], category: '' }));
    this.router.navigate(['/search']);
  }
}
