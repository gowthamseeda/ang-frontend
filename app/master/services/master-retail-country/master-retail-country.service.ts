import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/services/api/api.service';
import { MasterRetailCountry } from './master-retail-country.model';
import { map } from 'rxjs';

const url = '/geography/api/v1/retail-countries';

export interface MasterRetailCountriesResponse {
  retailCountries: MasterRetailCountry[];
}

@Injectable({
  providedIn: 'root'
})
export class MasterRetailCountryService {
  constructor(private apiService: ApiService) {}

  getAll() {
    return this.apiService
      .get<MasterRetailCountriesResponse>(url)
      .pipe(map(retailCountry => retailCountry.retailCountries));
  }

  get(id: string) {
    return this.apiService.get<MasterRetailCountry>(`${url}/${id}`);
  }

  create(payload: MasterRetailCountry) {
    return this.apiService.post(url, payload);
  }

  update(payload: MasterRetailCountry) {
    return this.apiService.put(`${url}/${payload.id}`, payload);
  }

  delete(retailCountryId: string) {
    return this.apiService.delete(`${url}/${retailCountryId}`);
  }
}
