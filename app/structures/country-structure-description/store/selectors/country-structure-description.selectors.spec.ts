import { initialState } from '../reducers/country-structure-description.reducers';
import { CountryStructureDescriptionState } from '../state.model';

import { selectAllCountryStructureDescriptions } from './country-structure-description.selectors';

describe('country structure description selectors suite', () => {
  describe('selectAllCountryStructureDescriptions', () => {
    test('should return countryStructureDescriptions from geography state', () => {
      const countryStructureDescriptionState: CountryStructureDescriptionState = {
        countryStructureDescriptions: initialState
      };
      const selection = selectAllCountryStructureDescriptions.projector(
        countryStructureDescriptionState
      );
      expect(selection).toStrictEqual(initialState);
    });
  });
});
