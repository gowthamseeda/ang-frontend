import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { createSelector, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';

import { MasterProductGroup } from '../master-product-group.model';

@Injectable()
export class MasterProductGroupCollectionService extends EntityCollectionServiceBase<MasterProductGroup> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('MasterProductGroup', serviceElementsFactory);
  }

  select(
    productGroupdId: string
  ): MemoizedSelector<Object, MasterProductGroup, DefaultProjectorFn<MasterProductGroup>> {
    return createSelector(this.selectors.selectEntityMap, productGroups => {
      const productGroup = productGroups[productGroupdId];

      if (!productGroup) {
        throw new Error('NOT_FOUND');
      }
      return productGroup;
    });
  }
}
