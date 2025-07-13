import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { OfferedService } from '../../offered-service/offered-service.model';
import { ServiceFilterCriteria, ServiceTableRow } from '../models/service-table-row.model';

@Injectable()
export class ServiceTableFilterService {
  get pristine(): Observable<boolean> {
    return this._pristine.asObservable();
  }

  get pristineFilterCriteria(): BehaviorSubject<ServiceFilterCriteria> {
    if (this.verifyAuthenticateFilterAction()) {
      return new BehaviorSubject<ServiceFilterCriteria>({
        isOfferedService: {
          value: false,
          isEnabled: true
        }
      });
    } else {
      return new BehaviorSubject<ServiceFilterCriteria>({
        isOfferedService: {
          value: true,
          isEnabled: false
        }
      });
    }
  }

  get filterCriteria(): Observable<ServiceFilterCriteria> {
    return this._filterCriteria.asObservable();
  }
  pristineServiceRows: ServiceTableRow[];
  pristineOfferedService: OfferedService[];

  private filteredServiceRows: ServiceTableRow[];
  private readonly _pristine = new BehaviorSubject<boolean>(false);
  private readonly _filterCriteria = this.pristineFilterCriteria;

  constructor(private userAuthorizationService: UserAuthorizationService) {}

  initServiceFilterSearchData(
    serviceTableRows: ServiceTableRow[],
    offeredService: OfferedService[]
  ): void {
    this.pristineServiceRows = serviceTableRows;
    this.pristineOfferedService = offeredService;
  }

  servicesFilter(criteria: ServiceFilterCriteria): Observable<ServiceTableRow[]> {
    this.filteredServiceRows = this.pristineServiceRows;

    this.filterOfferedService(criteria.isOfferedService.value);

    return of(this.filteredServiceRows);
  }

  changePristineTo(pristine: boolean): void {
    this._pristine.next(pristine);
  }

  changeFilterCriteriaTo(pristine: ServiceFilterCriteria): void {
    this._filterCriteria.next(pristine);
  }

  private filterOfferedService(isOfferedService: boolean): void {
    if (isOfferedService) {
      this.filteredServiceRows = this.filteredServiceRows.filter(serviceId => {
        if (this.getOfferedServiceIds().includes(serviceId.entry.id)) {
          return serviceId;
        }
      });
    }
  }

  private getOfferedServiceIds(): number[] {
    return this.pristineOfferedService.map(offeredService => {
      return offeredService.serviceId;
    });
  }

  private verifyAuthenticateFilterAction(): boolean {
    let isNotAllowed = false;

    this.verifyAuthentication()
      .subscribe(isInPermission => {
        if (isInPermission) {
          isNotAllowed = true;
        }
      });
    return isNotAllowed;
  }

  private verifyAuthentication(): Observable<boolean> {
    return this.userAuthorizationService.isAuthorizedFor
      .permissions(['app.services.filter.admin.show'])
      .verify();
  }
}
