import {
  selectBusinessSiteState,
  selectBusinessSiteTypeState,
  selectBusinessOrLegalNameState,
  selectOutletProfileState,
  selectProductGroupsState,
  selectLocatedAddress,
  selectLocatedPOBox,
  selectBrandIdsState
} from './outlet-profile.selectors';
import { initialOutletProfileState, OutletProfileState } from '../reducers/outlet.reducers';
import { getProfile } from '../../models/outlet-profile.mock';
import { OutletState } from '../reducers';
import { initialCountryState } from '../reducers/country.reducers';
import { initialLoadingStatusState } from '../reducers/loading.reducers';
import { initialUserSettingsState } from '../reducers/user-settings.reducers';
import { BusinessSite, LocatedPOBox } from '../../models/outlet-profile.model';
import { CountryState } from '../reducers/country.reducers';
import { UserSettingsState } from '../reducers/user-settings.reducers';

describe('Outlet profile selectors Suite', () => {
  const profile = getProfile();
  test('should return outlet profile', () => {
    const outletState: OutletState = {
      profile: profile,
      country: initialCountryState,
      loadingStatus: initialLoadingStatusState,
      userSettings: initialUserSettingsState
    };
    const selection = selectOutletProfileState.projector(outletState);
    expect(selection).toBe(profile);
  });
  test('should return business site values', () => {
    const profileState: OutletProfileState = {
      ...initialOutletProfileState,
      businessSite: profile.businessSite
    };
    const selection = selectBusinessSiteState.projector(profileState);
    expect(selection).toBe(profile.businessSite);
  });
  test('should return product groups', () => {
    const profileState: OutletProfileState = {
      ...initialOutletProfileState,
      productGroups: profile.productGroups
    };
    const selection = selectProductGroupsState.projector(profileState);
    expect(selection).toStrictEqual(profile.productGroups.map(pg => pg.shortName));
  });
  test('should return business site type', () => {
    const profileState: OutletProfileState = {
      ...initialOutletProfileState,
      businessSiteType: profile.businessSiteType
    };
    const selection = selectBusinessSiteTypeState.projector(profileState);
    expect(selection).toStrictEqual(profile.businessSiteType);
  });

  describe('selectBusinessOrLegalNameState', () => {
    const businessSiteState: BusinessSite = {
      ...initialOutletProfileState.businessSite,
      legalName: 'LegalName'
    };
    test('returns first businessName if one or more businessNames exist', () => {
      const businessNamesState: string[] = ['BusinessName1', 'BusinessName2'];

      const selection = selectBusinessOrLegalNameState.projector(
        businessSiteState,
        businessNamesState
      );
      expect(selection).toBe('BusinessName1');
    });

    test('returns legalName if no businessName exists', () => {
      const businessNamesState: string[] = [];

      const selection = selectBusinessOrLegalNameState.projector(
        businessSiteState,
        businessNamesState
      );
      expect(selection).toBe('LegalName');
    });
  });

  describe('Address Selectors', () => {
    test('should return formatted address data', () => {
      const outletState: BusinessSite = {
        id: 'GS0001948',
        registeredOffice: false,
        legalName: 'Test-Outlet',
        countryName: 'Deutschland',
        address: {
          street: 'Aachener Straße',
          streetNumber: '999',
          zipCode: '50933',
          city: 'Köln'
        },
        hasAssignedLabels: false
      };
      const countryState: CountryState = {
        translations: {
          'de-DE': 'Deutschland',
          'en-UK': 'Germany'
        }
      };
      const languageState: UserSettingsState = {
        languageId: 'de-DE'
      };

      const selection = selectLocatedAddress.projector(outletState, countryState, languageState);
      expect(selection).toStrictEqual({
        street: 'Aachener Straße',
        streetNumber: '999',
        zipCode: '50933',
        city: 'Köln',
        countryName: 'Deutschland',
        formattedStreetAndNumber: 'Aachener Straße 999',
        formattedZipAndCity: '50933 Köln'
      });
    });

    test('should return translated country name', () => {
      const outletState: BusinessSite = {
        id: 'GS0001948',
        registeredOffice: false,
        legalName: 'Test-Outlet',
        countryName: 'Deutschland',
        address: {
          street: 'Aachener Straße',
          streetNumber: '999',
          zipCode: '50933',
          city: 'Köln'
        },
        hasAssignedLabels: false
      };
      const countryState: CountryState = {
        translations: {
          'de-DE': 'Deutschland',
          'en-UK': 'Germany'
        }
      };
      const languageState: UserSettingsState = {
        languageId: 'en-UK'
      };

      const selection = selectLocatedAddress.projector(outletState, countryState, languageState);
      expect(selection).toStrictEqual({
        street: 'Aachener Straße',
        streetNumber: '999',
        zipCode: '50933',
        city: 'Köln',
        countryName: 'Germany',
        formattedStreetAndNumber: 'Aachener Straße 999',
        formattedZipAndCity: '50933 Köln'
      });
    });

    test('should return countryName only if there is no address data', () => {
      const outletState: BusinessSite = {
        id: 'GS0001948',
        registeredOffice: false,
        legalName: 'Test-Outlet',
        countryName: 'Deutschland',
        address: {
          city: 'Köln'
        },
        hasAssignedLabels: false
      };
      const countryState: CountryState = {
        translations: {
          'de-DE': 'Deutschland',
          'en-UK': 'Germany'
        }
      };
      const languageState: UserSettingsState = {
        languageId: 'de-DE'
      };

      const selection = selectLocatedAddress.projector(outletState, countryState, languageState);
      expect(selection).toStrictEqual({
        city: 'Köln',
        countryName: 'Deutschland',
        formattedStreetAndNumber: '',
        formattedZipAndCity: 'Köln'
      });
    });
  });

  describe('PO-Box Selectors', () => {
    test('should return only po-box number', () => {
      const outletState: BusinessSite = {
        id: 'GS1234567',
        registeredOffice: false,
        legalName: 'Test-Outlet',
        countryName: 'Deutschland',
        address: {
          city: 'Köln'
        },
        poBox: {
          number: '4711'
        },
        hasAssignedLabels: false
      };
      const poBoxExpected: LocatedPOBox = {
        number: '4711',
        formattedZipAndCity: ''
      };

      const selection = selectLocatedPOBox.projector(outletState);
      expect(selection).toStrictEqual(poBoxExpected);
    });

    test('should return complete po-box dataset', () => {
      const outletState: BusinessSite = {
        id: 'GS0001948',
        registeredOffice: false,
        legalName: 'Test-Outlet',
        countryName: 'Deutschland',
        address: {
          city: 'Köln'
        },
        poBox: {
          number: 'Eff-Zeh-1948',
          zipCode: '50933',
          city: 'Köln'
        },
        hasAssignedLabels: false
      };
      const poBoxExpected: LocatedPOBox = {
        number: 'Eff-Zeh-1948',
        formattedZipAndCity: '50933 Köln'
      };

      const selection = selectLocatedPOBox.projector(outletState);

      expect(selection).toStrictEqual(poBoxExpected);
    });
  });

  describe('selectBrandIdsState', () => {
    test('should return empty array if there are no brands', () => {
      const profileState: OutletProfileState = initialOutletProfileState;

      const selection = selectBrandIdsState.projector(profileState);
      expect(selection).toStrictEqual([]);
    });

    test('should return only the names of existing brands', () => {
      const profileState: OutletProfileState = {
        ...initialOutletProfileState,
        brands: [
          { brandId: 'SMT', brandName: 'Smart' },
          { brandId: 'BAB', brandName: 'BharatBenz' }
        ]
      };

      const selection = selectBrandIdsState.projector(profileState);
      expect(selection).toStrictEqual(['SMT', 'BAB']);
    });
  });
});
