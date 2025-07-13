import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ApiError } from '../../../../shared/services/api/api.service';
import { GroupedBusinessName } from '../../../../traits/business-names/business-names.model';
import { BusinessNamesService } from '../../../../traits/business-names/business-names.service';
import { BusinessNamesActions } from '../actions';

@Injectable()
export class BusinessNamesEffects {
  loadBusinessNames = createEffect(() =>
    this.actions.pipe(
      ofType(BusinessNamesActions.loadBusinessNames),
      map((action: any) => action.outletId),
      switchMap((outletId: string) =>
        this.businessNamesService.get(outletId).pipe(
          map((businessNames: GroupedBusinessName[]) =>
            BusinessNamesActions.loadBusinessNamesSuccess({
              businessNames: businessNames.map(businessName => businessName.name)
            })
          ),
          catchError((error: ApiError) =>
            of(BusinessNamesActions.loadBusinessNamesFailure({ error: error }))
          )
        )
      )
    )
  );

  constructor(private actions: Actions, private businessNamesService: BusinessNamesService) {}
}
