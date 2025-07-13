import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retryWhen } from 'rxjs/operators';

import { ApiService } from '../../shared/services/api/api.service';
import { delayedRetryStrategy } from '../../shared/util/delayed-retry-strategy';
import { DealerGroup, DealerGroups } from '../models/dealer-group.model';

const url = '/structures/api/v1/dealer-groups';

@Injectable()
export class DealerGroupsService {
  constructor(private apiService: ApiService) {}

  getAll(): Observable<DealerGroups> {
    return this.apiService.get<DealerGroups>(url).pipe(retryWhen(delayedRetryStrategy()));
  }

  get(dealerGroupId: string): Observable<DealerGroup> {
    return this.apiService
      .get<DealerGroup>(url + `/${dealerGroupId}`)
      .pipe(retryWhen(delayedRetryStrategy()));
  }

  update(dealerGroupId: string, dealerGroup: DealerGroupPutResource): Observable<any> {
    return this.apiService.put(url + `/${dealerGroupId}`, dealerGroup);
  }

  create(dealerGroup: DealerGroupPostResource): Observable<any> {
    return this.apiService.post(url, dealerGroup);
  }
}

interface DealerGroupPutResource {
  name: string;
  active: boolean;
  headquarterId: string;
  successGroupId?: string;
  members?: string[];
}

interface DealerGroupPostResource {
  id?: string;
  name: string;
  active: boolean;
  headquarterId: string;
  successGroupId?: string;
  members?: string[];
}
