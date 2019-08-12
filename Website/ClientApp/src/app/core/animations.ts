import { animate, transition, trigger, state, style } from '@angular/animations';

export const defaultRouteAnimation = trigger('openClose', [
  state(
    'open',
    style({
      opacity: 1,
    }),
  ),
  state(
    'closed',
    style({
      opacity: 0,
    }),
  ),
  transition('open => closed', [style({ opacity: 0 })]),
  transition('closed => open', [style({ opacity: 0 }), animate('0.3s ease-out')]),
]);
