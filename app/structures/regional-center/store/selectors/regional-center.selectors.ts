import { createSelector } from '@ngrx/store';

import { selectStructuresState, StructuresState } from '../../../store';
import { RegionalCenterState } from '../../model/regional-center-state.model';

export const selectRegionalCenter = createSelector(
  selectStructuresState,
  (structureState: StructuresState) => {
    return structureState.regionalCenter;
  }
);

export const selectRegionalCenters = createSelector(
  selectRegionalCenter,
  (regionalCenterState: RegionalCenterState) => {
    return regionalCenterState.regionalCenters;
  }
);
