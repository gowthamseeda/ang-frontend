import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ApiError } from '../../../../shared/services/api/api.service';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import { DistributionLevelActions } from '../actions';

@Injectable()
export class DistributionLevelEffects {
  loadDistributionLevels = createEffect(() =>
    this.actions.pipe(
      ofType(DistributionLevelActions.loadDistributionLevels),
      map((action: any) => action.outletId),
      switchMap((outletId: string) =>
        this.distributionLevelService.get(outletId).pipe(
          map((distributionLevels: string[]) =>
            DistributionLevelActions.loadDistributionLevelsSuccess({
              distributionLevels: distributionLevels
            })
          ),
          catchError((error: ApiError) =>
            of(DistributionLevelActions.loadDistributionLevelsFailure({ error: error }))
          )
        )
      )
    )
  );

  constructor(
    private actions: Actions,
    private distributionLevelService: DistributionLevelsService
  ) {}
}
