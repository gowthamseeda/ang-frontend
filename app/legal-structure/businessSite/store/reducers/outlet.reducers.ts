import { createReducer, on } from '@ngrx/store';

import { OutletActions } from '../actions';

export const initialState: any = undefined;

export const reducer = createReducer(
  initialState,
  on(OutletActions.loadOutletSuccess, (state, { outlet }) => ({
    ...outlet
  })),
  on(OutletActions.resetBusinessSite, () => initialState)
);
