import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

import * as fromStructures from '../../store';
import { RegionalCenter } from '../model/regional-center.model';
import { selectInitialized, selectRegionalCenters } from '../store/selectors';

import { RegionalCenterActionService } from './regional-center-action.service';

@Injectable({ providedIn: 'root' })
export class RegionalCenterService {
  constructor(
    private store: Store<fromStructures.State>,
    private actionService: RegionalCenterActionService
  ) {}

  fetchData(): void {
    this.store
      .pipe(select(selectInitialized))
      .pipe(
        take(1),
        tap(initialized => {
          if (!initialized) {
            this.actionService.dispatchLoadRegionalCenters();
          }
        })
      )
      .subscribe();
  }

  getAll(): Observable<RegionalCenter[]> {
    return this.store.pipe(select(selectRegionalCenters));
  }
}
