import { createEntityAdapter, EntityAdapter, EntityState, Update } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { Contract } from '../../model/contract.model';
import { ContractsEffectActions, ContractsServiceActions } from '../actions';

export interface ContractSubState extends EntityState<Contract> {}

export const adapter: EntityAdapter<Contract> = createEntityAdapter<Contract>({
  selectId: (contract: Contract) => contract.offeredService.id
});
export const initialState: ContractSubState = adapter.getInitialState();

export const reducer = createReducer(
  initialState,
  on(ContractsEffectActions.loadContractsSuccess, (state, { contracts }) =>
    adapter.setAll(contracts, initialState)
  ),
  on(ContractsEffectActions.loadContractsFailure, () => adapter.setAll([], initialState)),
  on(
    ContractsEffectActions.loadContracteeOfChangedContractsSuccess,
    (state, { contractEntityIds, contractee }) => {
      const contractsToBeUpdated: Update<Contract>[] = contractEntityIds.map(contractEntityId => ({
        id: contractEntityId,
        changes: { contractee }
      }));
      return adapter.updateMany(contractsToBeUpdated, state);
    }
  ),
  on(ContractsEffectActions.loadContracteeOfNewContractsSuccess, (state, { contracts }) => {
    return adapter.addMany(contracts, state);
  }),
  on(ContractsServiceActions.removeContracts, (state, { contractEntityIds }) => {
    return adapter.removeMany(contractEntityIds, state);
  })
);
