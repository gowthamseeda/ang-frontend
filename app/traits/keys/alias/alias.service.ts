import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../shared/services/api/api.service';
import { Cache } from '../../../shared/util/cache';

interface AliasResource {
  alias?: string;
}

const BASE_URL = '/traits/api/v1/business-sites/';

@Injectable()
export class AliasService {
  private cache: Cache<AliasResource>;

  constructor(private apiService: ApiService) {
    this.cache = new Cache<AliasResource>(this.apiService, this.getUrl);
  }

  get(outletId: string): Observable<AliasResource> {
    return this.cache.getOrLoad(outletId).asObservable();
  }

  update(businessSiteId: string, alias: AliasResource): Observable<any> {
    this.cache.clearFor(businessSiteId);
    return this.apiService.put(this.updateUrl(businessSiteId), {
      alias: alias.alias
    });
  }

  delete(businessSiteId: string): Observable<any> {
    this.cache.clearFor(businessSiteId);
    return this.apiService.delete(this.deleteUrl(businessSiteId));
  }

  private getUrl(businessSiteId: string): string {
    return BASE_URL + businessSiteId + '/alias';
  }

  private updateUrl(businessSiteId: string): string {
    return BASE_URL + businessSiteId + '/alias';
  }

  private deleteUrl(businessSiteId: string): string {
    return BASE_URL + businessSiteId + '/alias';
  }
}
