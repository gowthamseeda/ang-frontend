import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EntityDataService, EntityDefinitionService } from '@ngrx/data';

import { SharedModule } from '../../../shared/shared.module';

import { MasterBrandService } from './master-brand.service';
import { MasterBrandCollectionService } from './store/master-brand-collection.service';
import { MasterBrandDataService } from './store/master-brand-data.service';
import { masterBrandEntityMetaData } from './store/master-brand-entity-metadata';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule],
  providers: [MasterBrandCollectionService, MasterBrandDataService, MasterBrandService],
  exports: []
})
export class MasterBrandModule {
  constructor(
    entityDefinitionService: EntityDefinitionService,
    entityDataService: EntityDataService,
    brandDataService: MasterBrandDataService
  ) {
    entityDefinitionService.registerMetadataMap(masterBrandEntityMetaData);
    entityDataService.registerService('MasterBrand', brandDataService);
  }
}
