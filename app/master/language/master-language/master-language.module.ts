import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EntityDataService, EntityDefinitionService } from '@ngrx/data';

import { SharedModule } from '../../../shared/shared.module';

import { MasterLanguageService } from './master-language.service';
import { MasterLanguageCollectionService } from './store/master-language-collection.service';
import { MasterLanguageDataService } from './store/master-language-data.service';
import { masterLanguageEntityMetaData } from './store/master-language-entity-metadata';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule],
  providers: [MasterLanguageCollectionService, MasterLanguageDataService, MasterLanguageService],
  exports: []
})
export class MasterLanguageModule {
  constructor(
    entityDefinitionService: EntityDefinitionService,
    entityDataService: EntityDataService,
    languageDataService: MasterLanguageDataService
  ) {
    entityDefinitionService.registerMetadataMap(masterLanguageEntityMetaData);
    entityDataService.registerService('MasterLanguage', languageDataService);
  }
}
