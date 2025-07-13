import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from '../../shared/services/api/api.service';

import { CloseDownReason } from './close-down-reason.model';

const url = '/legal-structure/api/v1/close-down-reasons';

export interface CloseDownReasonsResponse {
  closeDownReasons: CloseDownReason[];
}

@Injectable()
export class CloseDownReasonsService {
  private allCloseDownReasons = new ReplaySubject<CloseDownReason[]>(1);

  constructor(private apiService: ApiService) {
    this.getAllFromBackend().subscribe(closeDownReasons =>
      this.allCloseDownReasons.next(closeDownReasons)
    );
  }

  getAll(): Observable<CloseDownReason[]> {
    return this.allCloseDownReasons.asObservable();
  }

  getAllValidForCompany(): Observable<CloseDownReason[]> {
    return this.getAllValid('COMPANY');
  }

  getAllValidForBusinessSite(): Observable<CloseDownReason[]> {
    return this.getAllValid('BUSINESS_SITE');
  }

  getAllValid(validFor: string): Observable<CloseDownReason[]> {
    return this.allCloseDownReasons.asObservable().pipe(
      map(closeDownReasons => {
        return closeDownReasons.filter(closeDownReason =>
          closeDownReason.validity.includes(validFor)
        );
      })
    );
  }

  private getAllFromBackend(): Observable<CloseDownReason[]> {
    return this.apiService
      .get<CloseDownReasonsResponse>(url)
      .pipe(map(result => result.closeDownReasons));
  }
}
