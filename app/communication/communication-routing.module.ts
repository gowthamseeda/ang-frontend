import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LegalStructureStoreInitializer } from '../legal-structure/legal-structure-store.guard';
import { LegalStructureTestOutletGuard } from '../legal-structure/legal-structure-test-outlet.guard';
import { BreadcrumbLevel, ServiceOffering } from '../main/header/models/header.model';
import { ServicesStoreInitializer } from '../services/services-store.guard';
import { CanDeactivateGuard } from '../shared/guards/can-deactivate-guard.model';
import { StructuresStoreInitializer } from '../structures/structures-store.guard';
import { CommunicationGuard } from './communication.guard';

import { ServiceCommunicationComponent } from './container/service-communication/service-communication.component';
import { ServiceCommunicationMultiEditComponent } from './container/service-communication-multi-edit/service-communication-multi-edit.component';

const routes: Routes = [
  {
    path: '',
    component: ServiceCommunicationComponent,
    canActivate: [
      CommunicationGuard,
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
        offering: ServiceOffering.COMMUNICATION
      }
    }
  },
  {
    path: 'multi-edit',
    component: ServiceCommunicationMultiEditComponent,
    canActivate: [
      CommunicationGuard,
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
        offering: ServiceOffering.COMMUNICATION
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunicationRoutingModule {}
