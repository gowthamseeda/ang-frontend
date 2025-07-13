import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';

import { MasterCountry } from '../master-country.model';

@Injectable()
export class MasterCountryCollectionService extends EntityCollectionServiceBase<MasterCountry> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('MasterCountry', serviceElementsFactory);
  }
}
