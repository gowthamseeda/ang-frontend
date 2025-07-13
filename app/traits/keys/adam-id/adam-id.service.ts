import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ApiService } from '../../../shared/services/api/api.service';
import { Cache } from '../../../shared/util/cache';

import { AdamId } from './adam-id.model';

interface AdamIdsResource {
  adamIds: AdamId[];
}

@Injectable()
export class AdamIdService {
  private cache: Cache<AdamIdsResource>;

  constructor(private apiService: ApiService) {
    this.cache = new Cache<AdamIdsResource>(this.apiService, this.buildUrl);
  }

  get(outletId: string): Observable<AdamId[]> {
    return this.cache
      .getOrLoad(outletId)
      .asObservable()
      .pipe(
        map(adamIdResource => (adamIdResource ? adamIdResource.adamIds : [])),
        catchError(() => [])
      );
  }

  create(outletId: string, adamId: AdamId): Observable<any> {
    this.cache.clearFor(outletId);
    const brandToCreate = { adamId: adamId.adamId, brandId: adamId.brandId };
    return this.apiService.post(this.buildUrl(outletId), brandToCreate);
  }

  delete(outletId: string, brandId: string): Observable<any> {
    this.cache.clearFor(outletId);
    return this.apiService.delete(this.buildUrl(outletId) + '/' + brandId);
  }

  private buildUrl(outletId: string): string {
    return '/traits/api/v1/business-sites/' + outletId + '/adam-id';
  }
}
