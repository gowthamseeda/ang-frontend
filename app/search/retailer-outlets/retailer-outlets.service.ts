import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../shared/services/api/api.service';
import { CustomEncoder } from '../../shared/services/api/custom-encoder';
import { SearchItemResponse } from '../search.service';

const url = '/search/api/v1/retailer/outlets';
const PAGE_SIZE = 50;

@Injectable({
  providedIn: 'root'
})
export class RetailerOutletsService {
  constructor(private apiService: ApiService) {}

  getAll(page?: number, pageSize?: number): Observable<SearchItemResponse> {
    const params = this.buildParams(page, pageSize);
    return this.apiService.get<SearchItemResponse>(url, params);
  }

  private buildParams(page = 0, pageSize = PAGE_SIZE): HttpParams {
    let params = new HttpParams({ encoder: new CustomEncoder() });
    params = params.append('page', String(page));
    params = params.append('pageSize', String(pageSize));

    return params;
  }
}
