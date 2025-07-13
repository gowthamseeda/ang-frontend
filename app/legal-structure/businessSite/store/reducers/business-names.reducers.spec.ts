import { BusinessNamesActions } from '../actions';

import * as fromBusinessNames from './business-names.reducers';

describe('Business Names Reducer Suite', () => {
  describe('undefined action', () => {
    test('should return default state', () => {
      const expectedState: string[] = fromBusinessNames.initialState;
      const action: any = {};
      const state = fromBusinessNames.reducer(undefined, action);
      expect(state).toEqual(expectedState);
    });
  });

  describe('loadBusinessNamesSuccess action should', () => {
    test('reset state if there are no business names', () => {
      const stateBefore: string[] = ['one', 'two'];
      const action = BusinessNamesActions.loadBusinessNamesSuccess({ businessNames: [] });
      const expectedState = [];
      const state = fromBusinessNames.reducer(stateBefore, action);
      expect(state).toStrictEqual(expectedState);
    });

    test('overwrite state', () => {
      const stateBefore: string[] = ['one'];
      const action = BusinessNamesActions.loadBusinessNamesSuccess({
        businessNames: ['two', 'three']
      });
      const expectedState = ['two', 'three'];
      const state = fromBusinessNames.reducer(stateBefore, action);
      expect(state).toStrictEqual(expectedState);
    });
  });
});
