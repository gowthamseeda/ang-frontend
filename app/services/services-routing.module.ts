import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LegalStructureStoreInitializer } from '../legal-structure/legal-structure-store.guard';
import { LegalStructureTestOutletGuard } from '../legal-structure/legal-structure-test-outlet.guard';
import { BreadcrumbLevel, OutletOffering } from '../main/header/models/header.model';
import { CanDeactivateGuard } from '../shared/guards/can-deactivate-guard.model';
import {
  DistributionLevelGuard,
  DistributionLevelGuardData
} from '../shared/guards/distribution-level-guard.model';
import { FeatureToggleGuard } from '../shared/guards/feature-toggle-guard.model';
import { StructuresStoreInitializer } from '../structures/structures-store.guard';

import { OfferedServiceGuard } from './offered-service.guard';
import { ServiceComponent } from './service/containers/service/service.component';
import { ServicesStoreInitializer } from './services-store.guard';
import { ServicesGuard } from './services.guard';

export const allowedServiceDistributionLevels = ['APPLICANT', 'RETAILER'];

const distributionLevelGuardData: DistributionLevelGuardData = {
  allowedDistributionLevels: allowedServiceDistributionLevels,
  outletIdParam: 'outletId'
};

const routeGuardsConfiguration = { distributionLevelGuard: distributionLevelGuardData };

const routes: Routes = [
  {
    path: '',
    component: ServiceComponent,
    canActivate: [
      FeatureToggleGuard,
      DistributionLevelGuard,
      LegalStructureStoreInitializer,
      ServicesStoreInitializer,
      StructuresStoreInitializer,
      LegalStructureTestOutletGuard
    ],
    canDeactivate: [CanDeactivateGuard],
    data: {
      ...routeGuardsConfiguration,
      breadcrumb: {
        level: BreadcrumbLevel.OUTLET_OFFERING,
        offering: OutletOffering.SERVICES
      }
    }
  },
  {
    path: 'validities',
    canActivate: [ServicesGuard],
    loadChildren: () => import('./validity/validity.module').then(m => m.ValidityModule)
  },
  {
    path: 'opening-hours',
    canActivate: [],
    loadChildren: () =>
      import('../opening-hours/opening-hours.module').then(m => m.OpeningHoursModule)
  },
  {
    path: 'contracts',
    canActivate: [ServicesGuard, OfferedServiceGuard],
    loadChildren: () => import('../contracts/contracts.module').then(m => m.ContractsModule)
  },
  {
    path: 'communication',
    canActivate: [],
    loadChildren: () =>
      import('../communication/communication.module').then(m => m.CommunicationModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule {}
