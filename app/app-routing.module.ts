import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { DashboardComponent } from './main/dashboard/dashboard.component';
import { LogoutComponent } from './main/logout/logout.component';
import { CustomSerializer } from './router-serializer';
import { CanDeactivateGuard } from './shared/guards/can-deactivate-guard.model';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'logout',
    component: LogoutComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'outlet',
    loadChildren: () =>
      import('./legal-structure/legal-structure.module').then(m => m.LegalStructureModule)
  },
  {
    path: 'structures',
    loadChildren: () => import('./structures/structures.modules').then(m => m.StructuresModule)
  },
  {
    path: 'scheduler',
    loadChildren: () => import('./scheduler/scheduler.module').then(m => m.SchedulerModule)
  },
  {
    path: 'master',
    loadChildren: () => import('./master/master.module').then(m => m.MasterModule)
  },
  {
    path: 'iam',
    loadChildren: () => import('./iam/iam.module').then(m => m.IamModule)
  },
  {
    path: 'tasks',
    loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./help/help.module').then(m => m.HelpModule)
  },
  {
    path: 'email-settings',
    loadChildren: () =>
      import('./notifications/notifications.module').then(m => m.NotificationsModule)
  },
  {
    path: 'user-settings',
    loadChildren: () =>
      import('./user-settings/user-settings.module').then(m => m.UserSettingsModule)
  },
  {
    path: 'reporting',
    loadChildren: () => import('./report/report.module').then(m => m.ReportModule)
  },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    }),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomSerializer
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
