import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationGuard } from '../authorization.guard';
import { CanDeactivateGuard } from '../shared/guards/can-deactivate-guard.model';
import { KeyMaintenanceComponent } from './key-maintenance/container/key-maintenance/key-maintenance.component';

import { FileUploadStatusComponent } from './file-upload-status/container/file-upload-status.component';
import { MoveOutletComponent } from './move-outlet/container/move-outlet/move-outlet.component';
import { SwitchRegisteredOfficeComponent } from './switch-registered-office/container/switch-registered-office/switch-registered-office.component';

const routes: Routes = [
  {
    path: 'switch-registered-office',
    component: SwitchRegisteredOfficeComponent,
    canActivate: [AuthorizationGuard],
    canDeactivate: [CanDeactivateGuard],
    data: {
      authorizationGuardPermissions: ['legalstructure.admin.switchregisteredoffice.update']
    }
  },
  {
    path: 'move-outlet',
    component: MoveOutletComponent,
    canActivate: [AuthorizationGuard],
    canDeactivate: [CanDeactivateGuard],
    data: {
      authorizationGuardPermissions: ['legalstructure.admin.movebusinesssite.update']
    }
  },
  {
    path: 'file-upload-status',
    component: FileUploadStatusComponent
  },
  {
    path: 'external-keys-maintenance',
    component: KeyMaintenanceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
