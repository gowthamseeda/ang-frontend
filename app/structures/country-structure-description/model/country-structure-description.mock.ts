import {
  CountryStructureDescription,
  CountryStructureDescriptionResponse
} from './country-structure-description.model';

export function getCountryStructureDescription_DE_Regions_Areas_Markets(): CountryStructureDescription[] {
  return [
    {
      id: 1,
      countryId: 'DE',
      name: 'DE Custom Regions',
      translations: {
        'de-DE': 'DE Regionen'
      },
      structures: [
        {
          id: '1',
          name: 'Region North',
          countryStructureDescriptionId: 1
        },
        {
          id: '8',
          name: 'Region South',
          countryStructureDescriptionId: 1
        }
      ]
    },
    {
      id: 2,
      countryId: 'DE',
      name: 'DE Custom Areas',
      parentId: 1,
      translations: {
        'de-DE': 'DE Gebiete'
      },
      structures: [
        {
          id: '2',
          name: 'North-West Area',
          countryStructureDescriptionId: 2,
          parentId: '1'
        },
        {
          id: '4',
          name: 'North-East Area',
          countryStructureDescriptionId: 2,
          parentId: '1'
        },
        {
          id: '9',
          name: 'South-East Area',
          countryStructureDescriptionId: 2,
          parentId: '8'
        }
      ]
    },
    {
      id: 3,
      countryId: 'DE',
      name: 'DE Custom Markets',
      parentId: 2,
      translations: {
        'de-DE': 'DE Märkte'
      },
      structures: [
        {
          id: '3',
          name: 'Greater Seattle Market',
          countryStructureDescriptionId: 3,
          parentId: '2'
        },
        {
          id: '5',
          name: 'Lakes Market',
          countryStructureDescriptionId: 3,
          parentId: '4'
        },
        {
          id: '6',
          name: 'NY Market',
          countryStructureDescriptionId: 3,
          parentId: '4'
        },
        {
          id: '7',
          name: 'DC Market',
          countryStructureDescriptionId: 3,
          parentId: '4'
        },
        {
          id: '10',
          name: 'Florida',
          countryStructureDescriptionId: 3,
          parentId: '9'
        }
      ]
    }
  ];
}

export function getCountryStructureDescription_US_Regions_Areas_Markets_Response(): CountryStructureDescriptionResponse[] {
  return [
    {
      id: 0,
      countryId: 'US',
      name: 'Regions',
      translations: {
        'de-DE': 'Regionen'
      },
      structures: [
        {
          id: '0',
          name: 'Region North',
          countryStructureDescriptionId: 0
        },
        {
          id: '1',
          name: 'Region South',
          countryStructureDescriptionId: 0
        }
      ]
    },
    {
      id: 1,
      countryId: 'US',
      name: 'Areas',
      translations: {
        'de-DE': 'Gebiete'
      },
      structures: [
        {
          id: '2',
          name: 'Area North-West',
          countryStructureDescriptionId: 1,
          parentId: '0'
        },
        {
          id: '3',
          name: 'Area North-East',
          countryStructureDescriptionId: 1,
          parentId: '0',
          businessSiteIds: ['GS01', 'GS02']
        },
        {
          id: '4',
          name: 'Area South-West',
          countryStructureDescriptionId: 1,
          parentId: '1'
        }
      ]
    },
    {
      id: 2,
      countryId: 'US',
      name: 'Markets',
      translations: {
        'de-DE': 'Märkte'
      },
      structures: [
        {
          id: '5',
          name: 'Market NW1',
          countryStructureDescriptionId: 2,
          parentId: '2',
          businessSiteIds: ['GS03']
        },
        {
          id: '6',
          name: 'Market NW2',
          countryStructureDescriptionId: 2,
          parentId: '2'
        },
        {
          id: '9',
          name: 'Market NW3',
          countryStructureDescriptionId: 2,
          parentId: '2'
        }
      ]
    }
  ];
}
