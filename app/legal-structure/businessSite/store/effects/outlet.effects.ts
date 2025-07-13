import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { clone } from 'ramda';
import { forkJoin, of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import { ApiError } from '../../../../shared/services/api/api.service';
import { Outlet } from '../../../shared/models/outlet.model';
import { OutletService } from '../../../shared/services/outlet.service';
import { OutletActions } from '../actions';
import { loadCountry } from '../actions/country.actions';

@Injectable()
export class OutletEffects {
  loadOutlet$ = createEffect(() =>
    this.actions.pipe(
      ofType(OutletActions.loadOutlet),
      filter((action: any) => action.outletId),
      map((action: any) => action.outletId),
      tap(outletId => this.outletService.clearBusinessSite(outletId)),
      switchMap(outletId => this.outletService.getOrLoadBusinessSite(outletId)),
      switchMap((outlet: Outlet) => {
        return [
          OutletActions.loadOutletSuccess({
            outlet: { ...outlet, hasAssignableLabels: true } // remove adoption when backend delivers this information
          }),
          loadCountry({ countryId: outlet.countryId })
        ];
      }),
      catchError((error: ApiError) => {
        return of(OutletActions.loadOutletFailure({ error }));
      })
    )
  );

  toggleOutletAffiliate = createEffect(() =>
    this.actions.pipe(
      ofType(OutletActions.toggleOutletAffiliate),
      map((actionPayload: any) => {
        const outletToChange = clone(actionPayload.outlet);
        outletToChange.affiliate = !actionPayload.outlet.affiliate;
        return outletToChange;
      }),
      switchMap((updatedOutlet: Outlet) =>
        forkJoin([
          of(updatedOutlet.id),
          this.outletService.update(updatedOutlet.companyId, updatedOutlet.id, updatedOutlet)
        ])
      ),
      switchMap((res: any) => {
        return of(OutletActions.loadOutlet({ outletId: res[0] }));
      }),
      catchError((error: any) => {
        return of(OutletActions.saveOutletFailure({ error }));
      })
    )
  );

  constructor(private actions: Actions, private outletService: OutletService) {}
}
