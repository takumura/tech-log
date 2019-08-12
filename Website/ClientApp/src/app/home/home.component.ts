import { Component, OnInit } from '@angular/core';

import { LoadingBarService } from '../core/loading-bar/loading-bar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private loadingBarService: LoadingBarService) {}

  ngOnInit() {
    this.loadingBarService.hide();
  }
}
