import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, EntityDataService, HttpUrlGenerator } from '@ngrx/data';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Brand } from '../brand.model';
import { ApiService } from '../../../shared/services/api/api.service';

const url = '/services/api/v1/brands';

export interface BrandsResponse {
  brands: Brand[];
}

@Injectable({
  providedIn: 'root'
})
export class BrandDataService extends DefaultDataService<Brand> {
  constructor(
    private apiService: ApiService,
    private entityDataService: EntityDataService,
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator
  ) {
    super('Brand', http, httpUrlGenerator);
    this.entityDataService.registerService('Brand', this);
  }

  getAll(): Observable<Brand[]> {
    return this.apiService.get<BrandsResponse>(url).pipe(map(response => response.brands));
  }
}
