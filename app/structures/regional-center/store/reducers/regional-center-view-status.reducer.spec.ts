import { mockViewStatus_Error } from '../../model/regional-center-state.mock';
import { RegionalCenterActions } from '../actions';

import * as fromRegionalCenterViewStatus from './regional-center-view-status.reducer';

describe('regional centers view status reducers test suite', () => {
  describe('undefined action should', () => {
    test('not change state', () => {
      const action: any = {};
      const stateBefore = mockViewStatus_Error();
      const state = fromRegionalCenterViewStatus.reducer(stateBefore, action);
      expect(state).toStrictEqual(stateBefore);
    });
  });

  describe('loadRegionalCentersSuccess action should', () => {
    test('update state to no error', () => {
      const action = RegionalCenterActions.loadRegionalCentersSuccess({
        regionalCenters: []
      });
      const stateBefore = mockViewStatus_Error();
      const state = fromRegionalCenterViewStatus.reducer(stateBefore, action);
      expect(state.error).toBe(false);
      expect(state.errorMsg).toBe('');
    });
  });

  describe('loadRegionalCentersFailure action should', () => {
    test('update state to no error', () => {
      const action = RegionalCenterActions.loadRegionalCenterFailure({
        error: { message: 'errorMsg', traceId: 'trace123' }
      });
      const state = fromRegionalCenterViewStatus.reducer(
        fromRegionalCenterViewStatus.initialState,
        action
      );
      expect(state.error).toBe(true);
      expect(state.errorMsg).toBe('errorMsg (trace123)');
    });
  });
});
