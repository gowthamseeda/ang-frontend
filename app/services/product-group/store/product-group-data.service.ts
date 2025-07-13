import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, EntityDataService, HttpUrlGenerator } from '@ngrx/data';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductGroup } from '../product-group.model';
import { ApiService } from '../../../shared/services/api/api.service';

const url = '/services/api/v1/product-groups';

export interface ProductGroupsResponse {
  productGroups: ProductGroup[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductGroupDataService extends DefaultDataService<ProductGroup> {
  constructor(
    private apiService: ApiService,
    private entityDataService: EntityDataService,
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator
  ) {
    super('ProductGroup', http, httpUrlGenerator);
    this.entityDataService.registerService('ProductGroup', this);
  }

  getAll(): Observable<ProductGroup[]> {
    return this.apiService
      .get<ProductGroupsResponse>(url)
      .pipe(map(response => response.productGroups));
  }
}
