import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationGuard } from '../authorization.guard';

import { ApiSchedulerComponent } from './container/api-scheduler/api-scheduler.component';
import { EditXmlSchedulerComponent } from './container/edit-xml-scheduler/edit-xml-scheduler.component';
import { SchedulerComponent } from './container/scheduler/scheduler.component';

const routes: Routes = [
  {
    path: 'xml/:jobId/edit',
    component: EditXmlSchedulerComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: [
        'gssnplusxmlscheduler.scheduler.read',
        'gssnplusxmlscheduler.scheduler.update'
      ]
    }
  },
  {
    path: 'api/:jobId/edit',
    component: ApiSchedulerComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: [
        'scheduledfilegenerator.scheduler.read',
        'scheduledfilegenerator.scheduler.update'
      ]
    }
  },
  {
    path: 'api/create',
    component: ApiSchedulerComponent,
    canActivate: [AuthorizationGuard],
    data: {
      isCreate: true,
      authorizationGuardPermissions: [
        'scheduledfilegenerator.scheduler.read',
        'scheduledfilegenerator.scheduler.update'
      ]
    }
  },
  {
    path: '',
    component: SchedulerComponent,
    canActivate: [AuthorizationGuard],
    data: {
      authorizationGuardPermissions: ['app.scheduler.show']
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulerRoutingModule {}
