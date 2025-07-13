import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../shared/services/api/api.service';

import { RegionMapping } from './regionmapping.model';

const url = '/geography/api/v1/regionmapping/';

@Injectable()
export class RegionMappingService {
  constructor(private apiService: ApiService) {}

  get(countryId: string): Observable<RegionMapping> {
    return this.apiService.get<RegionMapping>(url + countryId.toUpperCase());
  }
}
