import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../shared/services/api/api.service';

import { MarketStructure } from './market-structure.model';

@Injectable()
export class MarketStructureService {
  constructor(private apiService: ApiService) {}

  create(marketStructure: MarketStructure): Observable<any> {
    return this.apiService.post(this.buildUrl(), {
      mainBusinessSiteId: marketStructure.mainBusinessSiteId,
      subBusinessSiteIds: marketStructure.subBusinessSiteIds
    });
  }

  update(marketStructure: MarketStructure): Observable<any> {
    return this.apiService.put(this.buildUrl(marketStructure.mainBusinessSiteId), {
      subBusinessSiteIds: marketStructure.subBusinessSiteIds
    });
  }

  delete(mainBusinessSiteId: string): Observable<any> {
    return this.apiService.delete(this.buildUrl(mainBusinessSiteId));
  }

  private buildUrl(mainBusinessSiteId?: string): string {
    return (
      '/structures/api/v1/market-structures' + (mainBusinessSiteId ? '/' + mainBusinessSiteId : '')
    );
  }
}
