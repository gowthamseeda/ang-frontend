import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
  EntityDataService,
  EntityDefinitionService
} from '@ngrx/data';

import { ProductGroup } from '../product-group.model';

import { ProductGroupDataService } from './product-group-data.service';
import { productGroupEntityMetadata } from './product-group-entity-metadata';

@Injectable({
  providedIn: 'root'
})
export class ProductGroupCollectionService extends EntityCollectionServiceBase<ProductGroup> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    entityDefinitionService: EntityDefinitionService,
    entityDataService: EntityDataService,
    productGroupDataService: ProductGroupDataService
  ) {
    entityDefinitionService.registerMetadataMap(productGroupEntityMetadata);
    entityDataService.registerService('ProductGroup', productGroupDataService);

    super('ProductGroup', serviceElementsFactory);
  }
}
