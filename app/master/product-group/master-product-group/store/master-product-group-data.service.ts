import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Update } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../../../shared/services/api/api.service';
import { MasterProductGroup } from '../master-product-group.model';

const url = '/services/api/v1/product-groups';

export interface ProductGroupResponse {
  productGroups: MasterProductGroup[];
}

@Injectable()
export class MasterProductGroupDataService extends DefaultDataService<MasterProductGroup> {
  constructor(
    private apiService: ApiService,
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator
  ) {
    super('MasterProductGroup', http, httpUrlGenerator);
  }

  getAll(): Observable<MasterProductGroup[]> {
    return this.apiService
      .get<ProductGroupResponse>(url)
      .pipe(map(response => response.productGroups));
  }

  getById(productGroupId: string): Observable<MasterProductGroup> {
    return this.apiService
      .get(`${url}/${productGroupId}`)
      .pipe(
        map(productGroup =>
          Object.assign({ id: productGroupId } as MasterProductGroup, productGroup)
        )
      );
  }

  add(productGroup: MasterProductGroup): Observable<any> {
    return this.apiService.post(url, productGroup);
  }

  update(update: Update<MasterProductGroup>): Observable<any> {
    return this.apiService.put(`${url}/${update.id}`, { ...update.changes });
  }

  delete(productGroupId: string): Observable<any> {
    return this.apiService.delete(url + '/' + productGroupId);
  }
}
