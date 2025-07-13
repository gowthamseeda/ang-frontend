import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../shared/services/api/api.service';
import { Cache } from '../../../shared/util/cache';

interface FederalIdResource {
  federalId?: string;
}

export interface DuplicateFederalIdResource {
  businessSiteId: string;
  federalId: string;
}

export interface DuplicateFederalIdsResource {
  duplicateFederalIds: DuplicateFederalIdResource[];
}

const BASE_URL = '/traits/api/v1/business-sites/';

@Injectable()
export class FederalIdService {
  private cache: Cache<FederalIdResource>;

  constructor(private apiService: ApiService) {
    this.cache = new Cache<FederalIdResource>(this.apiService, this.getUrl);
  }

  get(outletId: string): Observable<FederalIdResource> {
    return this.cache.getOrLoad(outletId).asObservable();
  }

  getDuplicateFederalIdsBy(outletId: string): Observable<DuplicateFederalIdsResource> {
    return this.apiService.get<DuplicateFederalIdsResource>(
      this.getDuplicateFederalIdsUrl(outletId)
    );
  }

  update(businessSiteId: string, federalId: FederalIdResource): Observable<any> {
    this.cache.clearFor(businessSiteId);
    return this.apiService.put(this.updateUrl(businessSiteId), {
      federalId: federalId.federalId
    });
  }

  delete(businessSiteId: string): Observable<any> {
    this.cache.clearFor(businessSiteId);
    return this.apiService.delete(this.deleteUrl(businessSiteId));
  }

  private getUrl(businessSiteId: string): string {
    return BASE_URL + businessSiteId + '/federal-id';
  }

  private getDuplicateFederalIdsUrl(outletId: string): string {
    return BASE_URL + outletId + '/duplicate-federal-ids';
  }

  private updateUrl(businessSiteId: string): string {
    return BASE_URL + businessSiteId + '/federal-id';
  }

  private deleteUrl(businessSiteId: string): string {
    return BASE_URL + businessSiteId + '/federal-id';
  }
}
