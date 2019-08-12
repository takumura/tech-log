import { Directive, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[appRouteTransformer]',
})
export class RouteTransformerDirective {
  constructor(private router: Router) {}

  @HostListener('click', ['$event'])
  public onClick(event) {
    if (event.target.tagName === 'A') {
      if (event.target.classList && event.target.classList[0] === 'internal-link') {
        if (event.target.hash) {
          this.router.navigate([event.target.pathname], { fragment: event.target.hash.slice(1) });
        } else {
          this.router.navigate([event.target.pathname]);
        }
        event.preventDefault();
      } else if (event.target.classList && event.target.classList[0] === 'internal-anchor') {
        event.preventDefault();
      } else {
        // do nothing for now.
      }
    }
  }
}
