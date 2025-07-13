import { createReducer, on } from '@ngrx/store';

import { BrandsActions, OutletActions } from '../actions';

export const initialState: string[] = [];

export const reducer = createReducer(
  initialState,
  on(BrandsActions.loadBrandsSuccess, (stateBefore, { brandIds }) => {
    return brandIds;
  }),
  on(OutletActions.resetBusinessSite, () => initialState)
);
