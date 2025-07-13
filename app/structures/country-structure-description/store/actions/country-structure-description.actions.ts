import { createAction, props } from '@ngrx/store';

import { ApiError } from '../../../../shared/services/api/api.service';
import { CountryStructureDescription } from '../../model/country-structure-description.model';

export const loadCountryStructureDescription = createAction(
  '[CountryStructureDescription API] load CountryStructureDescriptions',
  props<{ countryId: string }>()
);

export const loadCountryStructureDescriptionSuccess = createAction(
  '[CountryStructureDescription API] load CountryStructureDescriptions Success',
  props<{ countryStructureDescriptions: CountryStructureDescription[] }>()
);

export const countryStructureDescriptionFailure = createAction(
  '[CountryStructureDescription API] Failure',
  props<{ error: ApiError }>()
);
