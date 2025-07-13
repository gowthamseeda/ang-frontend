import * as fromContractsReducer from './contracts.reducer';
import { contractMock } from '../../model/contract.mock';
import { Contract } from '../../model/contract.model';
import { ContractsEffectActions } from '../actions';
import { offeredServiceMock } from '../../model/offered-service.mock';

describe('Contracts Reducer', () => {
  const contractEntities = toContractEntities(contractMock);
  const contractEntityIds = contractMock.map(contract => contract.offeredService.id);

  describe('undefined action', () => {
    it('should return default state', () => {
      const { initialState } = fromContractsReducer;
      const action = {} as any;
      const state = fromContractsReducer.reducer(undefined, action);
      expect(state).toEqual(initialState);
    });
  });

  describe('loadContractsSuccess', () => {
    it('should load contract state', () => {
      const expectedState: fromContractsReducer.ContractSubState = {
        ids: contractEntityIds,
        entities: contractEntities
      };
      const { initialState } = fromContractsReducer;
      const action = ContractsEffectActions.loadContractsSuccess({
        contracts: contractMock
      });
      const state = fromContractsReducer.reducer(initialState, action);

      expect(state).toEqual(expectedState);
    });
  });

  describe('loadContracteeOfChangedContractsSuccess', () => {
    it('should update changed contracts to state', () => {
      const mockState: fromContractsReducer.ContractSubState = {
        ids: contractEntityIds,
        entities: contractEntities
      };
      const newContractee = contractMock[0].contractee;
      newContractee.legalName = 'New Contractee';
      const action = ContractsEffectActions.loadContracteeOfChangedContractsSuccess({
        contractEntityIds: ['GS20000001-3'],
        contractee: newContractee
      });

      const state = fromContractsReducer.reducer(mockState, action);
      const expectedContractEntity = contractEntities['GS20000001-3'];
      expectedContractEntity.contractee = newContractee;
      const expectedState: fromContractsReducer.ContractSubState = {
        ids: contractEntityIds,
        entities: {
          'GS20000001-1': contractEntities['GS20000001-1'],
          'GS20000001-3': expectedContractEntity
        }
      };

      expect(state).toEqual(expectedState);
    });
  });

  describe('loadContracteeOfNewContractsSuccess', () => {
    it('should add new contracts to state', () => {
      const mockState: fromContractsReducer.ContractSubState = {
        ids: contractEntityIds,
        entities: contractEntities
      };
      const newContract = {
        contractor: contractMock[0].contractor,
        contractee: contractMock[0].contractee,
        offeredService: offeredServiceMock[1]
      };
      const action = ContractsEffectActions.loadContracteeOfNewContractsSuccess({
        contracts: [newContract]
      });

      const state = fromContractsReducer.reducer(mockState, action);
      const expectedState: fromContractsReducer.ContractSubState = {
        ids: contractEntityIds.concat(newContract.offeredService.id),
        entities: {
          ...contractEntities,
          'GS20000001-2': newContract
        }
      };

      expect(state).toEqual(expectedState);
    });
  });
});

function toContractEntities(contracts: Contract[]) {
  return contracts.reduce(
    (accumulator, contract) =>
      Object.assign(accumulator, { [contract.offeredService.id]: contract }),
    {}
  );
}
