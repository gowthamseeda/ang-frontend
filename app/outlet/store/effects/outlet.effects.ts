import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { Country } from '../../../geography/country/country.model';
import { CountryService } from '../../../geography/country/country.service';
import { ApiError, ApiService } from '../../../shared/services/api/api.service';
import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';
import { OpeningHours } from '../../models/opening-hours.model';
import { BusinessSite } from '../../models/outlet-profile.model';
import { OutletResponse } from '../../models/outlet-response.model';
import { Service } from '../../models/services.model';
import { OutletActions } from '../actions';

@Injectable()
export class OutletEffects {
  loadOutletProfile = createEffect(() =>
    this.actions.pipe(
      ofType(OutletActions.loadOutletProfile),
      map((actionPayload: any) => actionPayload.outletId),
      switchMap(outletId =>
        this.apiService.get<OutletResponse>('/outlet/api/v1/outlet/' + outletId)
      ),
      switchMap((outletResponse: OutletResponse) =>
        forkJoin([
          of(outletResponse),
          this.countryService.get(outletResponse.businessSite.countryId),
          this.userSettingsService.getLanguageId()
        ])
      ),
      switchMap((data: [OutletResponse, Country, string]) => {
        const [outletResponse, country, languageId] = data;

        const businessSite: BusinessSite = {
          id: outletResponse.businessSite.id,
          registeredOffice: outletResponse.businessSite.registeredOffice,
          legalName: outletResponse.businessSite.legalName,
          countryName: outletResponse.businessSite.countryName,
          address: { ...outletResponse.businessSite.address },
          hasAssignedLabels: true
        };
        if (outletResponse.businessSite.poBox) {
          businessSite.poBox = { ...outletResponse.businessSite.poBox };
        }

        let services: Service[] = [];
        if (outletResponse.offeredServicesVehicle) {
          services = outletResponse.offeredServicesVehicle.map(offeredService => {
            const service: Service = {
              productCategoryId: offeredService.productCategoryId,
              serviceId: offeredService.serviceId
            };
            if (offeredService.brandId) {
              service.brandId = offeredService.brandId;
            }
            if (offeredService.productGroupId) {
              service.productGroupId = offeredService.productGroupId;
            }
            if (offeredService.serviceName) {
              service.serviceName = offeredService.serviceName;
            }
            if (offeredService.translations) {
              service.translations = offeredService.translations;
            }
            return service;
          });
        }

        const openingHours: OpeningHours = {
          date: outletResponse.openingHours ? outletResponse.openingHours.date : '',
          fromTime: outletResponse.openingHours ? outletResponse.openingHours.begin : '',
          toTime: outletResponse.openingHours ? outletResponse.openingHours.end : ''
        };

        return [
          OutletActions.loadOutletProfileSuccess({
            profile: {
              businessSite: businessSite,
              businessNames: outletResponse.businessNames
                ? outletResponse.businessNames.map(businessName => businessName.businessName)
                : [],
              brands: outletResponse.brands ? [...outletResponse.brands] : [],
              brandCodes: outletResponse.brandCodes ? [...outletResponse.brandCodes] : [],
              businessSiteType: outletResponse.businessSiteType,
              productCategories: outletResponse.productCategories
                ? [...outletResponse.productCategories]
                : [],
              productGroups: outletResponse.productGroups ? [...outletResponse.productGroups] : [],
              services: services,
              openingHours: openingHours
            },
            country: { translations: country.translations ? country.translations : [] },
            languageId: languageId
          })
        ];
      }),
      catchError((error: ApiError) => {
        return of(OutletActions.loadOutletProfileFailure({ error }));
      })
    )
  );

  constructor(
    private actions: Actions,
    private apiService: ApiService,
    private countryService: CountryService,
    private userSettingsService: UserSettingsService
  ) {}
}
