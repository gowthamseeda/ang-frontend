import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, retryWhen } from 'rxjs/operators';

import { ApiService } from '../../../shared/services/api/api.service';
import { delayedRetryStrategy } from '../../../shared/util/delayed-retry-strategy';
import { OutletRelationship, OutletRelationships } from '../models/outlet-relationships.model';

const url = '/structures/api/v1/business-sites';

@Injectable()
export class OutletRelationshipsService {
  constructor(private apiService: ApiService) {}

  get(businessSiteId: string): Observable<OutletRelationship[]> {
    return this.apiService
      .get<OutletRelationships>(url + `/${businessSiteId}` + '/outlet-relationships')
      .pipe(
        retryWhen(delayedRetryStrategy()),
        map(response => response.outletRelationships || [])
      );
  }

  update(businessSiteId: string, outletRelationships: OutletRelationships): Observable<any> {
    return this.apiService.put(
      url + `/${businessSiteId}` + '/outlet-relationships',
      outletRelationships
    );
  }
}
