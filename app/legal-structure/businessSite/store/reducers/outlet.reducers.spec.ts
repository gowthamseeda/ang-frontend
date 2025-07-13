import { createAction } from '@ngrx/store';

import { getOutletMock } from '../../../shared/models/outlet.mock';
import { OutletActions } from '../actions';

import * as fromOutlet from './outlet.reducers';

describe('Outlet Reducer', () => {
  describe('unknown action', () => {
    test('should return initial state', () => {
      const state = fromOutlet.reducer(undefined, createAction('[Unknown] unknown'));
      expect(state).toEqual(fromOutlet.initialState);
    });
  });

  describe('load Outlet Success Action', () => {
    test('should return initial state', () => {
      const action = OutletActions.loadOutletSuccess({
        outlet: getOutletMock()
      });
      const state = fromOutlet.reducer(fromOutlet.initialState, action);
      expect(state).toEqual(getOutletMock());
    });
    test('should return mocked outlet', () => {
      const outlet = { ...getOutletMock(), hasAssignableLabels: true };
      const action = OutletActions.loadOutletSuccess({
        outlet: { ...outlet, gps: undefined }
      });
      const state = fromOutlet.reducer(fromOutlet.initialState, action);
      expect(state).toEqual(outlet);
    });
  });
});
