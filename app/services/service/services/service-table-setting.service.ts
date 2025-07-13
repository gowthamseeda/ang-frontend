import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable()
export class ServiceTableSettingService {
  private readonly _pristine = new BehaviorSubject<boolean>(false);

  get unmaintainedInfo(): Observable<boolean> {
    return this._pristine.asObservable();
  }

  toggleUnmaintainedInfo(show: boolean): void {
    this._pristine.next(show);
  }
}
