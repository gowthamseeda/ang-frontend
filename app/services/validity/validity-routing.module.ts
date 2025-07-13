import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LegalStructureStoreInitializer } from '../../legal-structure/legal-structure-store.guard';
import { LegalStructureTestOutletGuard } from '../../legal-structure/legal-structure-test-outlet.guard';
import { BreadcrumbLevel, ServiceOffering } from '../../main/header/models/header.model';
import { CanDeactivateGuard } from '../../shared/guards/can-deactivate-guard.model';
import { StructuresStoreInitializer } from '../../structures/structures-store.guard';
import { OfferedServiceGuard } from '../offered-service.guard';
import { ServicesStoreInitializer } from '../services-store.guard';
import { ValidityMultiEditComponent } from './containers/validity-multi-edit/validity-multi-edit.component';

import { ValidityComponent } from './containers/validity/validity.component';
import { ValidityGuard } from './validity.guard';

const routes: Routes = [
  {
    path: '',
    component: ValidityComponent,
    canActivate: [
      ValidityGuard,
      LegalStructureStoreInitializer,
      ServicesStoreInitializer,
      StructuresStoreInitializer,
      OfferedServiceGuard,
      LegalStructureTestOutletGuard
    ],
    canDeactivate: [CanDeactivateGuard],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    data: {
      breadcrumb: {
        level: BreadcrumbLevel.SERVICE_OFFERING,
        offering: ServiceOffering.VALIDITY
      }
    }
  },
  {
    path: 'multi-edit',
    component: ValidityMultiEditComponent,
    canActivate: [
      ValidityGuard,
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
        offering: ServiceOffering.VALIDITY
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidityRoutingModule {}
