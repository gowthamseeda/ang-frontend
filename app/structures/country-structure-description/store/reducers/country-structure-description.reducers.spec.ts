import { getCountryStructureDescription_DE_Regions_Areas_Markets } from '../../model/country-structure-description.mock';
import { CountryStructureDescriptionActions } from '../actions';

import { initialState } from './country-structure-description.reducers';
import * as fromCountryStructureDescription from './country-structure-description.reducers';

describe('country structure description reducer suite', () => {
  test('should change nothing on any other action', () => {
    const stateBefore = getCountryStructureDescription_DE_Regions_Areas_Markets();
    const action: any = {};
    const state = fromCountryStructureDescription.reducer(stateBefore, action);
    expect(state).toStrictEqual(stateBefore);
  });

  test('should change country structure description in state on loadCountryStructureDescriptionSuccess action', () => {
    const stateBefore = initialState;
    const countryStructureDescriptions = getCountryStructureDescription_DE_Regions_Areas_Markets();
    const action = CountryStructureDescriptionActions.loadCountryStructureDescriptionSuccess({
      countryStructureDescriptions: countryStructureDescriptions
    });
    const state = fromCountryStructureDescription.reducer(stateBefore, action);
    expect(state).toStrictEqual(countryStructureDescriptions);
  });
});
