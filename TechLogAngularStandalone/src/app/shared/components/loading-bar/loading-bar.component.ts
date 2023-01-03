import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { selectShowLoading } from 'src/app/store/loading/loading.selectors';

@Component({
  standalone: true,
  selector: 'app-loading-bar',
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingBarComponent {
  loading$: Observable<boolean>;

  constructor(public store: Store) {
    this.loading$ = this.store.select(selectShowLoading);
  }
}
