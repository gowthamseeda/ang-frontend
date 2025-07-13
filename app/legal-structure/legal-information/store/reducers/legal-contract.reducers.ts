import { createReducer, on } from '@ngrx/store';

import { ContractStatusActions } from '../actions';
import { ContractState, LegalContractStatus } from '../state.model';

export const initialState: ContractState[] = [];

export const defaultContractState: ContractState = {
  id: -1,
  brandId: '',
  companyRelationId: '',
  contractState: '',
  corporateDisclosure: '',
  required: false,
  languageId: '',
  status: LegalContractStatus.DEFAULT
};

export const reducer = createReducer(
  initialState,
  on(
    ContractStatusActions.loadContractStatusSuccess,
    (state, { legalContracts }) => legalContracts
  ),
  on(ContractStatusActions.addContractStatus, (state, {}) => {
    const legalContract: ContractState = {
      ...defaultContractState,
      status: LegalContractStatus.CREATED,
      id: state.length
    };
    return state.concat(legalContract);
  }),
  on(ContractStatusActions.updateContractStatus, (state, { legalContract }) => {
    return state.map(contract => {
      if (contract.id === legalContract.id) {
        return {
          ...legalContract,
          status:
            contract.status === LegalContractStatus.DEFAULT
              ? LegalContractStatus.UPDATED
              : contract.status
        };
      }
      return contract;
    });
  }),
  on(ContractStatusActions.removeContractStatus, (state, { contractId }) => {
    return state.map(contract => {
      const status = contract.id === contractId ? LegalContractStatus.REMOVED : contract.status;
      return { ...contract, status };
    });
  })
);
