import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { createSelector, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';

import { MasterBrand } from '../master-brand.model';

@Injectable()
export class MasterBrandCollectionService extends EntityCollectionServiceBase<MasterBrand> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('MasterBrand', serviceElementsFactory);
  }

  select(brandId: string): MemoizedSelector<Object, MasterBrand, DefaultProjectorFn<MasterBrand>> {
    return createSelector(this.selectors.selectEntityMap, brands => {
      const brand = brands[brandId];

      if (!brand) {
        throw new Error('NOT_FOUND');
      }
      return brand;
    });
  }
}
