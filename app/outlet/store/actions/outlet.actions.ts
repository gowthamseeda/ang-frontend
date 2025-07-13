import { createAction, props } from '@ngrx/store';

import { ApiError } from '../../../shared/services/api/api.service';
import { CountryState } from '../reducers/country.reducers';
import { OutletProfileState } from '../reducers/outlet.reducers';

export const loadOutletProfile = createAction(
  '[Outlet API] Load Outlet Profile',
  props<{ outletId: string }>()
);

export const loadOutletProfileSuccess = createAction(
  '[Outlet API] Load Outlet Profile Success',
  props<{
    profile: OutletProfileState;
    country: CountryState;
    languageId: string;
  }>()
);

export const loadOutletProfileFailure = createAction(
  '[Outlet API] Load Outlet Profile Failure',
  props<{ error: ApiError }>()
);
