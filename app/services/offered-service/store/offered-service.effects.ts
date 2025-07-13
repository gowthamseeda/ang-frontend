import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { ServiceTableStatusService } from '../../service/services/service-table-status.service';
import { servicesState } from '../../store';

import { OfferedServiceApiActions, OfferedServiceServiceActions } from './actions';
import { OfferedServiceDataService } from './offered-service-data.service';
import { offeredServiceSelectors } from './selectors/offered-service.selectors';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { SisterOutlet } from '../../shared/models/sister-outlet.model';
import { OfferedService } from '../offered-service.model';

@Injectable()
export class OfferedServiceEffects {
  loadOfferedServices = createEffect(() =>
    this.actions.pipe(
      ofType(OfferedServiceServiceActions.loadOfferedServices),
      switchMap(({ outletId }) =>
        this.offeredServiceDataService.get(outletId).pipe(
          map(offeredServices =>
            OfferedServiceApiActions.loadOfferedServicesSuccess({ offeredServices })
          ),
          catchError(error => of(OfferedServiceApiActions.loadOfferedServicesError({ error })))
        )
      )
    )
  );

  saveOfferedServices = createEffect(() =>
    this.actions.pipe(
      ofType(OfferedServiceServiceActions.saveOfferedServices),
      concatMap(action =>
        of(action).pipe(withLatestFrom(this.store.pipe(select(offeredServiceSelectors.selectAll))))
      ),
      switchMap(([{ outletId }, offeredServices]) =>
        this.offeredServiceDataService.update(outletId, offeredServices).pipe(
          map(() => {
            this.serviceTableStatusService.changeServiceTableSavedStatusTo(true);
            this.snackBarService.showInfo('EDIT_SERVICES_SUCCESS');
            return OfferedServiceApiActions.saveOfferedServicesSuccess();
          }),
          catchError(error => {
            this.snackBarService.showError(error);
            return of(OfferedServiceApiActions.saveOfferedServicesError({ error }));
          })
        )
      )
    )
  );

  saveOfferedServiceValidities = createEffect(() =>
    this.actions.pipe(
      ofType(OfferedServiceServiceActions.saveOfferedServiceValidities),
      switchMap(({ outletId, validities }) =>
        this.offeredServiceDataService.updateValidities(outletId, validities).pipe(
          map(() => {
            this.snackBarService.showInfo('EDIT_SERVICE_VALIDITY_SUCCESS');
            return OfferedServiceApiActions.saveOfferedServiceValiditiesSuccess();
          }),
          catchError(error => {
            this.snackBarService.showError(error);
            return of(OfferedServiceApiActions.saveOfferedServiceValiditiesError({ error }));
          })
        )
      )
    )
  );

  querySisterOutletForCompany = createEffect(() =>
    this.actions.pipe(
      ofType(OfferedServiceServiceActions.queryCompanySisterOutlet),
      switchMap(({ companyId, serviceIds }) =>
        this.offeredServiceDataService.querySisterOutlet(companyId, serviceIds).pipe(
          map((response: { sisterOutlets: SisterOutlet[], offeredServices: OfferedService[] }) => {
            return OfferedServiceApiActions.queryCompanySisterOutletSuccess(response);
          })
        )
      )
    )
  );

  saveOfferedServiceValiditiesForMultipleOutlets = createEffect(() =>
    this.actions.pipe(
      ofType(OfferedServiceServiceActions.saveOfferedServiceValiditiesForMultipleOutlets),
      switchMap(({ multiOfferedService }) =>
        this.offeredServiceDataService.updateValiditiesForMultipleOutlets(multiOfferedService).pipe(
          map(() => {
            this.snackBarService.showInfo('EDIT_SERVICE_VALIDITY_FOR_MULTIPLE_OUTLETS_SUCCESS');
            return OfferedServiceApiActions.saveOfferedServiceValiditiesForMultipleOutletsSuccess();
          }),
          catchError(error => {
            this.snackBarService.showError(error);
            return of(OfferedServiceApiActions.saveOfferedServiceValiditiesForMultipleOutletsError({ error }));
          })
        )
      )
    )
  );

  constructor(
    private actions: Actions,
    private store: Store<servicesState.State>,
    private serviceTableStatusService: ServiceTableStatusService,
    private offeredServiceDataService: OfferedServiceDataService,
    private snackBarService: SnackBarService
  ) {}
}
