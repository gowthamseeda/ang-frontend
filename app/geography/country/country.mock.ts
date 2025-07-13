import { Country } from './country.model';

export function getCountryChMock(): Country {
  return {
    id: 'CH',
    name: 'Switzerland',
    languages: ['de-CH', 'fr-CH'],
    defaultLanguageId: 'de-CH'
  };
}

export function getCountryChMockWithTranslations(): Country {
  return {
    id: 'CH',
    name: 'Switzerland',
    languages: ['de-CH', 'fr-CH'],
    defaultLanguageId: 'de-CH',
    translations: {
      'de-CH': 'Schweiz',
      'en-US': 'Switzerland',
      'fr-FR': 'Suisse'
    }
  };
}

export function getCountryItalyMock(): Country {
  return {
    id: 'IT',
    name: 'Italy',
    languages: ['it-CH'],
    defaultLanguageId: 'it-CH'
  };
}

export function getUserDataRestrictedCountryMock(): { countries: Country[] } {
  return {
    countries: [
      {
        id: 'GB',
        name: 'United Kingdom of Great Britain and Northern Ireland',
        languages: ['en-UK'],
        defaultLanguageId: 'en-UK',
        translations: {
          'de-CH': 'Vereinigtes Königreich von Großbritannien und Nordirland'
        },
        timeZone: '0'
      }
    ]
  };
}

export function getCountriesMock(): { countries: Country[] } {
  return {
    countries: [
      {
        id: 'GB',
        name: 'United Kingdom of Great Britain and Northern Ireland',
        languages: ['en-UK'],
        defaultLanguageId: 'en-UK',
        translations: {
          'de-CH': 'Vereinigtes Königreich von Großbritannien und Nordirland'
        },
        timeZone: '0'
      },
      {
        id: 'CH',
        name: 'Switzerland',
        languages: ['de-CH', 'fr-CH'],
        defaultLanguageId: 'de-CH',
        timeZone: '3600'
      }
    ]
  };
}
