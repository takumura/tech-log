import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchComponent } from './search.component';
import { DocumentListComponent } from 'src/app/shared/components/lists/document-list/document-list.component';
import { ExpansionDocumentListComponent } from 'src/app/shared/components/lists/expansion-document-list/expansion-document-list.component';

const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
    title: 'Search',
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    RouterModule.forChild(routes),
    DocumentListComponent,
    ExpansionDocumentListComponent,
  ],
})
export class MarkdownDocumentSearchModule {}
