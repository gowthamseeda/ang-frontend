import { MasterRetailCountry } from './master-retail-country.model';

export function getMasterRetailCountriesMock(): { retailCountries: MasterRetailCountry[] } {
  return {
    retailCountries: [
      {
        id: 'GB',
        name: 'United Kingdom of Great Britain and Northern Ireland'
      },
      {
        id: 'CH',
        name: 'Switzerland'
      }
    ]
  };
}

export function getNewMasterRetailCountryMock(): MasterRetailCountry {
  return {
    id: 'AA',
    name: 'My Brand-New Retail Country'
  };
}

export function getUpdatedMasterRetailCountryMock(): MasterRetailCountry {
  return {
    id: 'GB',
    name: 'New UK'
  };
}
