import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../../shared/services/api/api.service';
import {
  CountryStructureDescriptionResponse,
  CountryStructureDescriptionsResponse
} from '../model/country-structure-description.model';

const url = '/structures/api/v1/country-structure-descriptions/countries';

@Injectable()
export class CountryStructureDescriptionApiService {
  constructor(private apiService: ApiService) {}

  getCountryStructureDescriptions(
    countryId: string
  ): Observable<CountryStructureDescriptionResponse[]> {
    return this.apiService
      .get<CountryStructureDescriptionsResponse>(url + '/' + countryId + '?includeStructures=true')
      .pipe(map(cs => cs.countryStructureDescriptions));
  }
}
