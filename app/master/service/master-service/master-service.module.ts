import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EntityDataService, EntityDefinitionService } from '@ngrx/data';

import { SharedModule } from '../../../shared/shared.module';

import { MasterServiceService } from './master-service.service';
import { MasterServiceCollectionService } from './store/master-service-collection.service';
import { MasterServiceDataService } from './store/master-service-data.service';
import { masterServiceEntityMetaData } from './store/master-service-entity-metadata';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule],
  providers: [MasterServiceCollectionService, MasterServiceDataService, MasterServiceService],
  exports: []
})
export class MasterServiceModule {
  constructor(
    entityDefinitionService: EntityDefinitionService,
    entityDataService: EntityDataService,
    serviceDataService: MasterServiceDataService
  ) {
    entityDefinitionService.registerMetadataMap(masterServiceEntityMetaData);
    entityDataService.registerService('MasterService', serviceDataService);
  }
}
