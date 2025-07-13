import { RegionalCenterState, ViewStatus } from '../../model/regional-center-state.model';
import { initialState as initialStateRegionalCenter } from '../reducers';
import { initialState as initialStateRegionalCenterViewState } from '../reducers/regional-center-view-status.reducer';
import { mockViewStatus_Error } from '../../model/regional-center-state.mock';
import {
  selectInitialized,
  selectRegionalCenterStatus
} from './regional-center-view-state.selectors';

describe('region center view status selectors test suite', () => {
  const errorState = mockViewStatus_Error();

  describe('selectRegionalCenterStatus should', () => {
    test('return view status from RegionalCenterState', () => {
      const regionalCentersState: RegionalCenterState = {
        ...initialStateRegionalCenter,
        status: errorState
      };

      const selection = selectRegionalCenterStatus.projector(regionalCentersState);
      expect(selection).toStrictEqual(errorState);
    });

    test('return view status from RegionalCenterState with undefined error as default', () => {
      const selection = selectRegionalCenterStatus.projector(initialStateRegionalCenter);
      expect(selection.error).toBeUndefined();
    });
  });

  describe('selectInitialized should', () => {
    test('return false if initial state', () => {
      const selection = selectInitialized.projector(initialStateRegionalCenterViewState);
      expect(selection).toBe(false);
    });

    test('return true if error state', () => {
      const selection = selectInitialized.projector(errorState);
      expect(selection).toBe(true);
    });

    test('return true if no error state', () => {
      const noErrorState: ViewStatus = {
        ...initialStateRegionalCenterViewState,
        error: false
      };
      const selection = selectInitialized.projector(noErrorState);
      expect(selection).toBe(true);
    });
  });
});
