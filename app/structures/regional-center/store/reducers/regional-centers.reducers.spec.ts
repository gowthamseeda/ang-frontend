import { RegionalCenter } from '../../model/regional-center.model';
import { mockRegionalCenter_GS0MRC001 } from '../../model/regional-center.mock';
import { RegionalCenterActions } from '../actions';

import * as fromRegionalCenters from './regional-centers.reducers';

describe('regional centers reducers test suite', () => {
  const regionalCenters: RegionalCenter[] = [mockRegionalCenter_GS0MRC001()];

  describe('undefined action should', () => {
    test('not change state', () => {
      const action: any = {};
      const stateBefore = regionalCenters;
      const state = fromRegionalCenters.reducer(stateBefore, action);
      expect(state).toStrictEqual(stateBefore);
    });
  });

  describe('loadRegionalCentersSuccess action should', () => {
    test('update state with regional centers from action', () => {
      const action = RegionalCenterActions.loadRegionalCentersSuccess({
        regionalCenters: regionalCenters
      });
      const state = fromRegionalCenters.reducer(fromRegionalCenters.initialState, action);
      expect(state).toStrictEqual(regionalCenters);
    });

    test('update state with regional centers from action even if no centers are available', () => {
      const action = RegionalCenterActions.loadRegionalCentersSuccess({
        regionalCenters: []
      });
      const stateBefore = regionalCenters;
      const state = fromRegionalCenters.reducer(stateBefore, action);
      expect(state).toStrictEqual([]);
    });
  });
});
