import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { DefaultProjectorFn, MemoizedSelector, createSelector } from '@ngrx/store';

import { MasterService } from '../master-service.model';

@Injectable()
export class MasterServiceCollectionService extends EntityCollectionServiceBase<MasterService> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('MasterService', serviceElementsFactory);
  }

  select(
    serviceId: number
  ): MemoizedSelector<Object, MasterService, DefaultProjectorFn<MasterService>> {
    return createSelector(this.selectors.selectEntityMap, services => {
      const service = services[serviceId];

      if (!service) {
        throw new Error('NOT_FOUND');
      }
      
      return service;
    });
  }
}
