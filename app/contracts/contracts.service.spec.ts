import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { BehaviorSubject, Observable } from 'rxjs';

import { LegalStructureRoutingService } from '../legal-structure/legal-structure-routing.service';

import { ContractsDataService } from './contracts.data-service';
import { ContractsService } from './contracts.service';
import { brandProductGroupIdMock } from './model/brand-product-group-id.mock';
import { contractMock } from './model/contract.mock';
import { offeredServiceMock } from './model/offered-service.mock';
import { ContractsServiceActions } from './store/actions';
import { ContractState } from './store/reducers';
import * as offeredServiceSelector from './store/selectors/offered-services.selectors';

class LegalStructureRoutingServiceStub {
  outletIdChanges = new BehaviorSubject<string>('GS1');
}

describe('ContractsService', () => {
  const legalStructureRoutingServiceStub = new LegalStructureRoutingServiceStub();
  let contractsDataServiceSpy: Spy<ContractsDataService>;
  let service: ContractsService;
  let store: MockStore<ContractState>;
  let actions: Observable<any>;

  beforeEach(() => {
    contractsDataServiceSpy = createSpyFromClass(ContractsDataService);

    contractsDataServiceSpy.getContractor.nextWith(contractMock[0].contractor);
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: LegalStructureRoutingService, useValue: legalStructureRoutingServiceStub },
        { provide: ContractsDataService, useValue: contractsDataServiceSpy },
        provideMockActions(() => actions),
        provideMockStore(),
      ],

    });

    service = TestBed.inject(ContractsService);
    actions = TestBed.inject(Actions);
    store = TestBed.inject(MockStore);
    store.overrideSelector(offeredServiceSelector.selectAll, [...offeredServiceMock]);
    jest.spyOn(store, 'dispatch');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getContractor', () => {
    it('should get a contractor', done => {
      service.getContractor().subscribe(contractor => {
        expect(contractor).toEqual(contractMock[0].contractor);
        done();
      });
    });
  });

  describe('upsertContracts', () => {
    it('should dispatch a ContractsServiceAction to add contracts', () => {
      const expectedAction = ContractsServiceActions.addContracts({ contracts: [] });
      const contract = contractMock[0];
      service.upsertContracts(contract.contractee.id, [], 0, 0, undefined, contract.contractor);

      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should dispatch a ContractsServiceAction to update the contracts', () => {
      const contractToUpdate = contractMock[0];
      const expectedAction = ContractsServiceActions.updateContracts({
        contractEntityIds: [contractToUpdate.offeredService.id],
        contracteeId: 'AnotherContracteeID'
      });
      service.upsertContracts(
        'AnotherContracteeID',
        [brandProductGroupIdMock[0]],
        contractToUpdate.offeredService.productCategoryId,
        contractToUpdate.offeredService.serviceId,
        undefined
      );

      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });

  describe('deleteContracts', () => {
    it('should dispatch a ContractsServiceAction to delete contracts', () => {
      const contractToDelete = contractMock[0];
      const expectedAction = ContractsServiceActions.removeContracts({
        contractEntityIds: [contractToDelete.offeredService.id]
      });
      service.deleteContracts(
        [brandProductGroupIdMock[0]],
        contractToDelete.offeredService.productCategoryId,
        contractToDelete.offeredService.serviceId
      );

      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it('should not dispatch any action', () => {
      const contractToDelete = contractMock[0];
      service.deleteContracts(
        [brandProductGroupIdMock[1]],
        contractToDelete.offeredService.productCategoryId,
        contractToDelete.offeredService.serviceId
      );

      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should dispatch a ContractsServiceAction to save the contract', () => {
      const expectedAction = ContractsServiceActions.saveContracts({ contractorId: '0' });
      service.saveContracts('0');

      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });
  });
});
