import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../shared/services/api/api.service';

import { DataRestriction } from './data-restriction.model';

const url = '/iam/api/v1/datarestrictions';

@Injectable({
  providedIn: 'root'
})
export class DataRestrictionService {
  constructor(private apiService: ApiService) {}

  get(dataRestrictionId: string): Observable<DataRestriction> {
    return this.apiService.get<DataRestriction>(url + '/' + dataRestrictionId);
  }

  getBusinessSiteIds(dataRestrictionId: string, item: string, limit: number): Observable<string[]> {
    return this.apiService.get<string[]>(
      url + '/' + dataRestrictionId + '/' + item + '?limit=' + limit
    );
  }
}
