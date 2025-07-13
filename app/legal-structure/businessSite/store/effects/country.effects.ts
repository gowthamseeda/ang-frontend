import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { Country } from '../../../../geography/country/country.model';
import { CountryService } from '../../../../geography/country/country.service';
import { ApiError } from '../../../../shared/services/api/api.service';
import { loadCountry, loadCountryFailure, loadCountrySuccess } from '../actions/country.actions';

@Injectable()
export class CountryEffects {
  loadCountry = createEffect(() =>
    this.actions.pipe(
      ofType(loadCountry),
      map((action: any) => action.countryId),
      switchMap(countryId => this.countryService.get(countryId)),
      switchMap((country: Country) => {
        return of(
          loadCountrySuccess({
            country: country
          })
        );
      }),
      catchError((error: ApiError) => {
        return of(loadCountryFailure({ error }));
      })
    )
  );

  constructor(private actions: Actions, private countryService: CountryService) {}
}
