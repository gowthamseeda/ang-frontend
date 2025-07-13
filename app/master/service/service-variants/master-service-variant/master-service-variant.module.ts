import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EntityDataService, EntityDefinitionService } from '@ngrx/data';
import { MasterServiceVariantService } from './master-service-variant.service';
import { MasterServiceVariantCollectionService } from './store/master-service-variant-collection.service';
import { MasterServiceVariantDataService } from './store/master-service-variant-data.service';
import { masterServiceVariantEntityMetaData } from './store/master-service-variant-entity-metadata';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule],
  providers: [
    MasterServiceVariantCollectionService,
    MasterServiceVariantDataService,
    MasterServiceVariantService
  ],
  exports: []
})
export class MasterServiceVariantModule {
  constructor(
    entityDefinitionService: EntityDefinitionService,
    entityDataService: EntityDataService,
    serviceVariantDataService: MasterServiceVariantDataService
  ) {
    entityDefinitionService.registerMetadataMap(masterServiceVariantEntityMetaData);
    entityDataService.registerService('MasterServiceVariant', serviceVariantDataService);
  }
}
