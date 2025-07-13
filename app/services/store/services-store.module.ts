import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { OfferedServiceEffects } from '../offered-service/store/offered-service.effects';
import { ServiceVariantEffects } from '../service-variant/store/service-variant.effects';
import { ServiceEffects } from '../service/store/service.effects';

import { reducers } from './state.model';

const featureEffects = [ServiceEffects, OfferedServiceEffects, ServiceVariantEffects];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('services', reducers),
    EffectsModule.forFeature(featureEffects)
  ]
})
export class ServicesStoreModule {}
