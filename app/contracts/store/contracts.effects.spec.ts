import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { ApiError } from '../../shared/services/api/api.service';
import { SnackBarService } from '../../shared/services/snack-bar/snack-bar.service';
import { ContractsDataService } from '../contracts.data-service';
import { contractMock } from '../model/contract.mock';
import { offeredServiceMock } from '../model/offered-service.mock';

import { ContractsEffectActions, ContractsServiceActions } from './actions';
import { AddContract } from './actions/contracts.service-actions';
import { ContractsEffects } from './contracts.effects';
import { ContractState } from './reducers';
import * as contractSelector from './selectors/contracts.selectors';

describe('ContractsEffects', () => {
  let snackBarServiceSpy: Spy<SnackBarService>;
  let actions: Observable<any>;
  let effects: ContractsEffects;
  let contractsDataService: Spy<ContractsDataService>;
  let store: MockStore<ContractState>;

  beforeEach(() => {
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    contractsDataService = createSpyFromClass(ContractsDataService);

    // need to reset testing module before configure again (destroyAfterEach is enabled)
    TestBed.resetTestingModule();

    TestBed.configureTestingModule({
      providers: [
        ContractsEffects,
        provideMockStore(),
        provideMockActions(() => actions),
        {
          provide: ContractsDataService,
          useValue: contractsDataService
        },
        {
          provide: SnackBarService,
          useValue: snackBarServiceSpy
        }
      ]
    });

    actions = TestBed.inject(Actions);
    effects = TestBed.inject(ContractsEffects);
    store = TestBed.inject(MockStore);
    store.overrideSelector(contractSelector.selectAll, [...contractMock]);
  });

  it('should be created', () => {
    const service: ContractsEffects = TestBed.inject(ContractsEffects);
    expect(service).toBeTruthy();
  });

  describe('loadContracts', () => {
    it('should return a loadContractsSuccess action with the contracts on success', () => {
      const contracts = contractMock;
      const action = ContractsServiceActions.loadContracts({ contractorId: 'GS20000001' });
      const outcome = ContractsEffectActions.loadContractsSuccess({ contracts });

      actions = hot('-a', { a: action });
      const response = cold('-a|', { a: contracts });
      const expected = cold('--b', { b: outcome });
      contractsDataService.get.mockReturnValue(response);

      expect(effects.loadContracts).toBeObservable(expected);
    });

    it('should return a loadContractsFailure action with the error on failure', () => {
      const error = { message: 'GENERAL_API_ERROR' } as ApiError;
      const action = ContractsServiceActions.loadContracts({ contractorId: 'GS20000001' });
      const outcome = ContractsEffectActions.loadContractsFailure({ error });

      actions = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--b', { b: outcome });
      contractsDataService.get.mockReturnValue(response);

      expect(effects.loadContracts).toBeObservable(expected);
    });
  });

  describe('loadOfferedServices', () => {
    it('should return a loadOfferedServicesSuccess action with the offered services on success', () => {
      const offeredServices = offeredServiceMock;
      const action = ContractsServiceActions.loadOfferedServices({ contractorId: 'GS20000001' });
      const outcome = ContractsEffectActions.loadOfferedServicesSuccess({ offeredServices });

      actions = hot('-a', { a: action });
      const response = cold('-a|', { a: offeredServices });
      const expected = cold('--b', { b: outcome });
      contractsDataService.getOfferedServices.mockReturnValue(response);

      expect(effects.loadOfferedServices).toBeObservable(expected);
    });

    it('should return a loadOfferedServicesFailure action with the error on failure', () => {
      const error = { message: 'GENERAL_API_ERROR' } as ApiError;
      const action = ContractsServiceActions.loadOfferedServices({ contractorId: 'GS20000001' });
      const outcome = ContractsEffectActions.loadOfferedServicesFailure({ error });

      actions = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--b', { b: outcome });
      contractsDataService.getOfferedServices.mockReturnValue(response);

      expect(effects.loadOfferedServices).toBeObservable(expected);
    });
  });

  describe('loadContractee', () => {
    const contract = contractMock[0];
    const contractEntityIds = [contract.offeredService.id];
    const action = ContractsServiceActions.updateContracts({
      contractEntityIds,
      contracteeId: contract.contractee.id
    });

    it('should return a loadContracteeOfChangedContractsSuccess action with contractEntityIds and contractee on success', () => {
      const outcome = ContractsEffectActions.loadContracteeOfChangedContractsSuccess({
        contractEntityIds,
        contractee: contract.contractee
      });

      actions = hot('-a', { a: action });
      const response = cold('-a|', { a: contract.contractee });
      const expected = cold('--b', { b: outcome });
      contractsDataService.getContractee.mockReturnValue(response);

      expect(effects.loadContractee).toBeObservable(expected);
    });

    it('should return a loadContracteeOfChangedContractsFailure action with the error on failure', () => {
      const error = { message: 'GENERAL_API_ERROR' } as ApiError;
      const outcome = ContractsEffectActions.loadContracteeOfChangedContractsFailure({ error });

      actions = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--b', { b: outcome });
      contractsDataService.getContractee.mockReturnValue(response);

      expect(effects.loadContractee).toBeObservable(expected);
    });
  });

  describe('loadContracteeOfContract', () => {
    const contracts: AddContract[] = [
      {
        contractor: contractMock[0].contractor,
        contracteeId: contractMock[0].contractee.id,
        offeredService: contractMock[0].offeredService
      }
    ];
    const action = ContractsServiceActions.addContracts({ contracts });

    it('should return a loadContracteeOfNewContractsSuccess action with the contracts on success', () => {
      const outcome = ContractsEffectActions.loadContracteeOfNewContractsSuccess({
        contracts: [contractMock[0]]
      });

      actions = hot('-a', { a: action });
      const response = cold('-a|', { a: contractMock[0].contractee });
      const expected = cold('--b', { b: outcome });
      contractsDataService.getContractee.mockReturnValue(response);

      expect(effects.loadContracteeOfContract).toBeObservable(expected);
    });

    it('should return a loadContracteeOfNewContractsFailure action with the error on failure', () => {
      const error = { message: 'GENERAL_API_ERROR' } as ApiError;
      const outcome = ContractsEffectActions.loadContracteeOfNewContractsFailure({ error });

      actions = hot('-a', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('--b', { b: outcome });
      contractsDataService.getContractee.mockReturnValue(response);

      expect(effects.loadContracteeOfContract).toBeObservable(expected);
    });
  });

  describe('saveContracts', () => {
    const action = ContractsServiceActions.saveContracts({ contractorId: 'GS20000001' });
    let scheduler: TestScheduler;

    beforeEach(() => {
      scheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
    });

    it('should return a saveContractsSuccess action on success', () => {
      const outcome = ContractsEffectActions.saveContractsSuccess();

      scheduler.run(({ expectObservable }) => {
        actions = scheduler.createHotObservable('-a', { a: action });
        const response = scheduler.createColdObservable('-a|', { a: {} });
        contractsDataService.update.mockReturnValue(response);

        expectObservable(effects.saveContracts).toBe('--b', { b: outcome });
      });
    });

    it('should return a saveContractsFailure action on failure', () => {
      const error = { message: 'GENERAL_API_ERROR' } as ApiError;
      const outcome = ContractsEffectActions.saveContractsFailure({ error });

      scheduler.run(({ expectObservable }) => {
        actions = scheduler.createColdObservable('-a', { a: action });
        const response = scheduler.createColdObservable('-#|', {}, error);
        contractsDataService.update.mockReturnValue(response);

        expectObservable(effects.saveContracts).toBe('--b', { b: outcome });
      });
    });
  });
});
