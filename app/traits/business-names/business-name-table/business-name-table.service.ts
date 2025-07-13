import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusinessNameTableService {
  private readonly businessNamesSavedSubject = new Subject<boolean>();

  constructor() {}

  saveNames(): Observable<boolean> {
    return this.businessNamesSavedSubject;
  }

  namesSaved(saved: boolean): void {
    this.businessNamesSavedSubject.next(saved);
  }
}
