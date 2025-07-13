import { createSelector } from '@ngrx/store';

import { LegalStructureState, selectLegalStructureState } from '../../../store';
import { BusinessSiteState } from '../state.model';

export const selectBusinessSiteState = createSelector(
  selectLegalStructureState,
  (state: LegalStructureState) => {
    return state.businessSiteState;
  }
);

export const selectBusinessNamesState = createSelector(
  selectBusinessSiteState,
  (state: BusinessSiteState) => {
    return state.businessNames;
  }
);

export const selectDistributionLevelsState = createSelector(
  selectBusinessSiteState,
  (state: BusinessSiteState) => {
    return state.distributionLevels;
  }
);

export const selectBrandIdsState = createSelector(
  selectBusinessSiteState,
  (state: BusinessSiteState) => {
    return state.brandIds;
  }
);
