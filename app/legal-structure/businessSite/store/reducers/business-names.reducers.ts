import { createReducer, on } from '@ngrx/store';

import { BusinessNamesActions, OutletActions } from '../actions';

export const initialState: string[] = [];

export const reducer = createReducer(
  initialState,
  on(BusinessNamesActions.loadBusinessNamesSuccess, (stateBefore, { businessNames }) => {
    return businessNames;
  }),
  on(OutletActions.resetBusinessSite, () => initialState)
);
