import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, delay, map, mergeMap, tap } from 'rxjs/operators';

import { ApiService } from '../../shared/services/api/api.service';
import { ObjectStatus } from '../../shared/services/api/objectstatus.model';
import { DistributionLevelsService } from '../../traits/distribution-levels/distribution-levels.service';

import { Company } from './company.model';

const url = '/legal-structure/api/v1/companies';

@Injectable()
export class CompanyService {
  constructor(
    private apiService: ApiService,
    private distributionLevelsService: DistributionLevelsService
  ) {}

  get(companyId: string): Observable<Company> {
    return this.apiService.get<Company>(url + '/' + companyId);
  }

  create(company: Company): Observable<string> {
    return this.apiService
      .post(url, company)
      .pipe(map((objectStatus: ObjectStatus) => objectStatus.id));
  }

  createAndGetRegisteredOfficeId(company: Company): Observable<string> {
    return this.create(company).pipe(
      delay(1000),
      mergeMap((id: string) => {
        return this.get(id).pipe(
          map((loadedCompany: Company) => {
            return loadedCompany.registeredOfficeId ? loadedCompany.registeredOfficeId : '';
          })
        );
      })
    );
  }

  createWithoutGps(company: Company): Observable<string> {
    return this.createAndGetRegisteredOfficeId(company);
  }

  createWithDistributionLevels(
    company: Company,
    distributionLevels: Array<string>
  ): Observable<string> {
    let companyError: any;
    let createdRegisteredOfficeId: string;

    return this.createWithoutGps(company).pipe(
      catchError(error => {
        companyError = error;
        return throwError(error);
      }),
      tap(registeredOfficeId => (createdRegisteredOfficeId = registeredOfficeId)),
      mergeMap(registeredOfficeId =>
        this.distributionLevelsService
          .update(registeredOfficeId, distributionLevels)
          .pipe(map(() => registeredOfficeId))
      ),
      catchError(() =>
        throwError(
          companyError ?? {
            message: 'CREATE_COMPANY_FAILED_DISTRIBUTIONS',
            createdRegisteredOfficeId: createdRegisteredOfficeId
          }
        )
      )
    );
  }

  update(companyId: string, company: Company): Observable<any> {
    return this.apiService.put(url + '/' + companyId, company);
  }
}
