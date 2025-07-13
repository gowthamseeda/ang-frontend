import { Injectable } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Subscription } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {
  progressChanges = new BehaviorSubject<number>(-1);
  private progress: number;
  private loadingBarSubscription: Subscription;

  constructor(private loader: LoadingBarService) {
  }

  subscribe(): void {
    if (!this.loadingBarSubscription) {
      this.loadingBarSubscription = this.loader.value$.subscribe(this.progressChanges);
    }
  }

  start(): void {
    this.subscribe();
  }

  stop(): void {
    this.delayedStop();
  }

  private increaseProgress(): void {
    setTimeout(() => {
      if (this.progress >= 0 && this.progress < 90) {
        this.progress += 10;
        this.progressChanges.next(this.progress);
        this.increaseProgress();
      }
    }, 300);
  }

  private delayedStop(): void {
    if (this.progress >= 0) {
      this.progressChanges.next(100);

      setTimeout(() => {
        this.progressChanges.next(-1);
      }, 1500);
    } else {
      this.progressChanges.next(-1);
    }
    this.progress = -1;
  }
}
