import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeyTableService {
  private readonly keysSavedSubject = new Subject<boolean>();

  constructor() {}

  saveKeys(): Observable<boolean> {
    return this.keysSavedSubject;
  }

  keysSaved(saved: boolean): void {
    this.keysSavedSubject.next(saved);
  }
}
