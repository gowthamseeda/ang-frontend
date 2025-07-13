import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromOpeningHours from './reducers';
import { Hours } from './reducers';
import { selectBrandProductGroupOpeningHoursState, selectInitializedState } from './selectors';

@Injectable({ providedIn: 'root' })
export class OpeningHoursStoreService {
  constructor(private store: Store<fromOpeningHours.State>) {}

  isInitialized(
    outletId: string,
    productCategoryId: number,
    serviceId: number,
    serviceCharacteristicsId?: number
  ): Observable<boolean> {
    return this.store.pipe(
      select(selectInitializedState, {
        outletId: outletId,
        productCategoryId: productCategoryId,
        serviceId: serviceId,
        serviceCharacteristicsId: serviceCharacteristicsId
      })
    );
  }

  getOpeningHours(): Observable<Hours> {
    return this.store.pipe(select(selectBrandProductGroupOpeningHoursState));
  }
}
