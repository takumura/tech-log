import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatProgressBarModule,
  MatSidenavModule,
  MatToolbarModule,
} from '@angular/material';
import { RouterModule } from '@angular/router';

import { LoadingBarComponent } from './loading-bar/loading-bar.component';
import { LoadingBarService } from './loading-bar/loading-bar.service';
import { MarkdownService } from './markdown/markdown.service';
import { NavComponent } from './nav/nav.component';

@NgModule({
  declarations: [LoadingBarComponent, NavComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatSidenavModule,
    RouterModule,
  ],
  exports: [LoadingBarComponent, NavComponent],
  providers: [LoadingBarService, MarkdownService],
})
export class CoreModule {}
