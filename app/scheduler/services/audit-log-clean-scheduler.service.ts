import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {ApiService} from '../../shared/services/api/api.service';
import {AuditLogCleanSchedulerJob, AuditLogCleanSchedulerStatus} from '../model/scheduler.model';

interface AuditLogCleanSchedulerJobsResponse {
  jobs: AuditLogCleanSchedulerJob[];
}

interface AuditLogCleanSchedulerStatusResponse {
  jobs: AuditLogCleanSchedulerStatus[]
}

const iamAuditLogUrl = '/iam/api/v1/audit-log';
const taskSchedulerUrl = '/tasks/api/v1/tasks/task-house-keeping-log';

@Injectable()
export class AuditLogCleanSchedulerService {
  constructor(private apiService: ApiService) {
  }

  getAll(): Observable<AuditLogCleanSchedulerJob[]> {
    return this.apiService
      .get<AuditLogCleanSchedulerJobsResponse>(`${iamAuditLogUrl}/housekeepingstatus`)
      .pipe(map(result => result.jobs));
  }

  getAllCleanSchedulerStatus(): Observable<AuditLogCleanSchedulerStatus[]> {
    return this.apiService
      .get<AuditLogCleanSchedulerStatusResponse>(taskSchedulerUrl)
      .pipe(map(result => {
          if (result !== null)
            return result.jobs
          else
            return []
        }
      ));
  }
}
