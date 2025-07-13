import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { servicesState } from '../store';

import { OfferedServiceMock } from './offered-service.mock';
import { OfferedService } from './offered-service.model';
import { OfferedServiceService } from './offered-service.service';
import { OfferedServiceServiceActions } from './store/actions';

describe('Offered Service Service', () => {
  const offeredServices = OfferedServiceMock.asList();

  let service: OfferedServiceService;
  let store: MockStore<servicesState.State>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [OfferedServiceService, provideMockStore()]
    });

    service = TestBed.inject(OfferedServiceService);
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
  });

  describe('add()', () => {
    it('should dispatch a OfferedServiceServiceActions.addOfferedService when add is called', () => {
      const offeredService: OfferedService = offeredServices[0];
      const action = OfferedServiceServiceActions.addOfferedService({ offeredService });
      service.add(offeredService);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('remove()', () => {
    it('should dispatch a OfferedServiceServiceActions.removeOfferedService when remove is called', () => {
      const offeredService: OfferedService = offeredServices[0];
      const id = offeredService.id;
      const action = OfferedServiceServiceActions.removeOfferedService({ id });
      service.remove(id);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('save()', () => {
    it('should dispatch a OfferedServiceServiceActions.saveOfferedServices when save is called', () => {
      const action = OfferedServiceServiceActions.saveOfferedServices({ outletId: '0' });
      service.save('0');
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });

  describe('reset()', () => {
    it('should dispatch a OfferedServiceServiceActions.resetOfferedServices when reset is called', () => {
      const action = OfferedServiceServiceActions.resetOfferedServices();
      service.resetAll();
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
});
