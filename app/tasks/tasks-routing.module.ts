import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from '../shared/guards/feature-toggle-guard.model';

import { TasksContainerComponent } from './tasks-container/tasks-container.component';
import { TasksGuard } from './tasks.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [TasksGuard, FeatureToggleGuard],
    component: TasksContainerComponent
  },
  {
    path: ':taskId',
    canActivate: [TasksGuard, FeatureToggleGuard],
    loadChildren: () => import('./task-detail/task-detail.module').then(m => m.TaskDetailModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule {}
