import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import { LoadingBarService } from '../loading-bar/loading-bar.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));
  private onDestroy = new Subject();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private loadingBarService: LoadingBarService,
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationStart),
        takeUntil(this.onDestroy),
      )
      .subscribe(() => {
        this.loadingBarService.show();
      });
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }
}
