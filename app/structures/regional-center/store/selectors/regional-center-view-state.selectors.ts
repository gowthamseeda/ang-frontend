import { createSelector } from '@ngrx/store';

import { RegionalCenterState, ViewStatus } from '../../model/regional-center-state.model';

import { selectRegionalCenter } from './regional-center.selectors';

export const selectRegionalCenterStatus = createSelector(
  selectRegionalCenter,
  (regionalCenterState: RegionalCenterState) => {
    return regionalCenterState.status;
  }
);

export const selectInitialized = createSelector(
  selectRegionalCenterStatus,
  (regionalCenterStatus: ViewStatus) => regionalCenterStatus.error !== undefined
);
