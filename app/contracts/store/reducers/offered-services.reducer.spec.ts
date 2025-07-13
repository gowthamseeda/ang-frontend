import { offeredServiceMock } from '../../model/offered-service.mock';
import { OfferedService } from '../../model/offered-service.model';
import { ContractsEffectActions } from '../actions';

import * as fromOfferedServicesReducer from './offered-services.reducer';

describe('Offered Services Reducer', () => {
  const offeredServiceEntities = toOfferedServiceEntities(offeredServiceMock);
  const offeredServiceEntityIds = offeredServiceMock.map(offeredService => offeredService.id);

  describe('undefined action', () => {
    it('should return default state', () => {
      const { initialState } = fromOfferedServicesReducer;
      const action = {} as any;
      const state = fromOfferedServicesReducer.reducer(undefined, action);
      expect(state).toEqual(initialState);
    });
  });

  describe('loadOfferedServicesSuccess', () => {
    it('should load offered service state', () => {
      const expectedState: fromOfferedServicesReducer.OfferedServiceSubState = {
        ids: offeredServiceEntityIds,
        entities: offeredServiceEntities
      };
      const { initialState } = fromOfferedServicesReducer;
      const action = ContractsEffectActions.loadOfferedServicesSuccess({
        offeredServices: offeredServiceMock
      });
      const state = fromOfferedServicesReducer.reducer(initialState, action);

      expect(state).toEqual(expectedState);
    });
  });
});

function toOfferedServiceEntities(offeredServices: OfferedService[]) {
  return offeredServices.reduce(
    (accumulator, offeredService) =>
      Object.assign(accumulator, { [offeredService.id]: offeredService }),
    {}
  );
}
