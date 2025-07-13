import { Country } from '../../../geography/country/country.model';

import { Address, BrandCode, RegionalCenter, SuperviseeCountry } from './regional-center.model';

function mockRegionalCenterBrandCode_MB(): BrandCode {
  return {
    brandId: 'MB',
    code: 'MB001'
  };
}

function mockRegionalCenterBrandCode_SMT(): BrandCode {
  return {
    brandId: 'SMT',
    code: 'SMT001'
  };
}

function mockRegionalCenterAddress_Berlin(): Address {
  return {
    countryId: 'DE',
    city: 'Berlin',
    number: '3A',
    street: 'Friedrich Str.'
  };
}

export function mockRegionalCenterSuperviseeCountry_AF(): SuperviseeCountry {
  return {
    countryId: 'AF',
    businessSiteIds: [],
    cpiIndex: '75'
  };
}

export function mockRegionalCenterSuperviseeCountry_NL(): SuperviseeCountry {
  return {
    countryId: 'NL',
    businessSiteIds: [],
    cpiIndex: '100'
  };
}

export const mockCountry_DE: Country = {
  id: 'DE',
  name: 'Germany',
  defaultLanguageId: 'de-DE',
  languages: ['de-DE', 'en-US'],
  translations: {
    'de-DE': 'Deutschland',
    'en-US': 'Germany'
  },
  timeZone: '0'
};

export const mockCountry_NL: Country = {
  id: 'NL',
  name: 'Netherlands',
  defaultLanguageId: 'nl-NL',
  languages: ['nl-NL'],
  translations: {
    'de-DE': 'Niederlande',
    'en-US': 'Netherlands',
    'fr-FR': 'Pays-Bas'
  },
  timeZone: '0'
};

export const mockCountry_AF: Country = {
  id: 'AF',
  name: 'Afghanistan',
  translations: {
    'de-DE': 'Afghanistan',
    'en-US': 'Afghanistan'
  },
  languages: ['de-DE', 'en-US']
};

export function mockRegionalCenter_GS0MRC001(): RegionalCenter {
  return {
    address: mockRegionalCenterAddress_Berlin(),
    brandCodes: [mockRegionalCenterBrandCode_MB(), mockRegionalCenterBrandCode_SMT()],
    businessSiteId: 'GS0MRC001',
    distributionLevels: ['WHOLESALER', 'RETAILER'],
    id: '1',
    name: 'RegionalCenter_GS0MRC001',
    registeredOffice: true,
    superviseeCountries: [
      mockRegionalCenterSuperviseeCountry_AF(),
      mockRegionalCenterSuperviseeCountry_NL()
    ]
  };
}
