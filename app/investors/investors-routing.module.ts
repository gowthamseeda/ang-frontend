import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LegalStructureStoreInitializer } from '../legal-structure/legal-structure-store.guard';
import { LegalStructureTestOutletGuard } from '../legal-structure/legal-structure-test-outlet.guard';
import { BreadcrumbLevel, OutletOffering } from '../main/header/models/header.model';
import { ServicesStoreInitializer } from '../services/services-store.guard';
import { StructuresStoreInitializer } from '../structures/structures-store.guard';

import { InvesteeContainerComponent } from './investee-container/investee-container.component';

const routes: Routes = [
  {
    path: '',
    component: InvesteeContainerComponent,
    canActivate: [
      LegalStructureStoreInitializer,
      ServicesStoreInitializer,
      StructuresStoreInitializer,
      LegalStructureTestOutletGuard
    ],
    data: {
      breadcrumb: {
        level: BreadcrumbLevel.OUTLET_OFFERING,
        offering: OutletOffering.SHAREHOLDER
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestorsRoutingModule {}
