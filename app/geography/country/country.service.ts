import { Injectable } from '@angular/core';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserService } from '../../iam/user/user.service';
import { ApiService } from '../../shared/services/api/api.service';

import { Country } from './country.model';

const url = '/geography/api/v1/countries';

export interface CountriesResponse {
  countries: Country[];
}

@Injectable()
export class CountryService {
  private countriesSubject = new ReplaySubject<Country[]>(1);

  constructor(private apiService: ApiService, private userService: UserService) {
    this.loadCountries();
  }

  loadCountries(): void {
    this.apiService
      .get<CountriesResponse>(url)
      .subscribe(response => this.countriesSubject.next(response.countries));
  }

  getAll(): Observable<Country[]> {
    return this.countriesSubject.asObservable();
  }

  getAllForUserDataRestrictions(): Observable<Country[]> {
    return combineLatest([this.getAll(), this.userService.getUserDataRestrictions()]).pipe(
      map(([countries, userDataRestriction]) => {
        if (!userDataRestriction.Country || userDataRestriction.Country.length === 0) {
          return countries;
        }

        return countries.filter(country => userDataRestriction.Country.includes(country.id));
      })
    );
  }

  get(countryId: string): Observable<Country> {
    return this.apiService.get<Country>(url + '/' + countryId);
  }
}
