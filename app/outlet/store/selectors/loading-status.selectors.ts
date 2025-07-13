import { createSelector } from '@ngrx/store';

import { OutletState, selectOutletState } from '../reducers';
import { LoadingStatusState } from '../reducers/loading.reducers';

import { selectBusinessSiteState } from './outlet-profile.selectors';

export const selectIsLoadingState = createSelector(
  selectOutletState,
  (outletState: OutletState) => {
    return outletState.loadingStatus;
  }
);

export const selectLoadingStatusState = createSelector(
  selectIsLoadingState,
  (loadingStatusState: LoadingStatusState) => {
    return loadingStatusState.isProfileLoading;
  }
);

export const selectIsLoadingErrorState = createSelector(
  selectIsLoadingState,
  (loadingStatusState: LoadingStatusState) => {
    return loadingStatusState.isError;
  }
);

export const selectInitializedState = createSelector(
  selectBusinessSiteState,
  selectIsLoadingErrorState,
  (businessSiteState, isLoadingFailed, props) => {
    return isLoadingFailed === true || businessSiteState.id === props.outletId;
  }
);
