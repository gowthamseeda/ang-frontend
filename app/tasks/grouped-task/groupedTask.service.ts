import { Injectable } from '@angular/core';
import { EntityCache } from '@ngrx/data';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { GroupedTask } from '../grouped-task.model';

import { GroupedTaskCollectionService } from './store/grouped-task-collection.service';

@Injectable({
  providedIn: 'root'
})
export class GroupedTaskService {
  constructor(
    private groupedTaskCollectionService: GroupedTaskCollectionService,
    private store: Store<EntityCache>
  ) {}

  fetchAllGroupedTasks(): void {
    this.groupedTaskCollectionService
      .getAll()
      .pipe(first())
      .subscribe(tasks => this.groupedTaskCollectionService.addAllToCache(tasks));
  }

  getAllGroupedTasks(): Observable<GroupedTask[]> {
    return this.store.pipe(select(this.groupedTaskCollectionService.selectAll()));
  }
}
