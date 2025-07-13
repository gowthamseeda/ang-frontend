import { createSelector } from '@ngrx/store';

import { selectCountryState } from './country-selectors';
import { selectOutletState } from './outlet.selectors';
import { selectLanguageState } from './user-settings.selectors';

export const selectAddressState = createSelector(
  selectOutletState,
  selectCountryState,
  selectLanguageState,
  (outlet, country, language) => {
    return outlet
      ? {
          ...outlet.address,
          countryName:
            country && language && country.translations && country.translations[language]
              ? country.translations[language]
              : outlet.countryName
        }
      : undefined;
  }
);
