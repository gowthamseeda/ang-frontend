import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LegalStructureModule } from 'app/legal-structure/legal-structure.module';

import { HeaderModule } from '../main/header/header.module';
import { LayoutModule } from '../main/layout/layout.module';
import { SearchModule } from '../search/search.module';
import { ServicesSharedModule } from '../services/shared/services-shared.module';
import { MaterialModule } from '../shared/material/material.module';
import { SharedModule } from '../shared/shared.module';
import { StructuresModule } from '../structures/structures.modules';

import { EditContractsComponent } from './container/edit-contracts/edit-contracts.component';
import { ContractsRoutingModule } from './contracts-routing.module';
import { ContractPartnerInfoComponent } from './presentational/contract-partner-info/contract-partner-info.component';
import { ContractPartnerSearchComponent } from './presentational/contract-partner-search/contract-partner-search.component';
import { ContractsEffects } from './store/contracts.effects';
import * as fromContractsState from './store/reducers/index';

@NgModule({
  declarations: [
    EditContractsComponent,
    ContractPartnerSearchComponent,
    ContractPartnerInfoComponent
  ],
  imports: [
    StoreModule.forFeature(fromContractsState.featureKey, fromContractsState.reducers),
    EffectsModule.forFeature([ContractsEffects]),
    ContractsRoutingModule,
    CommonModule,
    SharedModule,
    LayoutModule,
    LegalStructureModule,
    SearchModule,
    ServicesSharedModule,
    MaterialModule,
    HeaderModule,
    StructuresModule
  ]
})
export class ContractsModule {}
