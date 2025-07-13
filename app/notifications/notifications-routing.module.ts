import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from '../shared/guards/feature-toggle-guard.model';

import { NotificationsGuard } from './notifications.guard';
import { RetailEmailComponent } from './container/retail-email/retail-email.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [NotificationsGuard, FeatureToggleGuard],
    data: {
      featureToggleGuard: {
        featureName: 'LINK_TO_RETAIL_EMAIL_SETTING'
      }
    },
    component: RetailEmailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule {}
