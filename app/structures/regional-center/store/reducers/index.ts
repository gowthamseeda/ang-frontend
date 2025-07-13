import { Action, combineReducers } from '@ngrx/store';

import { RegionalCenterState } from '../../model/regional-center-state.model';

import * as fromRegionalViewStatus from './regional-center-view-status.reducer';
import * as fromRegionalCenters from './regional-centers.reducers';

export const initialState: RegionalCenterState = {
  regionalCenters: fromRegionalCenters.initialState,
  status: fromRegionalViewStatus.initialState
};

export function reducers(
  regionalCenterState: RegionalCenterState | undefined,
  action: Action
): any {
  return combineReducers({
    regionalCenters: fromRegionalCenters.reducer,
    status: fromRegionalViewStatus.reducer
  })(regionalCenterState, action);
}
