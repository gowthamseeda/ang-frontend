import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../../shared/services/api/api.service';
import {NewTaskDiff, TaskDiff, Status, Task, TaskDiffData, Type } from '../../task.model';

const url = '/tasks/api/v1/tasks';

export interface CreateTaskResource {
  businessSiteId: string,
  type: string,
  status: string,
  dataCluster: string,
  comment?: string,
  dueDate?: string,
  serviceIds: number[]
}

@Injectable()
export class TaskDataService extends DefaultDataService<Task> {
  constructor(
    private apiService: ApiService,
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator
  ) {
    super('Tasks', http, httpUrlGenerator);
  }

  getById(taskId: number): Observable<Task> {
    return this.apiService.get(`${url}/${taskId}`).pipe(
      map((task: Task) => {
        let taskDiff = task?.diff as TaskDiff | NewTaskDiff
        if (taskDiff?.old instanceof Array && taskDiff?.new instanceof Array) {
          return {
            ...task,
            diff: {
              old: this.sort(taskDiff?.old),
              new: this.sort(taskDiff?.new)
            }
          };
        }
        return task;
      })
    );
  }

  createOpeningHoursVerificationTaskByServiceId(
    businessSiteId: string,
    serviceIds: number[],
    comment?: string,
    dueDate?: string
  ): Observable<any> {
    const newTask: CreateTaskResource = {
      businessSiteId: businessSiteId,
      type: Type.DATA_VERIFICATION,
      status: Status.OPEN,
      dataCluster: "OPENING_HOURS",
      comment: comment,
      dueDate: dueDate,
      serviceIds: serviceIds
    }

    return this.apiService.post(`${url}/opening-hours-verification`, newTask)
  }

  getOpenOpeningHoursVerificationTaskByServiceId(
    businessSiteId: string,
    serviceId: number
  ): Observable<any> {
    return this.apiService.get(`/tasks/api/v1/business-sites/${businessSiteId}` +
      `/tasks?dataClusters=OPENING_HOURS&type=DATA_VERIFICATION&status=OPEN&tag=serviceId%3A${serviceId}`)
  }

  private sort(taskDiffData: TaskDiffData | undefined): TaskDiffData {
    return taskDiffData?.sort((a: any, b: any) => {
      if (a.offeredServiceId && !b.offeredServiceId) {
        return 1;
      } else if (!a.offeredServiceId && b.offeredServiceId) {
        return -1;
      } else {
        return 0;
      }
    });
  }
}
