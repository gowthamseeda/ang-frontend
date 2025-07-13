import { Mock } from '../../../testing/test-utils/mock';

import { MasterCountry } from './master-country.model';

export class MasterCountryMock extends Mock {
  static mock: { [id: string]: MasterCountry } = {
    GB: {
      id: 'GB',
      name: 'United Kingdom of Great Britain and Northern Ireland',
      languages: ['en-UK'],
      defaultLanguageId: 'en-UK',
      translations: {
        'de-CH': 'Vereinigtes Königreich von Großbritannien und Nordirland'
      },
      timeZone: '0'
    },
    CH: {
      id: 'CH',
      name: 'Switzerland',
      languages: ['de-CH', 'fr-CH'],
      defaultLanguageId: 'de-CH',
      timeZone: '3600'
    }
  };
}

export function getMasterCountryDEMock(): MasterCountry {
  return {
    id: 'DE',
    name: 'Germany',
    languages: ['de-DE'],
    defaultLanguageId: 'de-DE'
  };
}

export function getMasterCountryUKMock(): MasterCountry {
  return {
    id: 'GB',
    name: 'United Kingdom of Great Britain and Northern Ireland',
    languages: ['en-UK'],
    defaultLanguageId: 'en-UK'
  };
}
