import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, take } from 'rxjs/operators';

import { UserAuthorizationService } from '../../iam/user/user-authorization.service';
import { ApiService } from '../../shared/services/api/api.service';
import { ObjectStatus } from '../../shared/services/api/objectstatus.model';
import {
  ChangeTaskStatusesResource,
  DataCluster,
  DataVerificationFields,
  Status,
  Task,
  TaskRequest,
  TasksResponse,
  Type
} from '../task.model';

const url = '/tasks/api/v1';

export interface TaskQueryParams {
  dataClusters?: DataCluster[] | DataCluster | null;
  status?: Status;
  type?: Type;
  tag?: string;
  aggregateNames?: string[] | string;
  aggregateField?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BusinessSiteTaskService {
  constructor(
    private apiService: ApiService,
    private userAuthorizationService: UserAuthorizationService
  ) {
  }

  createTask(task: TaskRequest): Observable<ObjectStatus> {
    return this.apiService.post(`${url}/tasks`, task);
  }

  getBy(outletId: string, params: TaskQueryParams = {}): Observable<Task[]> {
    return this.userAuthorizationService.isAuthorizedFor
      .permissions(['tasks.task.filter.read'])
      .verify()
      .pipe(
        take(1),
        mergeMap(hasPermission => {
          if (!hasPermission) {
            return of([]);
          }
          return this.apiService
            .get<TasksResponse>(
              `${url}/business-sites/${outletId}/tasks`,
              this.getHttpQueryParamsForTasks(params)
            )
            .pipe(map(response => response?.tasks || []));
        })
      );
  }

  existsFor(outletId: string, params: TaskQueryParams = {}): Observable<boolean> {
    return this.getBy(outletId, params).pipe(map(tasks => tasks.length > 0));
  }

  existsOpenDataChangeFor(
    outletId: string,
    dataClusters?: DataCluster[],
    tag?: string | null,
    aggregateNames?: string[],
    aggregateField?: string
  ): Observable<boolean> {
    const params: TaskQueryParams = {
      type: Type.DATA_CHANGE,
      dataClusters,
      status: Status.OPEN,
      aggregateNames,
      aggregateField
    };
    return this.getBy(outletId, tag ? { ...params, tag } : params).pipe(
      map(tasks => tasks.length > 0),
      catchError(() => {
        return of(false);
      })
    );
  }

  existsOpenVerificationTaskFor(
    outletId: string,
    dataClusters?: DataCluster[] | DataCluster | null,
    aggregateNames?: string[] | string,
    aggregateField?: string
  ): Observable<boolean> {
    const params: TaskQueryParams = {
      type: Type.DATA_VERIFICATION,
      dataClusters,
      status: Status.OPEN,
      aggregateNames,
      aggregateField
    };
    return this.getBy(outletId, params).pipe(map(tasks => tasks.length > 0));
  }

  getByOutletId(outletId: string): Observable<Task[]> {
    return this.userAuthorizationService.isAuthorizedFor
      .permissions(['tasks.task.read'])
      .verify()
      .pipe(
        take(1),
        mergeMap(hasPermission => {
          if (!hasPermission) {
            return of([]);
          }
          return this.apiService
            .get<TasksResponse>(`${url}/business-sites/${outletId}`)
            .pipe(map(response => response?.tasks || []));
        })
      );
  }

  updateStatus(taskId: number, taskStatus: Status, comment?: string): Observable<any> {
    return this.apiService.put(`${url}/tasks/${taskId}/status`, { taskStatus, comment });
  }

  findAllDataVerificationFields(): Observable<DataVerificationFields> {
    return this.apiService.get<DataVerificationFields>(`${url}/tasks/data-verification-fields`);
  }

  private getHttpQueryParamsForTasks(params: TaskQueryParams): HttpParams {
    return Object.keys(params).reduce((httpParams: HttpParams, param) => {
      if (params[param] != undefined) {
        return httpParams.append(param, params[param]);
      } else {
        return httpParams;
      }
    }, new HttpParams());
  }

  getOpenStatusForDataChangeTask(
    outletId: string,
    dataClusters?: DataCluster[],
    tag?: string | null,
    aggregateNames?: string[],
    aggregateField?: string
  ): Observable<Task[]> {
    const params: TaskQueryParams = {
      type: Type.DATA_CHANGE,
      dataClusters,
      status: Status.OPEN,
      aggregateNames,
      aggregateField
    };
    return this.getBy(outletId, tag ? { ...params, tag } : params);
  }

  getOpenStatusForDataVerificationTask(
    outletId: string,
    dataClusters?: DataCluster[],
    aggregateNames?: string[],
    aggregateField?: string
  ): Observable<Task[]> {
    const params: TaskQueryParams = {
      type: Type.DATA_VERIFICATION,
      dataClusters,
      status: Status.OPEN,
      aggregateNames,
      aggregateField
    };
    return this.getBy(outletId, params);
  }
  updateTasks(tasks: ChangeTaskStatusesResource[]){
    return this.apiService.patch(`${url}/tasks/status`, tasks);
  }
}
