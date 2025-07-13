import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EntityDataService, EntityDefinitionService } from '@ngrx/data';

import { SharedModule } from '../../../shared/shared.module';

import { MasterProductGroupService } from './master-product-group.service';
import { MasterProductGroupCollectionService } from './store/master-product-group-collection.service';
import { MasterProductGroupDataService } from './store/master-product-group-data.service';
import { masterProductGroupEntityMetaData } from './store/master-product-group-entity-metadata';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule],
  providers: [
    MasterProductGroupCollectionService,
    MasterProductGroupDataService,
    MasterProductGroupService
  ],
  exports: []
})
export class MasterProductGroupModule {
  constructor(
    entityDefinitionService: EntityDefinitionService,
    entityDataService: EntityDataService,
    productGroupDataService: MasterProductGroupDataService
  ) {
    entityDefinitionService.registerMetadataMap(masterProductGroupEntityMetaData);
    entityDataService.registerService('MasterProductGroup', productGroupDataService);
  }
}
