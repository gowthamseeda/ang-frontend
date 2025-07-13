import { Injectable } from '@angular/core';
import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
  EntityDataService,
  EntityDefinitionService
} from '@ngrx/data';

import { DistributionLevelDataService } from './distribution-level-data.service';
import { distributionLevelEntityMetadata } from './distribution-level-entity-metadata';
import { DistributionLevelEntity } from './distribution-level-entity.model';

@Injectable({ providedIn: 'root' })
export class DistributionLevelCollectionService extends EntityCollectionServiceBase<
  DistributionLevelEntity
> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    entityDefinitionService: EntityDefinitionService,
    entityDataService: EntityDataService,
    distributionLevelDataService: DistributionLevelDataService
  ) {
    entityDefinitionService.registerMetadataMap(distributionLevelEntityMetadata);
    entityDataService.registerService('DistributionLevel', distributionLevelDataService);

    super('DistributionLevel', serviceElementsFactory);
  }
}
