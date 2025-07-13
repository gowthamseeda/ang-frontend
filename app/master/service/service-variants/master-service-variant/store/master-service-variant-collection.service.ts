import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { createSelector, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';

import { MasterServiceVariant } from '../master-service-variant.model';

@Injectable()
export class MasterServiceVariantCollectionService extends EntityCollectionServiceBase<MasterServiceVariant> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('MasterServiceVariant', serviceElementsFactory);
  }

  select(
    serviceVariantId: number
  ): MemoizedSelector<Object, MasterServiceVariant, DefaultProjectorFn<MasterServiceVariant>> {
    return createSelector(this.selectors.selectEntityMap, serviceVariants => {
      const serviceVariant = serviceVariants[serviceVariantId];

      if (!serviceVariant) {
        throw new Error('NOT_FOUND');
      }
      return serviceVariant;
    });
  }

  isLoading(): MemoizedSelector<Object, boolean, DefaultProjectorFn<boolean>> {
    return createSelector(this.selectors.selectLoading, loading => loading);
  }
}
