import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../shared/services/api/api.service';
import { GroupedTask, GroupedTaskResponse } from '../../grouped-task.model';

const url = '/tasks/api/v1/tasks';

@Injectable({
  providedIn: 'root'
})
export class GroupedTaskDataService extends DefaultDataService<GroupedTask> {
  constructor(
    private apiService: ApiService,
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator
  ) {
    super('GroupedTasks', http, httpUrlGenerator);
  }

  getAll(): Observable<GroupedTask[]> {
    return this.apiService
      .get<GroupedTaskResponse>(`${url}`)
      .pipe(map(response => response.groupedTasks));
  }
}
