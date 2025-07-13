import * as fromBusinessSiteState from '../reducers';
import { BusinessSiteState } from '../state.model';

import { selectLanguageState } from './user-settings.selectors';

describe('User Settings Selectors Test Suite', () => {
  describe('selectUserSettingsState', () => {});

  describe('selectLanguageState', () => {
    test('should return empty language id', () => {
      const state: BusinessSiteState = fromBusinessSiteState.initialState;
      const selection = selectLanguageState.projector(state);
      expect(selection).toBe(undefined);
    });
    test('should return language id from store', () => {
      const state = { ...fromBusinessSiteState.initialState, languageId: 'en-EN' };
      const selection = selectLanguageState.projector(state);
      expect(selection).toBe('en-EN');
    });
  });
});
