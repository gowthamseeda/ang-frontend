import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { ApiError } from '../../../../shared/services/api/api.service';
import { RegionalCentersResource } from '../../model/regional-center-api.model';
import { RegionalCenter } from '../../model/regional-center.model';
import { RegionalCenterApiService } from '../../services/regional-center-api.service';
import { RegionalCenterActions } from '../actions';

@Injectable()
export class RegionalCenterEffects {
  loadRegionalCenters = createEffect(() =>
    this.actions.pipe(
      ofType(RegionalCenterActions.loadRegionalCenters),
      switchMap(() => this.regionalCenterApiService.getAll()),
      switchMap((response: RegionalCentersResource) => {
        const regionalCenters: RegionalCenter[] = response.regionalCenters.map(centerResource => ({
          id: centerResource.regionalCenterId,
          name: centerResource.businessSite.name,
          brandCodes: centerResource.businessSite.brands.map(brandResource => ({
            brandId: brandResource.brandId,
            code: brandResource.brandCode
          })),
          businessSiteId: centerResource.businessSite.businessSiteId,
          distributionLevels: centerResource.businessSite.distributionLevel,
          registeredOffice: centerResource.businessSite.registeredOffice,
          address: {
            city: centerResource.businessSite.address.city,
            countryId: centerResource.businessSite.address.countryId,
            street: centerResource.businessSite.address.street ?? '',
            number: centerResource.businessSite.address.streetNumber ?? ''
          },
          superviseeCountries: centerResource.supervisedCountries
            ? centerResource.supervisedCountries.map(countryResource => ({
                businessSiteIds: countryResource.businessSites ?? [],
                countryId: countryResource.countryId,
                cpiIndex: countryResource.cpiIndex ?? ''
              }))
            : []
        }));
        return of(
          RegionalCenterActions.loadRegionalCentersSuccess({ regionalCenters: regionalCenters })
        );
      }),
      catchError((error: ApiError) =>
        of(RegionalCenterActions.loadRegionalCenterFailure({ error: error }))
      )
    )
  );

  constructor(
    private actions: Actions,
    private regionalCenterApiService: RegionalCenterApiService
  ) {}
}
