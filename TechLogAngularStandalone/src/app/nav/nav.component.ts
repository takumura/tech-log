import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterModule,
} from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { delay, filter, Observable, Subject, takeUntil } from 'rxjs';

import { BreakpointObserverService } from 'src/app/shared/services/breakpoint-observer.service';
import { hideLoading, showLoading } from 'src/app/store/loading/loading.actions';
import { LoadingBarComponent } from '../shared/components/loading-bar/loading-bar.component';

//TODO to be deleted
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatSidenavModule,
    LoadingBarComponent,
  ],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent implements OnInit, OnDestroy {
  env = environment;
  isSmall$: Observable<boolean> = this.breakpointObserverService.getSmallBreakpoint();
  private onDestroy = new Subject<void>();

  constructor(
    private breakpointObserverService: BreakpointObserverService,
    private router: Router,
    private store: Store
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntil(this.onDestroy)
      )
      .subscribe(() => {
        this.store.dispatch(showLoading());
      });

    this.router.events
      .pipe(
        filter(
          (event) =>
            event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError
        ),
        delay(1000),
        takeUntil(this.onDestroy)
      )
      .subscribe(() => {
        this.store.dispatch(hideLoading());
      });
  }

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
