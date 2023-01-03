import { Route } from '@angular/router';
import { TocService } from 'src/app/shared/services/toc.service';
import { DisplayComponent } from './display.component';

export default [
  {
    path: '',
    children: [
      {
        path: '**',
        component: DisplayComponent,
      },
    ],
  },
] as Route[];
