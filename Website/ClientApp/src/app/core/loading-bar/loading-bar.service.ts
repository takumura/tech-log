import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingBarService {
  loadingState: Observable<LoadingState>;
  private loadingSubject = new Subject<LoadingState>();

  constructor() {
    this.loadingState = this.loadingSubject.asObservable();
  }

  show() {
    this.loadingSubject.next(<LoadingState>{ show: true });
  }
  hide() {
    this.loadingSubject.next(<LoadingState>{ show: false });
  }
}

export interface LoadingState {
  show: boolean;
}
