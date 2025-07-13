import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../shared/services/api/api.service';
import { XMLSchedulerJob } from '../model/scheduler.model';

interface XMLSchedulerJobsResponse {
  jobs: XMLSchedulerJob[];
}

const url = '/gssnplus-xml-scheduler/api/v1/scheduler';

@Injectable()
export class XmlSchedulerService {
  constructor(private apiService: ApiService) {}

  getAll(): Observable<XMLSchedulerJob[]> {
    return this.apiService
      .get<XMLSchedulerJobsResponse>(`${url}/job`)
      .pipe(map(result => result.jobs));
  }

  get(schedulerId: string): Observable<XMLSchedulerJob> {
    return this.apiService.get<XMLSchedulerJob>(`${url}/job/${schedulerId}`);
  }

  update(jobId: string, job: XMLSchedulerJob): Observable<any> {
    return this.apiService.put(`${url}/job/${jobId}`, job);
  }

  trigger(schedulerId: string): Observable<any> {
    return this.apiService.post(`${url}/generate-xml?type=${schedulerId}`, {});
  }

  abort(schedulerId: string): Observable<any> {
    return this.apiService.post(`${url}/abort?type=${schedulerId}`, {});
  }
}
