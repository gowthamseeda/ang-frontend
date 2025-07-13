import { createSelector } from '@ngrx/store';

import { LoadingStatus } from '../../models/loading-status.model';
import { OpeningHoursState, selectOpeningHoursState } from '../reducers';

import { selectOutlet } from './outlet-selectors';
import { selectOpeningHoursServiceState } from './service-selectors';

export const selectOpeningHoursLoadingStatus = createSelector(
  selectOpeningHoursState,
  (state: OpeningHoursState) => {
    return state.loadingStatus;
  }
);

export const selectBrandProductGroupOpeningHoursLoadingStatus = createSelector(
  selectOpeningHoursLoadingStatus,
  (loadingStatusState: LoadingStatus) => {
    return loadingStatusState.isOpeningHoursLoading;
  }
);

export const selectIsLoadingErrorState = createSelector(
  selectOpeningHoursLoadingStatus,
  (loadingStatusState: LoadingStatus) => {
    return loadingStatusState.isError && !loadingStatusState.isOpeningHoursLoading;
  }
);

export const selectIsNotFoundError = createSelector(
  selectOpeningHoursLoadingStatus,
  (loadingStatusState: LoadingStatus) => {
    return 404 === loadingStatusState.errorStatus;
  }
);

export const selectInitializedState = createSelector(
  selectOutlet,
  selectOpeningHoursServiceState,
  selectIsLoadingErrorState,
  (outletState: any, serviceState: any, isLoadingFailed: any, props: any) => {
    return (
      !isLoadingFailed &&
      outletState.businessSiteId === props.outletId &&
      serviceState.productCategoryId === props.productCategoryId &&
      serviceState.serviceId === props.serviceId &&
      ((props.serviceCharacteristicsId === undefined &&
        serviceState.serviceCharacteristicsId === '') ||
        (props.serviceCharacteristicsId !== undefined &&
          serviceState.serviceCharacteristicsId === props.serviceCharacteristicsId))
    );
  }
);
