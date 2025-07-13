import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { distinct, filter, map } from 'rxjs/operators';

import { Outlet } from '../../shared/models/outlet.model';
import * as fromOutlet from '../../store';
import { selectDistributionLevelsState, selectOutletState } from '../store/selectors';

@Injectable({ providedIn: 'root' })
export class BusinessSiteStoreService {
  constructor(private store: Store<fromOutlet.State>) {}

  getOutlet(): Observable<Outlet> {
    return this.store.pipe(
      select(selectOutletState),
      distinct(),
      filter(outlet => outlet !== undefined),
      map((outlet: Outlet) => outlet)
    );
  }

  getDistributionLevels(): Observable<string[]> {
    return this.store.pipe(select(selectDistributionLevelsState));
  }
}
