import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class ToggleService {
  private _expandAll = new BehaviorSubject<boolean>(false);
  expandAll$ = this._expandAll.asObservable();

  constructor() {}

  setExpandAll(status: boolean) {
    this._expandAll.next(status);
  }
}
