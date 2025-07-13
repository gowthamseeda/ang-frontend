import { createSelector } from '@ngrx/store';

import { OpeningHoursState, selectOpeningHoursState, Service } from '../reducers';

export const selectOpeningHoursServiceState = createSelector(
  selectOpeningHoursState,
  (state: OpeningHoursState) => {
    return state.service;
  }
);
export const selectOpeningHoursServiceCharacteristic = createSelector(
  selectOpeningHoursServiceState,
  (serviceState: Service) => {
    return serviceState.serviceCharacteristicName;
  }
);
