import { BrandsActions } from '../actions';

import * as fromBrands from './brands.reducers';

describe('Brands Reducer Suite', () => {
  describe('undefined action', () => {
    test('should return default state', () => {
      const expectedState: string[] = fromBrands.initialState;
      const action: any = {};
      const state = fromBrands.reducer(undefined, action);
      expect(state).toEqual(expectedState);
    });
  });

  describe('loadBrandsSuccess action should', () => {
    test('reset state if there are no brands', () => {
      const stateBefore: string[] = ['MB', 'SMT'];
      const action = BrandsActions.loadBrandsSuccess({ brandIds: [] });
      const expectedState = [];
      const state = fromBrands.reducer(stateBefore, action);
      expect(state).toStrictEqual(expectedState);
    });

    test('overwrite state', () => {
      const stateBefore: string[] = ['MB'];
      const action = BrandsActions.loadBrandsSuccess({
        brandIds: ['SMT', 'MYB']
      });
      const expectedState = ['SMT', 'MYB'];
      const state = fromBrands.reducer(stateBefore, action);
      expect(state).toStrictEqual(expectedState);
    });
  });
});
