import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

import { ApiService } from '../../../shared/services/api/api.service';

import { MasterKeyType } from './master-key.model';

const url = '/traits/api/v1/key-types';

export interface MasterKeyTypeResponse {
  keyTypes: MasterKeyType[];
}

@Injectable()
export class MasterKeyService {
  constructor(private apiService: ApiService) {}

  get(keyTypeId: string): Observable<MasterKeyType> {
    return this.apiService.get<MasterKeyType>(url + '/' + keyTypeId);
  }

  getAll(): Observable<MasterKeyType[]> {
    return this.apiService
      .get<MasterKeyTypeResponse>(url)
      .pipe(map((response: MasterKeyTypeResponse) => response.keyTypes));
  }

  delete(keyTypeId: string): Observable<any> {
    return this.apiService.delete(url + '/' + keyTypeId);
  }

  create(keyType: MasterKeyType): Observable<any> {
    return this.apiService.post(url, keyType);
  }

  update(keyType: MasterKeyType): Observable<any> {
    return this.apiService.put(url + '/' + keyType.id, keyType);
  }
}
