import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HeaderModule } from '../main/header/header.module';
import { LayoutModule } from '../main/layout/layout.module';
import { MasterBrandModule } from '../master/brand/master-brand/master-brand.module';
import { SharedModule } from '../shared/shared.module';
import { TraitsSharedModule } from '../traits/shared/traits-shared.module';

import { GroupedTaskModule } from './grouped-task/groupedTask.module';
import { TaskDetailModule } from './task-detail/task-detail.module';
import { TaskModule } from './task/task.module';
import { TasksContainerComponent } from './tasks-container/tasks-container.component';
import { TasksTableComponent } from './tasks-container/tasks-table/tasks-table.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { TasksTileComponent } from '../tasks/tasks-tile/tasks-tile.component';

@NgModule({
  imports: [
    TasksRoutingModule,
    CommonModule,
    SharedModule,
    LayoutModule,
    HeaderModule,
    TaskModule,
    TraitsSharedModule,
    TaskDetailModule,
    GroupedTaskModule,
    MasterBrandModule
  ],
  exports: [
    TasksTileComponent
  ],
  declarations: [TasksContainerComponent, TasksTableComponent, TasksTileComponent]
})
export class TasksModule {}
