import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../../shared/services/api/api.service';

import { MasterCloseDownReason } from './master-close-down-reason.model';

const url = '/legal-structure/api/v1/close-down-reasons';

export interface MasterCloseDownReasonsResponse {
  closeDownReasons: MasterCloseDownReason[];
}

@Injectable()
export class MasterCloseDownReasonsService {
  constructor(private apiService: ApiService) {}

  get(closeDownReasonId: string): Observable<MasterCloseDownReason> {
    return this.apiService.get<MasterCloseDownReason>(url + '/' + closeDownReasonId);
  }

  getAll(): Observable<MasterCloseDownReason[]> {
    return this.apiService
      .get<MasterCloseDownReasonsResponse>(url)
      .pipe(map(result => result.closeDownReasons));
  }

  create(closeDownReason: MasterCloseDownReason): Observable<any> {
    return this.apiService.post(url, closeDownReason);
  }

  update(closeDownReasonId: string, closeDownReason: MasterCloseDownReason): Observable<any> {
    return this.apiService.put(url + '/' + closeDownReasonId, closeDownReason);
  }

  delete(closeDownReasonId: string): Observable<any> {
    return this.apiService.delete(url + '/' + closeDownReasonId);
  }
}
