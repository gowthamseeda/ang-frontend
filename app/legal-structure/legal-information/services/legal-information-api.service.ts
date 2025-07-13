import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiService } from '../../../shared/services/api/api.service';
import { ObjectStatus } from '../../../shared/services/api/objectstatus.model';
import {
  LegalInformationPutResource,
  LegalInformationResponse
} from '../model/legal-information-response';

const baseURL = '/legal-structure/api/v1/companies/';

@Injectable()
export class LegalInformationApiService {
  constructor(private apiService: ApiService) {}

  loadLegalInformation(
    companyId: string,
    businessSiteId: string
  ): Observable<LegalInformationResponse | null> {
    return this.apiService
      .get<LegalInformationResponse>(
        `${baseURL}${companyId}/business-sites/${businessSiteId}/legalinfoBff`
      )
      .pipe(
        catchError(err => {
          if (err.state === 404) {
            return of({
              businessSiteId: businessSiteId,
              companyId: companyId
            });
          }
          return of(err);
        })
      );
  }

  saveLegalInformation(
    companyId: string,
    businessSiteId: string,
    resource: LegalInformationPutResource
  ): Observable<ObjectStatus> {
    return this.apiService.put(
      `${baseURL}${companyId}/business-sites/${businessSiteId}/legalinfoBff`,
      resource
    );
  }
}
