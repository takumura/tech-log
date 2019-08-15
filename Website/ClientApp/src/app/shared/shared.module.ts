import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouteTransformerDirective } from './route-transformer.directive';

@NgModule({
  declarations: [RouteTransformerDirective],
  imports: [],
  exports: [RouteTransformerDirective],
})
export class SharedModule {}
