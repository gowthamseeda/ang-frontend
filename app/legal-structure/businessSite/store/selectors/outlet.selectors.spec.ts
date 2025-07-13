import { getOutletMock } from '../../../shared/models/outlet.mock';
import { initialState as initialStateOutlet } from '../reducers/outlet.reducers';

import { selectOutletState } from './outlet.selectors';

describe('Outlet Selectors', () => {
  describe('selectOutletState', () => {
    test('should return initial outlet', () => {
      const state = { outlet: initialStateOutlet };
      const selection = (selectOutletState.projector as any)(state);
      expect(selection).toBe(initialStateOutlet);
    });
    test('should return mocked outlet', () => {
      const outlet = getOutletMock();
      const state = { outlet: outlet };
      const selection = (selectOutletState.projector as any)(state);
      expect(selection).toBe(outlet);
    });
  });
});
