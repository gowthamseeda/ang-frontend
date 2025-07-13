import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidityTableStatusService {
  private readonly _pristine = new BehaviorSubject<boolean>(true);
  private readonly _valid = new BehaviorSubject<boolean>(true);

  get pristine(): Observable<boolean> {
    return this._pristine.asObservable();
  }

  get valid(): Observable<boolean> {
    return this._valid.asObservable();
  }

  changePristineTo(pristine: boolean): void {
    this._pristine.next(pristine);
  }

  changeValidTo(valid: boolean): void {
    this._valid.next(valid);
  }
}
