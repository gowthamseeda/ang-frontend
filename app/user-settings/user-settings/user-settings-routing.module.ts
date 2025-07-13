import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CanDeactivateGuard } from '../../shared/guards/can-deactivate-guard.model';

import { EditUserSettingsComponent } from './container/edit-user-settings/edit-user-settings.component';

const routes: Routes = [
  {
    path: '',
    component: EditUserSettingsComponent,
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSettingsRoutingModule {}
