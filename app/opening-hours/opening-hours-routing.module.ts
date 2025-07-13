import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LegalStructureStoreInitializer } from '../legal-structure/legal-structure-store.guard';
import { LegalStructureTestOutletGuard } from '../legal-structure/legal-structure-test-outlet.guard';
import { BreadcrumbLevel, ServiceOffering } from '../main/header/models/header.model';
import { allowedServiceDistributionLevels } from '../services/services-routing.module';
import { ServicesStoreInitializer } from '../services/services-store.guard';
import { CanDeactivateGuard } from '../shared/guards/can-deactivate-guard.model';
import {
  DistributionLevelGuard,
  DistributionLevelGuardData
} from '../shared/guards/distribution-level-guard.model';
import { FeatureToggleGuard } from '../shared/guards/feature-toggle-guard.model';
import { StructuresStoreInitializer } from '../structures/structures-store.guard';

import { EditOpeningHoursComponent } from './container/edit-opening-hours/edit-opening-hours.component';
import { OpeningHoursMultiEditComponent } from './container/opening-hours-multi-edit/opening-hours-multi-edit.component';
import { OpeningHoursStoreInitializer } from './opening-hours.store.guard';

const distributionLevelGuard: DistributionLevelGuardData = {
  allowedDistributionLevels: allowedServiceDistributionLevels,
  outletIdParam: 'outletId'
};

const routes: Routes = [
  {
    path: '',
    component: EditOpeningHoursComponent,
    canActivate: [
      FeatureToggleGuard,
      DistributionLevelGuard,
      LegalStructureStoreInitializer,
      ServicesStoreInitializer,
      OpeningHoursStoreInitializer,
      StructuresStoreInitializer,
      LegalStructureTestOutletGuard
    ],
    canDeactivate: [CanDeactivateGuard],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    data: {
      distributionLevelGuard,
      breadcrumb: {
        level: BreadcrumbLevel.SERVICE_OFFERING,
        offering: ServiceOffering.OPENING_HOURS
      }
    }
  },
  {
    path: 'multi-edit',
    component: OpeningHoursMultiEditComponent,
    canActivate: [
      FeatureToggleGuard,
      DistributionLevelGuard,
      LegalStructureStoreInitializer,
      ServicesStoreInitializer,
      StructuresStoreInitializer,
      LegalStructureTestOutletGuard
    ],
    canDeactivate: [CanDeactivateGuard],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    data: {
      distributionLevelGuard,
      breadcrumb: {
        level: BreadcrumbLevel.SERVICE_OFFERING,
        offering: ServiceOffering.OPENING_HOURS
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpeningHoursRoutingModule {}
