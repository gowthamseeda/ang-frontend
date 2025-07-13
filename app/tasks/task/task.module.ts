import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EntityDataService, EntityDefinitionService } from '@ngrx/data';

import { SharedModule } from '../../shared/shared.module';

import { TaskCollectionService } from './store/task-collection.service';
import { TaskDataService } from './store/task-data.service';
import { taskEntityMetadata } from './store/task-entity-metadata';
import { TaskService } from './task.service';

@NgModule({
  imports: [CommonModule, SharedModule],
  providers: [TaskCollectionService, TaskDataService, TaskService]
})
export class TaskModule {
  constructor(
    entityDefinitionService: EntityDefinitionService,
    entityDataService: EntityDataService,
    taskDataService: TaskDataService
  ) {
    entityDefinitionService.registerMetadataMap(taskEntityMetadata);
    entityDataService.registerService('Tasks', taskDataService);
  }
}
