import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../shared/services/api/api.service';
import { APISchedulerJob } from '../model/scheduler.model';

interface APISchedulerJobsResponse {
  jobs: APISchedulerJob[];
}

const url = '/scheduled-file-generator/api/v1/scheduler';

@Injectable()
export class ApiSchedulerService {
  constructor(private apiService: ApiService) {}

  getAll(): Observable<APISchedulerJob[]> {
    return this.apiService
      .get<APISchedulerJobsResponse>(`${url}/jobs`)
      .pipe(map(result => result.jobs));
  }

  create(job: APISchedulerJob): Observable<{ id: string }> {
    return this.apiService.post(`${url}/job`, job);
  }

  get(schedulerId: string): Observable<APISchedulerJob> {
    return this.apiService.get<APISchedulerJob>(`${url}/job/${schedulerId}`);
  }

  update(jobId: string, job: APISchedulerJob): Observable<any> {
    return this.apiService.put(`${url}/job/${jobId}`, job);
  }

  trigger(schedulerId: string): Observable<any> {
    return this.apiService.post(`${url}/job/${schedulerId}`, {});
  }

  abort(schedulerId: string): Observable<any> {
    return this.apiService.post(`${url}/job/${schedulerId}/abort`, {});
  }

  delete(schedulerId: string): Observable<any> {
    return this.apiService.delete(`${url}/job/${schedulerId}`, {});
  }
}
