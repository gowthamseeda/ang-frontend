import { createReducer, on } from '@ngrx/store';

import { OutletActions, OutletCountryActions } from '../actions';

export const initialState: any = undefined;

export const reducer = createReducer(
  initialState,
  on(OutletCountryActions.loadCountrySuccess, (state, { country }) => ({
    ...country
  })),
  on(OutletActions.resetBusinessSite, () => initialState)
);
