import { ServiceVariantMock } from '../service-variant.mock';

import { ServiceVariantApiActions, ServiceVariantServiceActions } from './actions';
import * as fromServiceVariants from './service-variant.reducer';

describe('Service Variant Reducer', () => {
  const serviceVariants = ServiceVariantMock.asList();
  const serviceVariantsIds = ServiceVariantMock.asIds();
  const serviceVariantsEntities = ServiceVariantMock.asMap();

  describe('undefined action', () => {
    it('should return default state', () => {
      const { initialState } = fromServiceVariants;
      const action = {} as any;
      const state = fromServiceVariants.reducer(initialState, action);
      expect(state).toEqual(initialState);
    });
  });

  describe('loadServiceVariantsSuccess', () => {
    it('should change state', () => {
      const expectedState: fromServiceVariants.State = {
        ids: serviceVariantsIds,
        entities: serviceVariantsEntities,
        loading: false
      };

      const { initialState } = fromServiceVariants;
      const action = ServiceVariantApiActions.loadServiceVariantsSuccess({ serviceVariants });
      const state = fromServiceVariants.reducer(initialState, action);
      expect(state).toEqual(expectedState);
    });
  });

  describe('loadServiceVariants', () => {
    it('should keep entities unchanged but set loading state to true', () => {
      const expectedState: fromServiceVariants.State = {
        ids: serviceVariantsIds,
        entities: serviceVariantsEntities,
        loading: true
      };

      const stateBefore = { ...expectedState, loading: false };
      const action = ServiceVariantServiceActions.loadServiceVariants({
        outletId: ''
      });
      const state = fromServiceVariants.reducer(stateBefore, action);
      expect(state).toEqual(expectedState);
    });
  });
});
