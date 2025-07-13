import { ServiceMock } from '../models/service.mock';

import { ServiceApiActions, ServiceServiceActions } from './actions';
import * as fromService from './service.reducer';
import { reducer } from './service.reducer';

describe('Service Reducer', () => {
  const serviceIds = ServiceMock.asIds();
  const serviceEntities = ServiceMock.asMap();
  const servicesList = ServiceMock.asList();

  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromService;
      const action = {} as any;
      const state = fromService.reducer(undefined, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('loadServicesSuccess', () => {
    it('should keep entities unchanged but set loading state to false', () => {
      const expectedState: fromService.State = {
        ids: [serviceIds[0], serviceIds[1]],
        entities: {
          0: serviceEntities[0],
          1: serviceEntities[1]
        },
        loading: false,
        pageIndex: 0
      };

      const { initialState } = fromService;
      const action = ServiceApiActions.loadServicesSuccess({
        services: [servicesList[0], servicesList[1]]
      });
      const state = reducer(initialState, action);
      expect(state).toEqual(expectedState);
    });

    it('should change entities state', () => {
      const expectedState: fromService.State = {
        ids: [serviceIds[0]],
        entities: {
          0: serviceEntities[0]
        },
        loading: false,
        pageIndex: 0
      };

      const { initialState } = fromService;
      const action = ServiceApiActions.loadServicesSuccess({ services: [servicesList[0]] });
      const state = reducer(initialState, action);
      expect(state).toEqual(expectedState);
    });
  });

  describe('loadServices', () => {
    it('should keep entities unchanged but set loading state to true', () => {
      const expectedState: fromService.State = {
        ids: [serviceIds[0]],
        entities: {
          0: serviceEntities[0]
        },
        loading: true,
        pageIndex: 0
      };

      const stateBefore = { ...expectedState, loading: false };
      const action = ServiceServiceActions.loadServices();
      const state = reducer(stateBefore, action);
      expect(state).toEqual(expectedState);
    });
  });

  describe('loadService', () => {
    it('should keep entities unchanged but set loading state to true', () => {
      const expectedState: fromService.State = {
        ids: [serviceIds[0]],
        entities: {
          0: serviceEntities[0]
        },
        loading: true,
        pageIndex: 0
      };

      const stateBefore = { ...expectedState, loading: false };
      const action = ServiceServiceActions.loadService({ serviceId: 0 });
      const state = reducer(stateBefore, action);
      expect(state).toEqual(expectedState);
    });
  });

  describe('setPageIndex', () => {
    it('should set pageIndex from 0 to 2', () => {
      const expectedState: fromService.State = {
        ids: [serviceIds[0]],
        entities: {
          0: serviceEntities[0]
        },
        loading: true,
        pageIndex: 2
      };

      const stateBefore = { ...expectedState, pageIndex: 0 };
      const action = ServiceServiceActions.setPageIndex({ pageIndex: 2 });
      const state = reducer(stateBefore, action);
      expect(state).toEqual(expectedState);
    });
  });
});
