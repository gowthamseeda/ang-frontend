import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { createSelector, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';

import { Currency } from '../currency.model';

@Injectable()
export class CurrencyCollectionService extends EntityCollectionServiceBase<Currency> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Currency', serviceElementsFactory);
  }

  selectAllIds(): MemoizedSelector<Object, string[], DefaultProjectorFn<string[]>> {
    return createSelector(this.selectors.selectEntityMap, currencies => Object.keys(currencies));
  }

  isLoaded(): MemoizedSelector<Object, boolean, DefaultProjectorFn<boolean>> {
    return createSelector(this.selectors.selectLoaded, loaded => loaded);
  }
}
