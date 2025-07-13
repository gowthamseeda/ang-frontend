import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../../shared/services/api/api.service';
import { Currency } from '../currency.model';

const url = '/investors/api/v1/currencies';

export interface CurrencyResponse {
  currencies: Currency[];
}

@Injectable()
export class CurrencyDataService extends DefaultDataService<Currency> {
  constructor(
    private apiService: ApiService,
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator
  ) {
    super('Currency', http, httpUrlGenerator);
  }

  getAll(): Observable<Currency[]> {
    return this.apiService.get<CurrencyResponse>(url).pipe(map(response => response.currencies));
  }
}
