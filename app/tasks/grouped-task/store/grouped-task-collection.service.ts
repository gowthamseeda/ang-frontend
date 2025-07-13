import { Injectable } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';

import { GroupedTask } from '../../grouped-task.model';

@Injectable({
  providedIn: 'root'
})
export class GroupedTaskCollectionService extends EntityCollectionServiceBase<GroupedTask> {
  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('GroupedTasks', serviceElementsFactory);
  }

  selectAll(): MemoizedSelector<Object, GroupedTask[], DefaultProjectorFn<GroupedTask[]>> {
    return this.selectors.selectEntities;
  }
}
