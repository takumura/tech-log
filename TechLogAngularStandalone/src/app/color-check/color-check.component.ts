import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-color-check',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './color-check.component.html',
  styleUrls: ['./color-check.component.scss'],
})
export class ColorCheckComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
