import { createReducer, on } from '@ngrx/store';

import { DistributionLevelActions, OutletActions } from '../actions';

export const initialState: string[] = [];

export const reducer = createReducer(
  initialState,
  on(
    DistributionLevelActions.loadDistributionLevelsSuccess,
    (stateBefore, { distributionLevels }) => {
      return distributionLevels;
    }
  ),
  on(OutletActions.resetBusinessSite, () => initialState)
);
