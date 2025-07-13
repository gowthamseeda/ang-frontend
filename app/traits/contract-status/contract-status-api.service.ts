import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../shared/services/api/api.service';
import { ObjectStatus } from '../../shared/services/api/objectstatus.model';

import { ContractStatus, ContractStatusResponse } from './contract-status.model';

const baseURL = '/traits/api/v1/business-sites';

@Injectable()
export class ContractStatusApiService {
  constructor(private apiService: ApiService) {}

  loadContractStatus(businessSiteId: string): Observable<ContractStatusResponse> {
    return this.apiService.get<ContractStatusResponse>(
      `${baseURL}/${businessSiteId}/contractstatus`
    );
  }

  updateContractStatus(
    businessSiteId: string,
    contractStatus: ContractStatus
  ): Observable<ObjectStatus> {
    return this.apiService.put(`${baseURL}/${businessSiteId}/contractstatus`, contractStatus);
  }
}
