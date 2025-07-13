import { createReducer, on } from '@ngrx/store';

import { OutletActions } from '../actions';

export interface CountryState {
  translations: { [key: string]: any };
}

export const initialCountryState: CountryState = {
  translations: []
};

export const reducer = createReducer(
  initialCountryState,
  on(OutletActions.loadOutletProfileSuccess, (state, { country }) => ({
    ...initialCountryState,
    ...country
  }))
);
