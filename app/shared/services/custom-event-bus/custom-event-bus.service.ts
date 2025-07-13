import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomEventBusService {
  private readonly event = new Subject<string>();

  data(event?: string): Observable<string> {
    if (event) {
      return this.event.pipe(filter(currentEvent => currentEvent === event));
    }
    return this.event;
  }

  dispatchEvent(event: string): void {
    this.event.next(event);
  }
}
