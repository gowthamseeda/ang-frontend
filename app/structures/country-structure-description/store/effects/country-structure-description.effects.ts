import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { ApiError } from '../../../../shared/services/api/api.service';
import {
  CountryStructureDescription,
  CountryStructureDescriptionResponse
} from '../../model/country-structure-description.model';
import { CountryStructureDescriptionApiService } from '../../service/country-structure-description-api.service';
import { CountryStructureDescriptionActions } from '../actions';

@Injectable()
export class CountryStructureDescriptionEffects {
  loadCountryStructureDescriptions = createEffect(() =>
    this.actions.pipe(
      ofType(CountryStructureDescriptionActions.loadCountryStructureDescription),
      switchMap(({ countryId }) =>
        this.countryStructureDescriptionApiService.getCountryStructureDescriptions(countryId)
      ),
      switchMap((countryStructureDescriptionsResponse: CountryStructureDescriptionResponse[]) => {
        const countryStructureDescriptions: CountryStructureDescription[] = countryStructureDescriptionsResponse.map(
          descriptionResponse => {
            return {
              ...descriptionResponse,
              structures: descriptionResponse.structures ? descriptionResponse.structures : []
            };
          }
        );
        return of(
          CountryStructureDescriptionActions.loadCountryStructureDescriptionSuccess({
            countryStructureDescriptions: countryStructureDescriptions
          })
        );
      }),
      catchError((error: ApiError) => {
        return of(
          CountryStructureDescriptionActions.countryStructureDescriptionFailure({ error: error })
        );
      })
    )
  );

  constructor(
    private actions: Actions,
    private countryStructureDescriptionApiService: CountryStructureDescriptionApiService
  ) {}
}
