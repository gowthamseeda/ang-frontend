import { getInitialStructuresState } from '../../../store/state.mock';
import { selectRegionalCenter, selectRegionalCenters } from './regional-center.selectors';
import { initialState as initialStateRegionalCenter } from '../reducers/index';
import { initialState as initialStateRegionalCenters } from '../reducers/regional-centers.reducers';
import { mockRegionalCenter_GS0MRC001 } from '../../model/regional-center.mock';
import { RegionalCenterState } from '../../model/regional-center-state.model';

describe('region center selectors test suite', () => {
  describe('selectRegionalCenter should', () => {
    test('return correct node from structures feature slice', () => {
      const structuresState = getInitialStructuresState();
      const selection = selectRegionalCenter.projector(structuresState);
      expect(selection).toStrictEqual(initialStateRegionalCenter);
    });
  });

  describe('selectRegionalCenters should', () => {
    test('return regional centers from RegionalCenterState', () => {
      const regionalCenters = [mockRegionalCenter_GS0MRC001()];
      const regionalCentersState: RegionalCenterState = {
        ...initialStateRegionalCenter,
        regionalCenters: regionalCenters
      };
      const selection = selectRegionalCenters.projector(regionalCentersState);
      expect(selection).toStrictEqual(regionalCenters);
    });
    test('return empty array if RegionalCenterState initial state', () => {
      const selection = selectRegionalCenters.projector(initialStateRegionalCenter);
      expect(selection).toStrictEqual(initialStateRegionalCenters);
    });
  });
});
