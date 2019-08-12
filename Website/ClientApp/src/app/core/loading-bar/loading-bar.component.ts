import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { LoadingBarService, LoadingState } from './loading-bar.service';

@Component({
  selector: 'loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss'],
})
export class LoadingBarComponent implements OnInit, OnDestroy {
  show: boolean;
  private onDestroy = new Subject();

  constructor(private loadingBarService: LoadingBarService) {}

  ngOnInit() {
    this.show = false;

    this.loadingBarService.loadingState
      .pipe(takeUntil(this.onDestroy))
      .subscribe((state: LoadingState) => {
        this.show = state.show;
      });
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }
}
