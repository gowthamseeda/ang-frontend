import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../../shared/services/api/api.service';

import { MasterCountryGroup } from './master-country-group.model';

const url = '/geography/api/v1/country-groups';

export interface MasterCountryGroupsResponse {
  countryGroups: MasterCountryGroup[];
}

@Injectable()
export class MasterCountryGroupService {
  constructor(private apiService: ApiService) {}

  get(id: string): Observable<MasterCountryGroup> {
    return this.apiService.get<MasterCountryGroup>(url + '/' + id);
  }

  getAll(): Observable<MasterCountryGroup[]> {
    return this.apiService
      .get<MasterCountryGroupsResponse>(url)
      .pipe(map(response => response.countryGroups));
  }

  create(countryGroup: MasterCountryGroup): Observable<any> {
    return this.apiService.post(url, countryGroup);
  }

  delete(id: string): Observable<any> {
    return this.apiService.delete(url + '/' + id);
  }

  update(id: string, countryGroup: MasterCountryGroup): Observable<any> {
    return this.apiService.put(url + '/' + id, countryGroup);
  }
}
