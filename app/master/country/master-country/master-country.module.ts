import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EntityDataService, EntityDefinitionService } from '@ngrx/data';

import { SharedModule } from '../../../shared/shared.module';
import { MasterCountryActivationService } from '../../services/master-country-activation/master-country-activation.service';
import { MasterCountryTraitsService } from '../../services/master-country-traits/master-country-traits.service';

import { MasterCountryService } from './master-country.service';
import { MasterCountryCollectionService } from './store/master-country-collection.service';
import { MasterCountryDataService } from './store/master-country-data.service';
import { masterCountryEntityMetaData } from './store/master-country-entity-metadata';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule],
  providers: [
    MasterCountryCollectionService,
    MasterCountryDataService,
    MasterCountryService,
    MasterCountryTraitsService,
    MasterCountryActivationService
  ],
  exports: []
})
export class MasterCountryModule {
  constructor(
    entityDefinitionService: EntityDefinitionService,
    entityDataService: EntityDataService,
    countryDataService: MasterCountryDataService
  ) {
    entityDefinitionService.registerMetadataMap(masterCountryEntityMetaData);
    entityDataService.registerService('MasterCountry', countryDataService);
  }
}
