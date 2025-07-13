import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { ApiError } from '../../../../shared/services/api/api.service';
import { BrandCode } from '../../../../traits/shared/brand-code/brand-code.model';
import { BrandCodeService } from '../../../../traits/shared/brand-code/brand-code.service';
import { BrandsActions } from '../actions';

@Injectable()
export class BrandsEffects {
  loadBrands = createEffect(() =>
    this.actions.pipe(
      ofType(BrandsActions.loadBrands),
      map((action: any) => action.outletId),
      switchMap((outletId: string) =>
        this.brandCodeService.get(outletId).pipe(
          map((brandCodes: BrandCode[]) =>
            BrandsActions.loadBrandsSuccess({
              brandIds: brandCodes.map((code: BrandCode) => code.brandId)
            })
          ),
          catchError((error: ApiError) => of(BrandsActions.loadBrandsFailure({ error: error })))
        )
      )
    )
  );

  constructor(private actions: Actions, private brandCodeService: BrandCodeService) {}
}
