import { DistributionLevelActions } from '../actions';

import * as distributionLevelNames from './distribution-levels.reducers';

describe('Distribution Levels Reducer Suite', () => {
  describe('undefined action', () => {
    test('should return default state', () => {
      const expectedState: string[] = distributionLevelNames.initialState;
      const action: any = {};
      const state = distributionLevelNames.reducer(undefined, action);
      expect(state).toEqual(expectedState);
    });
  });

  describe('loadDistributionLevelsSuccess action should', () => {
    test('reset state if there are no distribution levels', () => {
      const stateBefore: string[] = ['one', 'two'];
      const action = DistributionLevelActions.loadDistributionLevelsSuccess({
        distributionLevels: []
      });
      const expectedState = [];
      const state = distributionLevelNames.reducer(stateBefore, action);
      expect(state).toStrictEqual(expectedState);
    });

    test('overwrite state', () => {
      const stateBefore: string[] = ['dLevel1'];
      const action = DistributionLevelActions.loadDistributionLevelsSuccess({
        distributionLevels: ['dLevel2', 'dLevel3']
      });
      const expectedState = ['dLevel2', 'dLevel3'];
      const state = distributionLevelNames.reducer(stateBefore, action);
      expect(state).toStrictEqual(expectedState);
    });
  });
});
