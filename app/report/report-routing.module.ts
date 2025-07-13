import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationGuard } from '../authorization.guard';
import { CanDeactivateGuard } from '../shared/guards/can-deactivate-guard.model';
import { PowerBiComponent } from './power-bi/power-bi.component';

const routes: Routes = [
  {
    path: '',
    component: PowerBiComponent,
    canActivate: [AuthorizationGuard],
    canDeactivate: [CanDeactivateGuard],
    data: {
      authorizationGuardPermissions: ['app.report.show']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule {}
