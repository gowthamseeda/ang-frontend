import { createSelector } from '@ngrx/store';

import { BusinessSiteState, LoadingStatus } from '../state.model';

import { selectBusinessSiteState } from './business-site.selectors';

export const selectLoadingStatusState = createSelector(
  selectBusinessSiteState,
  (state: BusinessSiteState) => {
    return state.loadingStatus;
  }
);

export const selectIsOutletLoadingState = createSelector(
  selectLoadingStatusState,
  (status: LoadingStatus) => {
    return status.isOutletLoading;
  }
);

export const selectIsLoadingErrorState = createSelector(
  selectLoadingStatusState,
  (status: LoadingStatus) => {
    return status.isError;
  }
);
