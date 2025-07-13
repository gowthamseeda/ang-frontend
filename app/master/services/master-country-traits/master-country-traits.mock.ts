import { MasterCountryTraits } from './master-country-traits.model';

export function getMasterCountryTraitsMock(): MasterCountryTraits {
  return {
    countryId: 'DE',
    classicCountryId: '200'
  };
}

export function getMasterCountryTraitsUKMock(): MasterCountryTraits {
  return {
    countryId: 'GB',
    classicCountryId: '123'
  };
}

export function updateMasterCountryTraitsMock(): MasterCountryTraits {
  return {
    countryId: 'DE',
    classicCountryId: '4711'
  };
}
