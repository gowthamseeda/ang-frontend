import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { iif, zip } from 'rxjs';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { BusinessSiteTaskService } from '../../../tasks/shared/business-site-task.service';
import { DataCluster, Status, Type } from '../../../tasks/task.model';
import { BrandProductGroupOpeningHoursActions } from '../actions';

@Injectable()
export class OpeningHoursTaskEffects {
  loadOpeningHoursTask = createEffect(() =>
    this.actions.pipe(
      ofType(BrandProductGroupOpeningHoursActions.openingHoursLoadSuccess),
      switchMap(action => {
        return this.isUserAuthorisedFor(
          action.response.businessSiteId,
          action.response.countryId
        ).pipe(
          switchMap(authorized =>
            iif(
              () => authorized,
              zip(
                this.existsDataChangeTaskFor(
                  action.response.businessSiteId,
                  action.response.serviceId,
                  action.response.productCategoryId
                ),
                this.existsVerificationTaskFor(action.response.businessSiteId)
              ).pipe(
                map(([isDataChangeTaskPresent, isVerificationTaskPresent]) =>
                  BrandProductGroupOpeningHoursActions.loadTaskSuccess({
                    dataChangeTaskPresent: isDataChangeTaskPresent,
                    verificationTaskPresent: isVerificationTaskPresent
                  })
                )
              ),
              of(
                BrandProductGroupOpeningHoursActions.loadTaskSuccess({
                  dataChangeTaskPresent: undefined,
                  verificationTaskPresent: undefined
                })
              )
            )
          )
        );
      })
    )
  );

  constructor(
    private actions: Actions,
    private userAuthorizationService: UserAuthorizationService,
    private businessSiteTaskService: BusinessSiteTaskService
  ) {}

  private isUserAuthorisedFor(businessSiteId: string, countryId: string): Observable<boolean> {
    return this.userAuthorizationService.isAuthorizedFor
      .permissions(['tasks.task.filter.read'])
      .country(countryId)
      .businessSite(businessSiteId)
      .verify();
  }

  private existsDataChangeTaskFor(
    businessSiteId: string,
    serviceId: number,
    productCategoryId: string
  ): Observable<boolean> {
    return this.businessSiteTaskService
      .existsFor(businessSiteId, {
        type: Type.DATA_CHANGE,
        dataClusters: [DataCluster.OPENING_HOURS],
        status: Status.OPEN,
        tag: `serviceId=${serviceId},productCategoryId=${productCategoryId}`
      })
      .pipe(catchError(() => of(false)));
  }

  private existsVerificationTaskFor(businessSiteId: string): Observable<boolean> {
    return this.businessSiteTaskService
      .existsFor(businessSiteId, {
        type: Type.DATA_VERIFICATION,
        dataClusters: [DataCluster.OPENING_HOURS],
        status: Status.OPEN
      })
      .pipe(catchError(() => of(false)));
  }
}
