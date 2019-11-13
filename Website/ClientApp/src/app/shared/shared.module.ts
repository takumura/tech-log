import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule, MatListModule } from '@angular/material';

import { DocListTemplateComponent } from './doc-list-template/doc-list-template.component';
import { DocListTemplateShortComponent } from './doc-list-template-short/doc-list-template-short.component';
import { RouteTransformerDirective } from './route-transformer.directive';

@NgModule({
  declarations: [
    DocListTemplateComponent,
    DocListTemplateShortComponent,
    RouteTransformerDirective,
  ],
  imports: [CommonModule, MatIconModule, MatListModule, RouterModule],
  exports: [DocListTemplateComponent, DocListTemplateShortComponent, RouteTransformerDirective],
})
export class SharedModule {}
