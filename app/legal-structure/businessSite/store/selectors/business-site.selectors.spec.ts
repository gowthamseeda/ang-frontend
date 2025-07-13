import { LegalStructureState } from '../../../store';
import { getInitialState } from '../../../store/legal-structure-state.mock';
import * as fromBusinessSite from '../reducers';
import { BusinessSiteState } from '../state.model';

import {
  selectBrandIdsState,
  selectBusinessNamesState,
  selectBusinessSiteState,
  selectDistributionLevelsState
} from './business-site.selectors';

describe('Business-Site Selectors Test Suite', () => {
  describe('selectBusinessSiteState should', () => {
    test('return correct node from legal structure feature slice', () => {
      const state: LegalStructureState = getInitialState();
      const selection = selectBusinessSiteState.projector(state);
      expect(selection).toStrictEqual(state.businessSiteState);
    });
  });

  describe('selectBusinessNamesState should', () => {
    const businessNames: string[] = ['bName1', 'bName2'];
    test('return unchanged business names', () => {
      const state: BusinessSiteState = {
        ...fromBusinessSite.initialState,
        businessNames: businessNames
      };
      const selection = selectBusinessNamesState.projector(state);
      expect(selection).toStrictEqual(businessNames);
    });
  });

  describe('selectDistributionLevelsState should', () => {
    const distributionLevels: string[] = ['dLevel1', 'dLevel2'];
    test('return unchanged distribution levels', () => {
      const state: BusinessSiteState = {
        ...fromBusinessSite.initialState,
        distributionLevels: distributionLevels
      };
      const selection = selectDistributionLevelsState.projector(state);
      expect(selection).toStrictEqual(distributionLevels);
    });
  });

  describe('selectBrandIdsState should', () => {
    const brandIds: string[] = ['MB', 'SMT'];
    test('return unchanged brandIds', () => {
      const state: BusinessSiteState = {
        ...fromBusinessSite.initialState,
        brandIds: brandIds
      };
      const selection = selectBrandIdsState.projector(state);
      expect(selection).toStrictEqual(brandIds);
    });
  });
});
