import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ContentLoaderService {
  readonly visibleChanges = new BehaviorSubject<boolean>(false);

  constructor() {}

  start(): void {
    this.visibleChanges.next(true);
  }

  stop(): void {
    this.visibleChanges.next(false);
  }
}
