import { createAction, props } from '@ngrx/store';

import { Country } from '../../../../geography/country/country.model';
import { ApiError } from '../../../../shared/services/api/api.service';

export const loadCountry = createAction(
  '[Country API] Load Country',
  props<{ countryId: string }>()
);
export const loadCountrySuccess = createAction(
  '[Country API] Load Country Success',
  props<{ country: Country }>()
);
export const loadCountryFailure = createAction(
  '[Country API] Load Country Failure',
  props<{ error: ApiError }>()
);
