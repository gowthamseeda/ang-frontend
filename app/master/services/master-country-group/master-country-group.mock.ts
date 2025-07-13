import { MasterCountryGroup } from './master-country-group.model';

export function getMasterCountryGroupsMock(): { [index: string]: MasterCountryGroup[] } {
  return {
    countryGroups: [
      {
        translations: {
          'de-DE': 'Gruppe 1'
        },
        name: 'Group 1',
        countryIds: ['IT', 'CH'],
        id: 1
      },
      {
        translations: {
          'de-DE': 'Gruppe 2'
        },
        name: 'Group 2',
        countryIds: ['GB'],
        id: 2
      },
      {
        translations: {
          'de-DE': 'Gruppe 3'
        },
        name: 'Group 3',
        countryIds: ['IT', 'GB'],
        id: 3
      }
    ]
  };
}

export function getMasterCountryGroupMock(): MasterCountryGroup {
  return {
    translations: {
      'de-DE': 'Gruppe 1'
    },
    name: 'Group 1',
    countryIds: ['IT', 'CH'],
    id: 1
  };
}
