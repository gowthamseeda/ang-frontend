export function getDECountryFormMock(): any {
  return {
    id: 'DE',
    name: 'Germany',
    languages: ['de'],
    defaultLanguageId: 'de',
    translations: {
      'de-CH': 'Vereinigtes Königreich'
    },
    timeZone: '0',
    classicCountryId: '4711',
    marketStructureEnabled: true
  };
}

export function getUKCountryFormMock(): any {
  return {
    id: 'GB',
    name: 'United Kingdom',
    languages: ['en-UK'],
    defaultLanguageId: 'en-UK',
    translations: {
      'en-UK': 'United Kingdom'
    },
    timeZone: '0',
    classicCountryId: '4421',
    marketStructureEnabled: false
  };
}
