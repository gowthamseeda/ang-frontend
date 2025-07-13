import { Action, combineReducers } from '@ngrx/store';

import * as fromContractsState from './contracts.reducer';
import { ContractSubState } from './contracts.reducer';
import * as fromOfferedServiceState from './offered-services.reducer';
import { OfferedServiceSubState } from './offered-services.reducer';

export interface ContractState {
  contract: ContractSubState;
  offeredService: OfferedServiceSubState;
}

export const featureKey = 'contracts';

export function reducers(state: ContractState | undefined, action: Action): any {
  return combineReducers({
    contract: fromContractsState.reducer,
    offeredService: fromOfferedServiceState.reducer
  })(state, action);
}
