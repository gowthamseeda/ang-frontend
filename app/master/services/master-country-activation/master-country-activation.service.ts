import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../../shared/services/api/api.service';

import { MasterCountryActivation } from './master-country-activation.model';

const url = '/structures/api/v1/country-activation';

export interface CountryActivationResponse {
  countryActivations: MasterCountryActivation[];
}

@Injectable()
export class MasterCountryActivationService {
  constructor(private apiService: ApiService) {}

  get(): Observable<MasterCountryActivation[]> {
    return this.apiService
      .get<CountryActivationResponse>(url)
      .pipe(map(result => result.countryActivations));
  }

  create(masterCountryActivation: MasterCountryActivation): Observable<any> {
    return this.apiService.post(url, masterCountryActivation);
  }

  delete(activationId: number): Observable<any> {
    return this.apiService.delete(url + '/' + activationId);
  }
}
