import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Update } from '@ngrx/entity';
import { ObjectPosition } from 'app/master/shared/position-control/position-control.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../../../shared/services/api/api.service';
import { MasterBrand } from '../master-brand.model';

const url = '/services/api/v1/brands';

export interface BrandResponse {
  brands: MasterBrand[];
}

@Injectable()
export class MasterBrandDataService extends DefaultDataService<MasterBrand> {
  constructor(
    private apiService: ApiService,
    http: HttpClient,
    httpUrlGenerator: HttpUrlGenerator
  ) {
    super('MasterBrand', http, httpUrlGenerator);
  }

  getAll(): Observable<MasterBrand[]> {
    return this.apiService.get<BrandResponse>(url).pipe(map(response => response.brands));
  }

  getById(brandId: string): Observable<MasterBrand> {
    return this.apiService
      .get(`${url}/${brandId}`)
      .pipe(map(brand => Object.assign({ id: brandId } as MasterBrand, brand)));
  }

  add(brand: MasterBrand): Observable<any> {
    return this.apiService.post(url, brand);
  }

  update(update: Update<MasterBrand>): Observable<any> {
    return this.apiService.put(`${url}/${update.id}`, { ...update.changes });
  }

  updatePosition(brand: ObjectPosition): Observable<any> {
    return this.apiService.put(`${url}/${brand.id}/position`, brand);
  }

  delete(brandId: string): Observable<any> {
    return this.apiService.delete(url + '/' + brandId);
  }
}
