import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { createSelector, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';

import { Investee } from '../investee.model';

@Injectable()
export class InvesteeCollectionService extends EntityCollectionServiceBase<Investee> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Investee', serviceElementsFactory);
  }

  select(
    investeeId: string
  ): MemoizedSelector<Object, Investee | undefined, DefaultProjectorFn<Investee | undefined>> {
    return createSelector(this.selectors.selectEntityMap, investees => investees[investeeId]);
  }

  isLoaded(): MemoizedSelector<Object, boolean, DefaultProjectorFn<boolean>> {
    return createSelector(this.selectors.selectEntities, investees => investees.length > 0);
  }

  isLoading(): MemoizedSelector<Object, boolean, DefaultProjectorFn<boolean>> {
    return createSelector(this.selectors.selectLoading, loading => loading);
  }
}
