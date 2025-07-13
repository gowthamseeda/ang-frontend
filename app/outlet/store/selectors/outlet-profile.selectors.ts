import { createSelector } from '@ngrx/store';

import { BusinessSite } from '../../models/outlet-profile.model';
import { OutletState, selectOutletState } from '../reducers';
import { CountryState } from '../reducers/country.reducers';
import { OutletProfileState } from '../reducers/outlet.reducers';
import { UserSettingsState } from '../reducers/user-settings.reducers';

import { selectCountry } from './country.selectors';
import { selectUserSettings } from './user-settings.selectors';

export const selectOutletProfileState = createSelector(selectOutletState, (state: OutletState) => {
  return state.profile;
});

export const selectBusinessSiteState = createSelector(
  selectOutletProfileState,
  (state: OutletProfileState) => {
    return state.businessSite;
  }
);

export const selectBusinessNamesState = createSelector(
  selectOutletProfileState,
  (state: OutletProfileState) => {
    return state.businessNames;
  }
);

export const selectBusinessOrLegalNameState = createSelector(
  selectBusinessSiteState,
  selectBusinessNamesState,
  (state: BusinessSite, businessNames: string[]) => {
    return businessNames.length === 0 ? state.legalName : businessNames[0];
  }
);

export const selectProductGroupsState = createSelector(
  selectOutletProfileState,
  (state: OutletProfileState) => {
    return state.productGroups.map(productGroup => productGroup.shortName);
  }
);

export const selectBusinessSiteTypeState = createSelector(
  selectOutletProfileState,

  (state: OutletProfileState) => {
    return state.businessSiteType;
  }
);

export const selectLocatedAddress = createSelector(
  selectBusinessSiteState,
  selectCountry,
  selectUserSettings,
  (
    businessSiteState: BusinessSite,
    countryState: CountryState,
    userSettingsState: UserSettingsState
  ) => {
    const countryName =
      userSettingsState.languageId &&
      countryState.translations &&
      countryState.translations[userSettingsState.languageId];
    const formattedStreetAndNumber = businessSiteState.address
      ? (businessSiteState.address.street ? businessSiteState.address.street + ' ' : '') +
        (businessSiteState.address.streetNumber ? businessSiteState.address.streetNumber : '')
      : '';
    const formattedZipAndCity = businessSiteState.address
      ? (businessSiteState.address.zipCode ? businessSiteState.address.zipCode + ' ' : '') +
        (businessSiteState.address.city ? businessSiteState.address.city : '')
      : '';

    return {
      ...businessSiteState.address,
      countryName: countryName ? countryName : businessSiteState.countryName,
      formattedStreetAndNumber: formattedStreetAndNumber,
      formattedZipAndCity: formattedZipAndCity
    };
  }
);

export const selectLocatedPOBox = createSelector(
  selectBusinessSiteState,
  (businessSiteState: BusinessSite) => {
    const formattedZipAndCity = businessSiteState.poBox
      ? (businessSiteState.poBox.zipCode ? businessSiteState.poBox.zipCode + ' ' : '') +
        (businessSiteState.poBox.city ? businessSiteState.poBox.city : '')
      : '';

    return {
      number: businessSiteState.poBox ? businessSiteState.poBox.number : '',
      formattedZipAndCity: formattedZipAndCity
    };
  }
);

export const selectBrandIdsState = createSelector(
  selectOutletProfileState,
  (state: OutletProfileState) => {
    return state.brands.map(brand => brand.brandId);
  }
);
