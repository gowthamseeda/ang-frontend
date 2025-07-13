import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaskDetailContainerComponent } from './task-detail-container/task-detail-container.component';

const routes: Routes = [
  {
    path: '',
    component: TaskDetailContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskDetailRoutingModule {}
