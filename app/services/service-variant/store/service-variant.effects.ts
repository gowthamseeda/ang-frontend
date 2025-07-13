import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ServiceVariant } from '../service-variant.model';

import { ServiceVariantApiActions, ServiceVariantServiceActions } from './actions';
import { ServiceVariantDataService } from './service-variant-data.service';

@Injectable()
export class ServiceVariantEffects {
  loadServiceVariants = createEffect(() =>
    this.actions.pipe(
      ofType(ServiceVariantServiceActions.loadServiceVariants),
      switchMap(({ outletId }) =>
        this.serviceVariantDataService.getAllForServiceByBusinessSiteId(outletId).pipe(
          map((serviceVariants: ServiceVariant[]) =>
            ServiceVariantApiActions.loadServiceVariantsSuccess({ serviceVariants })
          ),
          catchError(error => of(ServiceVariantApiActions.loadServiceVariantsError({ error })))
        )
      )
    )
  );

  constructor(
    private actions: Actions,
    private serviceVariantDataService: ServiceVariantDataService
  ) {}
}
