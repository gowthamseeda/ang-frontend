import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EntityDataService, EntityDefinitionService } from '@ngrx/data';

import { SharedModule } from '../../shared/shared.module';

import { GroupedTaskService } from './groupedTask.service';
import { GroupedTaskCollectionService } from './store/grouped-task-collection.service';
import { GroupedTaskDataService } from './store/grouped-task-data.service';
import { groupedTaskEntityMetadata } from './store/grouped-task-entity-metadata';

@NgModule({
  imports: [CommonModule, SharedModule],
  providers: [GroupedTaskCollectionService, GroupedTaskDataService, GroupedTaskService]
})
export class GroupedTaskModule {
  constructor(
    entityDefinitionService: EntityDefinitionService,
    entityDataService: EntityDataService,
    groupedTaskDataService: GroupedTaskDataService
  ) {
    entityDefinitionService.registerMetadataMap(groupedTaskEntityMetadata);
    entityDataService.registerService('GroupedTasks', groupedTaskDataService);
  }
}
