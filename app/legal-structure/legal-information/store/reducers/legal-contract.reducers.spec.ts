import {
  ContractStatusActions,
  LoadContractStatusSuccessPayload,
  RemoveContractStatusPayload,
  UpdateContractStatusPayload
} from '../actions';
import { ContractState, LegalContractStatus } from '../state.model';
import { getContractState_MB_NotRequired } from '../state.mock';

import * as legalContractReducers from './legal-contract.reducers';
import { defaultContractState, initialState } from './legal-contract.reducers';

describe('legal contract reducers suite', () => {
  const contractId = 0;

  test('should not change state for unknown action', () => {
    const stateBefore = [getContractState_MB_NotRequired()];
    const action: any = {};
    const state = legalContractReducers.reducer(stateBefore, action);
    expect(state).toStrictEqual(stateBefore);
  });

  test('should change state for loadContractStatusSuccess action', () => {
    const actionPayload: LoadContractStatusSuccessPayload = { legalContracts: [] };
    const action = ContractStatusActions.loadContractStatusSuccess(actionPayload);
    const state = legalContractReducers.reducer(initialState, action);
    expect(state).toEqual(actionPayload.legalContracts);
  });

  test('should change state for addContractStatus action', () => {
    const stateExpected: ContractState[] = [
      {
        ...defaultContractState,
        status: LegalContractStatus.CREATED,
        id: contractId
      }
    ];

    const action = ContractStatusActions.addContractStatus();
    const state = legalContractReducers.reducer(initialState, action);
    expect(state).toEqual(stateExpected);
  });

  test('should change state for updateContractStatus action', () => {
    const stateBefore: ContractState[] = [
      {
        status: LegalContractStatus.DEFAULT,
        id: contractId,
        brandId: 'SMT',
        companyRelationId: 'MBAG',
        required: false,
        languageId: 'en',
        contractState: '',
        corporateDisclosure: ''
      }
    ];

    const actionPayload: UpdateContractStatusPayload = {
      legalContract: {
        id: contractId,
        brandId: 'MB',
        companyRelationId: 'MBAG',
        required: true,
        languageId: 'de',
        contractState: 'contractState',
        corporateDisclosure: 'corporateDisclosure'
      }
    };

    const stateExpected: ContractState[] = [
      {
        status: LegalContractStatus.UPDATED,
        id: contractId,
        brandId: 'MB',
        companyRelationId: 'MBAG',
        required: true,
        languageId: 'de',
        contractState: 'contractState',
        corporateDisclosure: 'corporateDisclosure'
      }
    ];

    const action = ContractStatusActions.updateContractStatus(actionPayload);
    const state = legalContractReducers.reducer(stateBefore, action);
    expect(state).toEqual(stateExpected);
  });

  test('should change state for removeContractStatus action', () => {
    const contractMB: ContractState = {
      status: LegalContractStatus.DEFAULT,
      id: 123456789,
      brandId: 'MB',
      companyRelationId: 'MBAG',
      required: true
    };
    const contractSMT: ContractState = {
      status: LegalContractStatus.DEFAULT,
      id: contractId,
      brandId: 'SMT',
      companyRelationId: 'MBAG',
      required: false
    };

    const stateBefore: ContractState[] = [contractMB, contractSMT];
    const actionPayload: RemoveContractStatusPayload = { contractId };
    const action = ContractStatusActions.removeContractStatus(actionPayload);
    const state = legalContractReducers.reducer(stateBefore, action);
    expect(state).toEqual([contractMB, { ...contractSMT, status: LegalContractStatus.REMOVED }]);
  });
});
