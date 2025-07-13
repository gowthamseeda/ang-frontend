import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class ServiceTableStatusService {
  private readonly _pristine = new BehaviorSubject<boolean>(true);
  private readonly _serviceTableSaved = new BehaviorSubject<boolean>(true);

  get pristine(): Observable<boolean> {
    return this._pristine.asObservable();
  }

  get serviceTableSaved(): Observable<boolean> {
    return this._serviceTableSaved.asObservable();
  }

  changePristineTo(pristine: boolean): void {
    this._pristine.next(pristine);
  }

  changeServiceTableSavedStatusTo(saved: boolean): void {
    this._serviceTableSaved.next(saved);
  }
}
