import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material';
import { RouterModule } from '@angular/router';

import { DocumentComponent } from './document.component';
import { DocumentTocComponent } from './doc-toc/document-toc.component';
import { RouteTransformerDirective } from './shared/route-transformer.directive';
import { DocumentHeaderComponent } from './doc-header/document-header.component';
import { DocumentRoutingModule } from './document-routing.module';

@NgModule({
  declarations: [
    DocumentComponent,
    DocumentHeaderComponent,
    DocumentTocComponent,
    RouteTransformerDirective,
  ],
  imports: [CommonModule, FlexLayoutModule, MatIconModule, RouterModule],
  exports: [
    DocumentComponent,
    DocumentHeaderComponent,
    DocumentTocComponent,
    RouteTransformerDirective,
    DocumentRoutingModule,
  ],
})
export class DocumentModule {}
