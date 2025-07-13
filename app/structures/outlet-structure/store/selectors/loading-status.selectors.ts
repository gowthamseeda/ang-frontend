import { createSelector } from '@ngrx/store';

import { LoadingStatus } from '../../model/outlet-structure.model';
import { OutletStructureState } from '../reducers';

import { selectOutletStructure } from './outlet-structure.selectors';

export const selectLoadingStatusState = createSelector(
  selectOutletStructure,
  (state: OutletStructureState) => {
    return state.loadingStatus;
  }
);

export const selectIsOutletStructureLoadingState = createSelector(
  selectLoadingStatusState,
  (status: LoadingStatus) => {
    return status.isOutletStructureLoading;
  }
);

export const selectIsLoadingErrorState = createSelector(
  selectLoadingStatusState,
  (status: LoadingStatus) => {
    return status ? status.isError : false;
  }
);
