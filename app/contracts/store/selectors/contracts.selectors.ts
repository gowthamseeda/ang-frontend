import { createSelector } from '@ngrx/store';

import { Contract } from '../../model/contract.model';
import { ContractState } from '../reducers';
import { adapter } from '../reducers/contracts.reducer';

import { selectContractState } from './index';

export const selectContractSubState = createSelector(
  selectContractState,
  (state: ContractState) => state.contract
);

const entitySelectors = adapter.getSelectors(selectContractSubState);

export const selectAll = createSelector(
  entitySelectors.selectAll,
  (contracts: Contract[]) => contracts
);
