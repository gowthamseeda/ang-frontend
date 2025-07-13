import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import { DistributionLevelActions, OutletStructureActions } from '../actions';

@Injectable()
export class DistributionLevelEffects {
  loadDistributionLevels = createEffect(() =>
    this.actions.pipe(
      ofType(OutletStructureActions.loadOutletStructures),
      map((actionPayload: any) => actionPayload.outletId),
      switchMap(outletId =>
        this.distributionLevelsService.get(outletId).pipe(
          map((distributionLevels: string[]) =>
            DistributionLevelActions.loadDistributionLevelSuccess({
              distributionLevels: distributionLevels
            })
          ),
          catchError(error =>
            of(DistributionLevelActions.loadDistributionLevelFailure({ error: error }))
          )
        )
      )
    )
  );

  constructor(
    private actions: Actions,
    private distributionLevelsService: DistributionLevelsService
  ) {}
}
