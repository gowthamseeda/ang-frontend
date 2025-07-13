import { NgModule } from '@angular/core';
import { DefaultDataServiceConfig, EntityDataModule } from '@ngrx/data';

import { environment } from '../../../environments/environment';

import { entityConfig } from './entity-config';

const defaultDataServiceConfig: DefaultDataServiceConfig = {
  root: `${environment.settings.backend}/api/v1`
};

@NgModule({
  imports: [EntityDataModule.forRoot(entityConfig)],
  providers: [{ provide: DefaultDataServiceConfig, useValue: defaultDataServiceConfig }]
})
export class EntityStoreModule {}
