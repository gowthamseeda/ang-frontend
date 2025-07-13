import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';

import { ServiceApiActions, ServiceServiceActions } from './actions';
import { ServiceDataService } from './service-data.service';

@Injectable()
export class ServiceEffects {
  loadServices = createEffect(() =>
    this.actions.pipe(
      ofType(ServiceServiceActions.loadServices),
      switchMap(() =>
        this.serviceDataService.getAll().pipe(
          map(services => ServiceApiActions.loadServicesSuccess({ services })),
          catchError(error => of(ServiceApiActions.loadServicesError({ error })))
        )
      )
    )
  );
  loadService = createEffect(() =>
    this.actions.pipe(
      ofType(ServiceServiceActions.loadService),
      mergeMap(({ serviceId }) =>
        this.serviceDataService.get(serviceId).pipe(
          map(service => ServiceApiActions.loadServiceSuccess({ service })),
          catchError(error => of(ServiceApiActions.loadServiceError({ error })))
        )
      )
    )
  );

  constructor(private actions: Actions, private serviceDataService: ServiceDataService) {}
}
