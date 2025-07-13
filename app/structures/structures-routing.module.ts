import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationGuard } from '../authorization.guard';
import { CanDeactivateGuard } from '../shared/guards/can-deactivate-guard.model';

import { AddDealerGroupComponent } from './dealer-groups/container/add-dealer-group/add-dealer-group.component';
import { DealerGroupsComponent } from './dealer-groups/container/dealer-groups/dealer-groups.component';
import { EditDealerGroupComponent } from './dealer-groups/container/edit-dealer-group/edit-dealer-group.component';
import { AddGeneralGroupComponent } from './general-groups/container/add-general-group/add-general-group.component';
import { EditGeneralGroupComponent } from './general-groups/container/edit-general-group/edit-general-group.component';
import { GeneralGroupsComponent } from './general-groups/container/general-groups/general-groups.component';
import { MarketAreasComponent } from './market-area/container/market-areas/market-areas.component';
import { ViewRegionalCentersComponent } from './regional-center/container/view-regional-centers/view-regional-centers.component';
import { RegionalCenterStoreGuard } from './regional-center/store/region-center-store.guard';

const routes: Routes = [
  {
    path: 'market-area',
    component: MarketAreasComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['structures.marketareas.read'],
      authorizationGuardBlockedPermissions: ['app.retail.hide']
    }
  },
  {
    path: 'general-groups',
    component: GeneralGroupsComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['structures.generalgroups.read'],
      authorizationGuardBlockedPermissions: ['app.retail.hide']
    }
  },
  {
    path: 'general-groups/add',
    component: AddGeneralGroupComponent,
    canDeactivate: [CanDeactivateGuard],
    data: {
      authorizationGuardPermissions: ['structures.generalgroups.create']
    }
  },
  {
    path: 'general-groups/:generalGroupId/edit',
    component: EditGeneralGroupComponent,
    canDeactivate: [CanDeactivateGuard],
    data: {
      authorizationGuardPermissions: ['structures.generalgroups.update']
    }
  },
  {
    path: 'regional-center',
    component: ViewRegionalCentersComponent,
    canActivate: [AuthorizationGuard, RegionalCenterStoreGuard],
    data: {
      authorizationGuardPermissions: ['structures.regionalcenter.read'],
      authorizationGuardBlockedPermissions: ['app.retail.hide']
    }
  },
  {
    path: 'dealer-groups',
    component: DealerGroupsComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['structures.dealergroups.read'],
      authorizationGuardBlockedPermissions: ['app.retail.hide']
    }
  },
  {
    path: 'dealer-groups/add',
    component: AddDealerGroupComponent,
    canDeactivate: [CanDeactivateGuard],
    data: {
      authorizationGuardPermissions: ['structures.dealergroups.add'],
      authorizationGuardBlockedPermissions: ['app.retail.hide']
    }
  },
  {
    path: 'dealer-groups/:dealerGroupId/edit',
    component: EditDealerGroupComponent,
    canDeactivate: [CanDeactivateGuard],
    data: {
      authorizationGuardPermissions: ['structures.dealergroups.update']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StructuresRoutingModule {}
