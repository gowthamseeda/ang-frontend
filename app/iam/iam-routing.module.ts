import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationGuard } from '../authorization.guard';
import { IAMManagementComponent } from './iam-management/iam-management.component';

import { UserDataRestrictionsComponent } from './user-data-restrictions/user-data-restrictions.component';

const routes: Routes = [
  {
    path: '',
    component: IAMManagementComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['iam.userdatarestriction.read']
    }
  },
  {
    path: ':userId',
    component: UserDataRestrictionsComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['iam.userdatarestriction.read']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IamRoutingModule {}
