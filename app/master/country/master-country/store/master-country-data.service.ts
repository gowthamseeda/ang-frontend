import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Update } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../../../shared/services/api/api.service';
import { MasterCountry } from '../master-country.model';

const url = '/geography/api/v1/countries';

export interface CountryResponse {
  countries: MasterCountry[];
}

@Injectable()
export class MasterCountryDataService extends DefaultDataService<MasterCountry> {
  constructor(
    private apiService: ApiService,
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator
  ) {
    super('MasterCountry', http, httpUrlGenerator);
  }

  getAll(): Observable<MasterCountry[]> {
    return this.apiService.get<CountryResponse>(url).pipe(map(response => response.countries));
  }

  getById(countryId: string): Observable<MasterCountry> {
    return this.apiService
      .get(`${url}/${countryId}`)
      .pipe(map(country => Object.assign({ id: countryId } as MasterCountry, country)));
  }

  add(country: MasterCountry): Observable<any> {
    return this.apiService.post(url, country);
  }

  update(update: Update<MasterCountry>): Observable<any> {
    return this.apiService.put(`${url}/${update.id}`, { ...update.changes });
  }

  delete(countryId: string): Observable<any> {
    return this.apiService.delete(url + '/' + countryId);
  }
}
