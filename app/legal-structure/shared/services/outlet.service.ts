import { Injectable } from '@angular/core';
import { clone } from 'ramda';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { UpdateMoveOutlet } from '../../../admin/move-outlet/service/api/actions.model';
import { GenericAdminOutletResponse } from '../../../admin/shared/service/api/admin-response.model';
import { ComparableAddress } from '../../../google/map-message/comparable-address.model';
import { ApiService } from '../../../shared/services/api/api.service';
import { ObjectStatus } from '../../../shared/services/api/objectstatus.model';
import { Cache } from '../../../shared/util/cache';
import { DistributionLevelsService } from '../../../traits/distribution-levels/distribution-levels.service';
import { LocationApiService } from '../../location/services/location-api.service';
import { AffectedBusinessSites } from '../components/status/status.component';
import { Outlet } from '../models/outlet.model';
import { POBox } from '../models/po-box.model';

@Injectable({
  providedIn: 'root'
})
export class OutletService {
  private outletChangesSubject: Subject<string> = new Subject<string>();
  private cache: Cache<Outlet>;

  constructor(
    private apiService: ApiService,
    private geocodeService: LocationApiService,
    private distributionLevelsService: DistributionLevelsService
  ) {
    this.cache = new Cache<Outlet>(this.apiService, this.buildBaseUrl);
  }

  clearBusinessSite(businessSiteId: string): void {
    this.cache.clearFor(businessSiteId);
  }

  getOrLoadBusinessSite(businessSiteId: string): Observable<Outlet> {
    return this.cache.getOrLoad(businessSiteId).asObservable();
  }

  getCompany(companyId: string): Observable<Outlet> {
    return this.apiService.get<Outlet>('/legal-structure/api/v1/companies/' + companyId);
  }

  getAffectedBusinessSiteIds(
    companyId: string,
    companyStartOperationDate: string
  ): Observable<AffectedBusinessSites> {
    return this.apiService.get<AffectedBusinessSites>(
      '/legal-structure/api/v1/companies/' +
        companyId +
        '/startoperation/' +
        companyStartOperationDate
    );
  }

  create(companyId: string, outlet: Outlet): Observable<string> {
    return this.apiService
      .post('/legal-structure/api/v1/companies/' + companyId + '/business-sites', outlet)
      .pipe(map((objectStatus: ObjectStatus) => objectStatus.id));
  }

  createWithGps(companyId: string, outlet: Outlet): Observable<string> {
    const address = new ComparableAddress(
      outlet.address.streetNumber,
      outlet.address.street,
      outlet.address.city,
      outlet.countryId,
      outlet.address.zipCode
    );
    return this.geocodeService.getLocationForAddress(address).pipe(
      mergeMap(geoLocationResponse => {
        outlet.gps = geoLocationResponse.gps;
        outlet.province = geoLocationResponse.region?.province;
        outlet.state = geoLocationResponse.region?.state;
        return this.create(companyId, outlet);
      }),
      catchError(() => this.create(companyId, outlet))
    );
  }

  createWithDistributionLevels(
    companyId: string,
    outlet: Outlet,
    distributionLevels: string[]
  ): Observable<string> {
    let outletCreationError: any;
    let createdOutletId: string;

    return this.createWithGps(companyId, outlet).pipe(
      catchError(error => {
        outletCreationError = error;
        return throwError(error);
      }),
      tap(outletId => (createdOutletId = outletId)),
      mergeMap(outletId =>
        this.distributionLevelsService
          .update(outletId, distributionLevels)
          .pipe(map(() => outletId))
      ),
      catchError(() =>
        throwError(
          outletCreationError ?? {
            message: 'CREATE_OUTLET_FAILED_DISTRIBUTIONS',
            createdOutletId: createdOutletId
          }
        )
      )
    );
  }

  update(companyId: string, businessSiteId: string, outlet: Outlet): Observable<any> {
    return this.apiService
      .put(
        '/legal-structure/api/v1/companies/' + companyId + '/business-sites/' + businessSiteId,
        this.removeEmptyPoBoxDataOfAdditionalTranslations(clone(outlet))
      )
      .pipe(
        tap(() => this.clearBusinessSite(businessSiteId)),
        map(res => {
          this.outletChangesSubject.next(businessSiteId);
          return res;
        })
      );
  }

  switchRegisteredOffice(
    companyId: string,
    outletId: string
  ): Observable<GenericAdminOutletResponse> {
    return this.apiService
      .patchCustom('/legal-structure/api/v1/companies/' + companyId + '/switch-registered-office', {
        businessSiteId: outletId
      })
      .pipe(map((response: GenericAdminOutletResponse) => response));
  }

  moveOutlet(
    outletId: string,
    updateMoveOutlet: UpdateMoveOutlet
  ): Observable<GenericAdminOutletResponse> {
    return this.apiService
      .patchCustom(
        '/legal-structure/api/v1/business-sites/' + outletId + '/move-business-site',
        updateMoveOutlet
      )
      .pipe(map((response: GenericAdminOutletResponse) => response));
  }

  isLegalNameEditableInCountry(countryId: string): boolean {
    return countryId === 'CH';
  }

  getPoBox(businessSiteId: string): Observable<POBox> {
    return this.apiService
      .get('/legal-structure/api/v1/business-sites/' + businessSiteId)
      .pipe(map((res: { poBox: POBox }) => res.poBox));
  }

  outletChanges(): Observable<string> {
    return this.outletChangesSubject;
  }

  removeEmptyPoBoxDataOfAdditionalTranslations(outlet: Outlet): Outlet {
    for (const translation in outlet.additionalTranslations) {
      if (
        outlet.additionalTranslations[translation] &&
        outlet.additionalTranslations[translation].poBox &&
        !outlet.additionalTranslations[translation].poBox?.city
      ) {
        outlet.additionalTranslations[translation].poBox = undefined;
      }
    }

    return outlet;
  }

  private buildBaseUrl(businessSiteId: string): string {
    return `/legal-structure/api/v1/business-sites/${businessSiteId}`;
  }
}
