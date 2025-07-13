import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LegalStructureStoreInitializer } from '../legal-structure/legal-structure-store.guard';
import { LegalStructureTestOutletGuard } from '../legal-structure/legal-structure-test-outlet.guard';

import { BreadcrumbLevel, ServiceOffering } from '../main/header/models/header.model';
import { ServicesStoreInitializer } from '../services/services-store.guard';
import { CanDeactivateGuard } from '../shared/guards/can-deactivate-guard.model';
import { StructuresStoreInitializer } from '../structures/structures-store.guard';

import { EditContractsComponent } from './container/edit-contracts/edit-contracts.component';
import { ContractsGuard } from './contracts.guard';

const routes: Routes = [
  {
    path: '',
    component: EditContractsComponent,
    canActivate: [
      ContractsGuard,
      LegalStructureStoreInitializer,
      ServicesStoreInitializer,
      StructuresStoreInitializer,
      LegalStructureTestOutletGuard
    ],
    canDeactivate: [CanDeactivateGuard],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    data: {
      breadcrumb: {
        level: BreadcrumbLevel.SERVICE_OFFERING,
        offering: ServiceOffering.CONTRACTS
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractsRoutingModule {}
