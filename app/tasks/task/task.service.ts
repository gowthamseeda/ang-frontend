import { Injectable } from '@angular/core';
import { EntityCache } from '@ngrx/data';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Task } from '../task.model';

import { TaskCollectionService } from './store/task-collection.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(
    private taskCollectionService: TaskCollectionService,
    private store: Store<EntityCache>
  ) {}

  fetchBy(taskId: number): Observable<any> {
    return this.taskCollectionService.getByKey(taskId);
  }

  getBy(taskId: number): Observable<Task> {
    return this.store.pipe(select(this.taskCollectionService.selectBy(taskId)));
  }
}
