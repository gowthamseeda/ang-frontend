import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EntityDataService, EntityDefinitionService } from '@ngrx/data';

import { SharedModule } from '../../shared/shared.module';

import { CurrencyService } from './currency.service';
import { CurrencyCollectionService } from './store/currency-collection.service';
import { CurrencyDataService } from './store/currency-data.service';
import { currencyEntityMetaData } from './store/currency-entity-metadata';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule],
  providers: [CurrencyCollectionService, CurrencyDataService, CurrencyService],
  exports: []
})
export class CurrencyModule {
  constructor(
    entityDefinitionService: EntityDefinitionService,
    entityDataService: EntityDataService,
    currencyDataService: CurrencyDataService
  ) {
    entityDefinitionService.registerMetadataMap(currencyEntityMetaData);
    entityDataService.registerService('Currency', currencyDataService);
  }
}
