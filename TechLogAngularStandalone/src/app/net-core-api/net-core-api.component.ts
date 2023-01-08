import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-net-core-api',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './net-core-api.component.html',
  styleUrls: ['./net-core-api.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetCoreApiComponent {
  public forecastsSub: BehaviorSubject<WeatherForecast[]> = new BehaviorSubject<WeatherForecast[]>([]);
  public forecasts$: Observable<WeatherForecast[]> = this.forecastsSub.asObservable();

  constructor(http: HttpClient) {
    http.get<WeatherForecast[]>('/weatherforecast').subscribe({
      next: (result) => this.forecastsSub.next(result),
      error: (e) => console.error(e),
    });
  }

  title = 'Test Api';
}

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
