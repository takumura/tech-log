import { Directive, HostListener, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { LoadingBarService } from 'src/app/core/loading-bar/loading-bar.service';

@Directive({
  selector: '[appRouteTransformer]',
})
export class RouteTransformerDirective {
  constructor(private router: Router, @Inject('BASE_URL') private baseUrl: string, private loadingBarService: LoadingBarService) {}

  @HostListener('click', ['$event'])
  public onClick(event) {
    if (event.target.tagName === 'A') {
      if (event.target.classList && event.target.classList[0] === 'internal-link') {
        const targetPath = event.target.href.replace(this.baseUrl, '/').replace(/#.*/, '');
        if (event.target.hash) {
          this.router.navigate([targetPath], {
            fragment: event.target.hash.slice(1),
          });
        } else {
          this.router.navigate([targetPath]);
        }
        event.preventDefault();
      } else if (event.target.classList && event.target.classList[0] === 'internal-anchor') {
        this.loadingBarService.hide();
        event.preventDefault();
      } else {
        this.loadingBarService.hide();
        // do nothing for now.
      }
    }
  }
}
