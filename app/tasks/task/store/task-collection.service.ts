import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { createSelector, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';

import { Task } from '../../task.model';

@Injectable()
export class TaskCollectionService extends EntityCollectionServiceBase<Task> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Tasks', serviceElementsFactory);
  }

  selectBy(taskId: number): MemoizedSelector<Object, Task, DefaultProjectorFn<Task>> {
    return createSelector(this.selectors.selectEntityMap, tasks => {
      const task = tasks[taskId];

      if (!task) {
        throw new Error('NOT_FOUND');
      }
      return task;
    });
  }
}
