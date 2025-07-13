import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationGuard } from '../authorization.guard';
import { GeneralCommunicationComponent } from '../communication/container/general-communication/general-communication.component';
import { OutletHistoryComponent } from '../historization/container/outlet-history/outlet-history.component';
import { BreadcrumbLevel, OutletOffering } from '../main/header/models/header.model';
import { ServicesStoreInitializer } from '../services/services-store.guard';
import { CanDeactivateGuard } from '../shared/guards/can-deactivate-guard.model';
import { FeatureToggleGuard } from '../shared/guards/feature-toggle-guard.model';
import { FEATURE_NAMES } from '../shared/model/constants';
import { StructuresStoreInitializer } from '../structures/structures-store.guard';
import { EditKeysComponent } from '../traits/keys/edit-keys/edit-keys.component';
import { EditLabelsComponent } from '../traits/label/edit-labels/edit-labels.component';

import { ViewOutletComponent } from './businessSite/container/view-outlet/view-outlet.component';
import { CreateCompanyComponent } from './company/create-company/create-company.component';
import { EditLegalComponent } from './legal-information/container/edit-legal/edit-legal.component';
import { LegalInformationStoreGuard } from './legal-information/store/legal-information-store.guard';
import {
  companyPath,
  editGeneralCommunicationPath,
  editKeysPath,
  editLabelsPath,
  editLegalPath,
  editOutletPath,
  historizationPath,
  investorsPath,
  outletPath,
  outletRelationshipsPath,
  servicesPath,
  viewOutletPath
} from './legal-structure-routing-paths';
import { LegalStructureStoreInitializer } from './legal-structure-store.guard';
import { LegalStructureTestOutletGuard } from './legal-structure-test-outlet.guard';
import { OutletRelationshipsComponent } from './outlet-relationships/container/outlet-relationships/outlet-relationships.component';
import { CreateOutletComponent } from './outlet/create-outlet/create-outlet.component';
import { EditOutletComponent } from './outlet/edit-outlet/edit-outlet.component';

const routes: Routes = [
  {
    path: outletPath,
    component: CreateOutletComponent,
    canActivate: [AuthorizationGuard],
    canDeactivate: [CanDeactivateGuard],
    data: {
      authorizationGuardPermissions: ['legalstructure.businesssite.create']
    }
  },
  {
    path: companyPath,
    component: CreateCompanyComponent,
    canActivate: [AuthorizationGuard],
    canDeactivate: [CanDeactivateGuard],
    data: {
      authorizationGuardPermissions: ['legalstructure.company.create']
    }
  },
  {
    path: viewOutletPath,
    component: ViewOutletComponent,
    canActivate: [
      LegalStructureStoreInitializer,
      StructuresStoreInitializer,
      ServicesStoreInitializer,
      LegalStructureTestOutletGuard
    ],
    data: {
      breadcrumb: {
        level: BreadcrumbLevel.OUTLET
      }
    }
  },
  {
    path: editOutletPath,
    component: EditOutletComponent,
    canDeactivate: [CanDeactivateGuard],
    canActivate: [
      LegalStructureStoreInitializer,
      StructuresStoreInitializer,
      ServicesStoreInitializer,
      LegalStructureTestOutletGuard
    ],
    data: {
      breadcrumb: {
        level: BreadcrumbLevel.OUTLET_OFFERING,
        offering: OutletOffering.BASE_DATA
      }
    }
  },
  {
    path: editKeysPath,
    component: EditKeysComponent,
    canDeactivate: [CanDeactivateGuard],
    canActivate: [
      LegalStructureStoreInitializer,
      StructuresStoreInitializer,
      ServicesStoreInitializer,
      LegalStructureTestOutletGuard
    ],
    data: {
      breadcrumb: {
        level: BreadcrumbLevel.OUTLET_OFFERING,
        offering: OutletOffering.KEYS
      }
    }
  },
  {
    path: editLabelsPath,
    component: EditLabelsComponent,
    canDeactivate: [CanDeactivateGuard],
    canActivate: [
      AuthorizationGuard,
      LegalStructureStoreInitializer,
      StructuresStoreInitializer,
      ServicesStoreInitializer,
      LegalStructureTestOutletGuard
    ],
    data: {
      authorizationGuardBlockedPermissions: ['app.retail.hide'],
      breadcrumb: {
        level: BreadcrumbLevel.OUTLET_OFFERING,
        offering: OutletOffering.LABELS
      }
    }
  },
  {
    path: editLegalPath,
    component: EditLegalComponent,
    canDeactivate: [CanDeactivateGuard],
    canActivate: [
      LegalStructureStoreInitializer,
      LegalInformationStoreGuard,
      StructuresStoreInitializer,
      ServicesStoreInitializer,
      LegalStructureTestOutletGuard
    ],
    data: {
      breadcrumb: {
        level: BreadcrumbLevel.OUTLET_OFFERING,
        offering: OutletOffering.LEGAL_INFO
      }
    }
  },
  {
    path: editGeneralCommunicationPath,
    component: GeneralCommunicationComponent,
    canDeactivate: [CanDeactivateGuard],
    canActivate: [
      FeatureToggleGuard,
      LegalStructureStoreInitializer,
      ServicesStoreInitializer,
      StructuresStoreInitializer,
      LegalStructureTestOutletGuard
    ],
    data: {
      breadcrumb: {
        level: BreadcrumbLevel.OUTLET_OFFERING,
        offering: OutletOffering.GENERAL_COMMUNICATION
      }
    }
  },
  {
    path: outletRelationshipsPath,
    component: OutletRelationshipsComponent,
    canDeactivate: [CanDeactivateGuard],
    canActivate: [
      AuthorizationGuard,
      LegalStructureStoreInitializer,
      ServicesStoreInitializer,
      StructuresStoreInitializer,
      FeatureToggleGuard,
      LegalStructureTestOutletGuard
    ],
    data: {
      authorizationGuardPermissions: ['structures.outletrelationships.read'],
      featureToggleGuard: {
        featureName: FEATURE_NAMES.OUTLET_RELATIONSHIPS
      },
      breadcrumb: {
        level: BreadcrumbLevel.OUTLET_OFFERING,
        offering: OutletOffering.OUTLET_RELATIONSHIPS
      }
    }
  },
  {
    path: historizationPath,
    component: OutletHistoryComponent,
    canActivate: [
      LegalStructureStoreInitializer,
      ServicesStoreInitializer,
      StructuresStoreInitializer,
      FeatureToggleGuard,
      LegalStructureTestOutletGuard
    ],
    data: {
      featureToggleGuard: {
        featureName: FEATURE_NAMES.HISTORIZATION
      },
      breadcrumb: {
        level: BreadcrumbLevel.OUTLET_OFFERING,
        offering: OutletOffering.HISTORIZATION
      }
    }
  },
  {
    path: servicesPath,
    loadChildren: () => import('../services/services.module').then(m => m.ServicesModule)
  },
  {
    path: investorsPath,
    loadChildren: () => import('../investors/investors.module').then(m => m.InvestorsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LegalStructureRoutingModule {}
