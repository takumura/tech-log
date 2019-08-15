import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { DocumentComponent } from './document.component';
import { DocumentTocComponent } from './doc-toc/document-toc.component';
import { DocumentHeaderComponent } from './doc-header/document-header.component';
import { DocumentRoutingModule } from './document-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [DocumentComponent, DocumentHeaderComponent, DocumentTocComponent],
  imports: [CommonModule, FlexLayoutModule, MatIconModule, RouterModule, SharedModule],
  exports: [
    DocumentComponent,
    DocumentHeaderComponent,
    DocumentTocComponent,
    DocumentRoutingModule,
  ],
})
export class DocumentModule {}
