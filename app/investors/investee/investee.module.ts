import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EntityDataService, EntityDefinitionService } from '@ngrx/data';
import { InvesteeService } from './investee.service';
import { InvesteeCollectionService } from './store/investee-collection.service';
import { InvesteeDataService } from './store/investee-data.service';
import { investeeEntityMetadata } from './store/investee-entity-metadata';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [CommonModule, SharedModule],
  providers: [InvesteeCollectionService, InvesteeDataService, InvesteeService]
})
export class InvesteeModule {
  constructor(
    entityDefinitionService: EntityDefinitionService,
    entityDataService: EntityDataService,
    investeeDataService: InvesteeDataService
  ) {
    entityDefinitionService.registerMetadataMap(investeeEntityMetadata);
    entityDataService.registerService('Investee', investeeDataService);
  }
}
