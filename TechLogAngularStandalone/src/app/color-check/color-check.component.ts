import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-color-check',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './color-check.component.html',
  styleUrls: ['./color-check.component.scss'],
})
export class ColorCheckComponent {}
