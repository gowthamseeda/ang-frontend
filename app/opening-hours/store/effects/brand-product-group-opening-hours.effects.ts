import { WeekDay } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  OpeningHour,
  SpecialOpeningHour,
  StandardOpeningHour
} from 'app/opening-hours/models/opening-hour.model';
import { combineLatest, forkJoin, of, zip } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { UserService } from '../../../iam/user/user.service';
import { BrandService } from '../../../services/brand/brand.service';
import { Service } from '../../../services/service/models/service.model';
import { ServiceService } from '../../../services/service/services/service.service';
import { ApiError } from '../../../shared/services/api/api.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { sort } from '../../brand-product-group/brand-product-group-order';
import {
  OpeningHourResponse,
  Response,
  SpecialOpeningHourResponse,
  StandardOpeningHourResponse
} from '../../models/opening-hour-response.model';
import { OpeningHoursService } from '../../opening-hours.service';
import { BrandProductGroupOpeningHoursActions } from '../actions';
import { Hours } from '../reducers';

@Injectable()
export class BrandProductGroupOpeningHoursEffects {
  loadOpeningHours = createEffect(() =>
    this.actions$.pipe(
      ofType(BrandProductGroupOpeningHoursActions.openingHoursLoad),
      switchMap((action: any) =>
        this.openingHoursService
          .getExistingOrNew(
            action.outletId,
            action.productCategoryId,
            action.serviceId,
            action.serviceCharacteristicId
          )
          .pipe(
            map((response: Response) => {
              if (action.isTaskPresent) {
                return BrandProductGroupOpeningHoursActions.openingHoursReload({ response });
              }
              return BrandProductGroupOpeningHoursActions.openingHoursLoadSuccess({ response });
            }),
            catchError((error: Error | ApiError) => {
              this.snackBarService.showError(error);
              return of(BrandProductGroupOpeningHoursActions.openingHoursApiFailure({ error }));
            })
          )
      )
    )
  );

  loadBrandProductGroupOpeningHours = createEffect(() =>
    this.actions$.pipe(
      ofType(
        BrandProductGroupOpeningHoursActions.openingHoursLoadSuccess,
        BrandProductGroupOpeningHoursActions.openingHoursReload
      ),
      switchMap((action: any) =>
        zip(of(action.response), this.serviceService.selectBy(action.response.serviceId))
      ),
      switchMap((data: [Response, Service]) => {
        const [openingHours, service] = data;
        if (!service) {
          this.serviceService.fetchBy(+openingHours.serviceId);
        }
        return combineLatest([
          of(openingHours),
          this.userService.getProductGroupRestrictions(),
          this.userService.getBrandRestrictions(),
          this.brandService.getAllIds(),
          this.serviceService.selectBy(openingHours.serviceId)
        ]);
      }),
      switchMap((data: [Response, string[], string[], string[], Service]) => {
        const [openingHours, productGroupRestrictions, brandRestrictions, brandIds, service] = data;
        const hours: Hours = this.hoursFrom(openingHours);
        const sortedStandardHours = sort(hours.standardOpeningHours, brandIds);

        const groupedByStartTime = hours.specialOpeningHours.reduce((reduced, hour) => {
          reduced[hour.startDate] = [...(reduced[hour.startDate] || []), hour];
          return reduced;
        }, {});

        const sortedByStartTime = Object.keys(groupedByStartTime).sort();
        const sortedSpecialHours = sortedByStartTime.reduce((sorted, startTime) => {
          const sortedGroup = sort(groupedByStartTime[startTime], brandIds) as SpecialOpeningHour[];
          return [...sorted, ...sortedGroup];
        }, [] as SpecialOpeningHour[]);

        return [
          BrandProductGroupOpeningHoursActions.brandProductGroupOpeningHoursLoadSuccess({
            service: {
              serviceId: openingHours.serviceId,
              productCategoryId: openingHours.productCategoryId,
              serviceCharacteristicsId: openingHours.serviceCharacteristicId,
              serviceName: openingHours.serviceName,
              serviceCharacteristicName: openingHours.serviceCharacteristicName,
              translations: service?.translations,
              name: service?.name
            },
            hours: {
              standardOpeningHours: sortedStandardHours as StandardOpeningHour[],
              specialOpeningHours: sortedSpecialHours as SpecialOpeningHour[]
            },
            outlet: {
              businessSiteId: openingHours.businessSiteId,
              countryId: openingHours.countryId
            },
            permissions: {
              productGroupRestrictions: productGroupRestrictions,
              brandRestrictions: brandRestrictions
            }
          })
        ];
      }),
      catchError((error: any) => {
        this.snackBarService.showError(error);
        return of(BrandProductGroupOpeningHoursActions.openingHoursApiFailure({ error }));
      })
    )
  );

  saveOpeningHours$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BrandProductGroupOpeningHoursActions.openingHoursSubmit),
      switchMap(action => {
        return forkJoin([
          of(action.hours),
          of(action.taskData),
          this.openingHoursService.update(
            action.businessSiteId,
            action.service,
            action.hours.standardOpeningHours,
            action.hours.specialOpeningHours,
            action.taskData
          )
        ]);
      }),
      switchMap(data => {
        const [hours, taskData] = data;
        this.snackBarService.showInfo(
          !!taskData ? 'CREATE_OPENING_HOURS_REQUEST_SUCCESS' : 'CREATE_OPENING_HOURS_SUCCESS'
        );
        return of(
          BrandProductGroupOpeningHoursActions.openingHoursUpdateSuccess({
            hours: hours,
            taskData: taskData
          })
        );
      }),
      catchError((error: any) => {
        this.snackBarService.showError(error);
        return of(BrandProductGroupOpeningHoursActions.openingHoursApiFailure({ error }));
      })
    )
  );

  saveMultiEditOpeningHours$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BrandProductGroupOpeningHoursActions.multiEditOpeningHoursSubmit),
        switchMap(action => {
          return forkJoin([
            of(action.taskData),
            this.openingHoursService.updateMultiEditOpeningHourData(
              action.hours,
              action.multiSelectOfferedServices,
              action.taskData
            )
          ]);
        }),
        map(data => {
          const [taskData, updateOpeningHoursByOfferedServiceIdResponse] = data;
          if (
            updateOpeningHoursByOfferedServiceIdResponse.fail &&
            updateOpeningHoursByOfferedServiceIdResponse.fail.length > 0
          ) {
            const errors = updateOpeningHoursByOfferedServiceIdResponse.fail
              .map(item => {
                if (item.message) {
                  return `[${item.offeredServiceId}]: ${item.message.join(',')}`;
                } else {
                  return `[${item.offeredServiceId}]`;
                }
              })
              .join('\n');
            this.snackBarService.displayMessageWithLengthLimit(errors);
          } else {
            const offeredServiceIds = updateOpeningHoursByOfferedServiceIdResponse.success
              .map(item => `[${item.offeredServiceId}]`)
              .join(',');
            this.snackBarService.showInfoWithData(
              !!taskData ? 'CREATE_OPENING_HOURS_REQUEST_SUCCESS' : 'CREATE_OPENING_HOURS_SUCCESS',
              offeredServiceIds
            );
          }
        }),
        catchError((error: any) => {
          this.snackBarService.showError(error);
          return of(BrandProductGroupOpeningHoursActions.openingHoursApiFailure({ error }));
        })
      ),
    { dispatch: false }
  );

  postSaveOpeningHours$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BrandProductGroupOpeningHoursActions.openingHoursUpdateSuccess),
      switchMap(action => {
        return of(
          BrandProductGroupOpeningHoursActions.openingHoursLoad({
            ...this.getOpeningInfo(),
            isTaskPresent: !!action.taskData
          })
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private openingHoursService: OpeningHoursService,
    private snackBarService: SnackBarService,
    private userService: UserService,
    private brandService: BrandService,
    private serviceService: ServiceService,
    private activatedRoute: ActivatedRoute
  ) {}

  private hoursFrom(response: Response): Hours {
    return {
      standardOpeningHours: response.standardOpeningHours.map(
        (standardOpeningHour: StandardOpeningHourResponse) => {
          return {
            brandId: standardOpeningHour.brand,
            productGroupIds: standardOpeningHour.productGroups,
            openingHours: this.openingHoursFrom(standardOpeningHour.openingHours)
          } as StandardOpeningHour;
        }
      ),
      specialOpeningHours: (response.specialOpeningHours ?? []).map(
        (specialOpeningHour: SpecialOpeningHourResponse) => {
          return {
            startDate: specialOpeningHour.startDate,
            endDate: specialOpeningHour.endDate,
            brandId: specialOpeningHour.brand,
            productGroupIds: specialOpeningHour.productGroups,
            openingHours: this.openingHoursFrom(specialOpeningHour.openingHours),
            configured: true
          } as SpecialOpeningHour;
        }
      )
    };
  }

  private openingHoursFrom(openingHoursResponse: OpeningHourResponse[]): OpeningHour[] {
    return (openingHoursResponse ?? []).map(oh => {
      return {
        weekDay: this.weekDayFrom(oh.day),
        closed: oh.closed,
        times: oh.times
      };
    });
  }

  private weekDayFrom(day: string): WeekDay {
    let convertedDay: WeekDay;
    switch (day) {
      case 'MO':
        convertedDay = WeekDay.Monday;
        break;
      case 'TU':
        convertedDay = WeekDay.Tuesday;
        break;
      case 'WE':
        convertedDay = WeekDay.Wednesday;
        break;
      case 'TH':
        convertedDay = WeekDay.Thursday;
        break;
      case 'FR':
        convertedDay = WeekDay.Friday;
        break;
      case 'SA':
        convertedDay = WeekDay.Saturday;
        break;
      case 'SU':
        convertedDay = WeekDay.Sunday;
        break;
      default:
        convertedDay = WeekDay.Monday;
        break;
    }
    return convertedDay;
  }

  private getOpeningInfo(): any {
    const { serviceId, productCategoryId, serviceCharacteristicId } =
      this.activatedRoute.snapshot.queryParams;
    const urlSegment = location.pathname.split('/');
    const outletId = environment.settings.environment === 'PROD' ? urlSegment[3] : urlSegment[4];
    return {
      outletId: outletId,
      productCategoryId: productCategoryId,
      serviceId: serviceId,
      serviceCharacteristicId: serviceCharacteristicId
    };
  }
}
