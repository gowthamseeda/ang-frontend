import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
  EntityDataService,
  EntityDefinitionService
} from '@ngrx/data';
import { createSelector, MemoizedSelector } from '@ngrx/store';
import { DefaultProjectorFn } from '@ngrx/store/src/selector';

import { Brand } from '../brand.model';

import { BrandDataService } from './brand-data.service';
import { brandEntityMetadata } from './brand-entity-metadata';

@Injectable({
  providedIn: 'root'
})
export class BrandCollectionService extends EntityCollectionServiceBase<Brand> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    entityDefinitionService: EntityDefinitionService,
    entityDataService: EntityDataService,
    brandDataService: BrandDataService
  ) {
    entityDefinitionService.registerMetadataMap(brandEntityMetadata);
    entityDataService.registerService('Brand', brandDataService);

    super('Brand', serviceElementsFactory);
  }

  select(brandId: string): MemoizedSelector<Object, Brand, DefaultProjectorFn<Brand>> {
    return createSelector(this.selectors.selectEntityMap, brands => {
      const brand = brands[brandId];

      if (!brand) {
        throw new Error('NOT_FOUND');
      }
      return brand;
    });
  }

  selectAllIds(): MemoizedSelector<Object, string[], DefaultProjectorFn<string[]>> {
    return createSelector(this.selectors.selectEntityMap, brands => Object.keys(brands));
  }
}
