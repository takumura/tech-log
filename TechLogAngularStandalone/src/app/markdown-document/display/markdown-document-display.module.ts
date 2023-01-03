import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { DisplayComponent } from './display.component';
import { MaterialModule } from '../../shared/material.module';
import { SharedModule } from '../../shared/shared.module';
import { DocumentComponent } from 'src/app/shared/components/markdown/document/document.component';
import { DocumentHeaderComponent } from 'src/app/shared/components/markdown/document-header/document-header.component';
import { DocumentTocComponent } from 'src/app/shared/components/markdown/document-toc/document-toc.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '**',
        component: DisplayComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    DocumentComponent,
    DocumentHeaderComponent,
    DocumentTocComponent,
    RouterModule.forChild(routes),
  ],
})
export class MarkdownDocumentDisplayModule {}
