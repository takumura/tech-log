import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentComponent } from './document/document.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'docs', loadChildren: './document/document.module#DocumentModule' },
  { path: 'search', loadChildren: './search/search.module#SearchModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // // Those official route options seems not works well for this app
      // // which markdown document is delivered and displayed after ngAfterContentInit or ngAfterViewInit for now.
      // // To be reviewed later.
      // scrollPositionRestoration: 'enabled',
      // scrollPositionRestoration: 'top',
      // anchorScrolling: 'enabled',
      // scrollOffset: [0, 72],
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
