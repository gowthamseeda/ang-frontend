import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retryWhen } from 'rxjs/operators';

import { ApiService } from '../../../shared/services/api/api.service';
import { delayedRetryStrategy } from '../../../shared/util/delayed-retry-strategy';
import { OutletStructureResource } from '../model/outlet-structure-api.model';

@Injectable()
export class OutletStructureApiService {
  constructor(private apiService: ApiService) {}

  get(outletId: string): Observable<OutletStructureResource> {
    return this.apiService
      .get<OutletStructureResource>(this.buildUrl(outletId))
      .pipe(retryWhen(delayedRetryStrategy()));
  }

  private buildUrl(outletId: string): string {
    return '/structures/api/v1/outlet-structures/' + outletId;
  }
}
