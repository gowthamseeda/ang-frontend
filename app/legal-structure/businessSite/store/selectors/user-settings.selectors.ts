import { createSelector } from '@ngrx/store';

import { BusinessSiteState } from '../state.model';

import { selectBusinessSiteState } from './business-site.selectors';

export const selectLanguageState = createSelector(
  selectBusinessSiteState,
  (state: BusinessSiteState) => {
    return state.languageId;
  }
);
