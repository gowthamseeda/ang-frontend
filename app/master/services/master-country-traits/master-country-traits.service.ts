import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../../shared/services/api/api.service';

import { MasterCountryTraits } from './master-country-traits.model';

const url = '/traits/api/v1/countries';

@Injectable()
export class MasterCountryTraitsService {
  constructor(private apiService: ApiService) {}

  get(countryId: string): Observable<MasterCountryTraits> {
    return this.apiService.get<MasterCountryTraits>(url + '/' + countryId + '/traits');
  }

  update(countryTraits: MasterCountryTraits): Observable<any> {
    return this.apiService.put(url + '/' + countryTraits.countryId + '/traits', countryTraits);
  }
}
