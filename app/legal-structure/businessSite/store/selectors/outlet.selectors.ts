import { createSelector } from '@ngrx/store';

import { BusinessSiteState } from '../state.model';

import { selectBusinessSiteState } from './business-site.selectors';

export const selectOutletState = createSelector(
  selectBusinessSiteState,
  (state: BusinessSiteState) => {
    return state.outlet;
  }
);

export const selectCountryId = createSelector(
  selectBusinessSiteState,
  (state: BusinessSiteState) => {
    return state.outlet?.countryId;
  }
);
