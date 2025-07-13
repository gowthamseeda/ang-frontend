import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../../environments/environment';

import { EntityStoreModule } from './entity/entity-store.module';
import { metaReducers, reducers } from './index';

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true
      }
    }),
    EffectsModule.forRoot([]),
    EntityStoreModule,
    StoreDevtoolsModule.instrument({
      name: 'GSSN+',
      logOnly: !environment.settings.production
    })
  ]
})
export class AppStoreModule {}
