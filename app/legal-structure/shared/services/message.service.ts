import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable()
export class MessageService {
  private messages: { [index: string]: any } = {};
  private subject = new Subject<{ [key: string]: boolean } | void>();

  constructor() {}

  get(): Observable<{ [key: string]: boolean } | void> {
    return this.subject.asObservable().pipe(distinctUntilChanged());
  }

  clearCache(): void {
    this.subject.next();
  }

  add(key: string, value: boolean): void {
    const messages = { ...this.messages };
    messages[key] = value;
    this.subject.next(messages);
  }
}
