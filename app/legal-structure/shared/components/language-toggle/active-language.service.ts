import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export interface ActiveLanguage {
  isDefaultLanguage: boolean;
  languageId?: string;
}

@Injectable()
export class ActiveLanguageService {
  private activeLanguage: ActiveLanguage = { isDefaultLanguage: true };
  private subject = new BehaviorSubject<ActiveLanguage>(this.activeLanguage);

  constructor() {}

  get(): Observable<ActiveLanguage> {
    return this.subject.asObservable().pipe(distinctUntilChanged());
  }

  update(activeLanguage: ActiveLanguage): void {
    this.subject.next(activeLanguage);
  }
}
