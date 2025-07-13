import { selectCountryId, selectOutlet } from './outlet-selectors';
import { initialState } from '../reducers/outlet.reducers';

describe('Opening Hours Outlet Selectors Suite', () => {
  describe('selectOutlet', () => {
    test('returns the outlet node (unchanged) out of the state', () => {
      const state = { outlet: initialState };

      const selection = (selectOutlet.projector as any)(state);

      expect(selection).toBe(initialState);
    });
  });

  describe('selectCountryId', () => {
    test('returns the country id of the outlet', () => {
      const state = { ...initialState, countryId: 'DE' };

      const selection = selectCountryId.projector(state);

      expect(selection).toBe('DE');
    });
  });
});
