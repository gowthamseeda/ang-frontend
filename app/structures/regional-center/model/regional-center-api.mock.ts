import {
  RegionalCenterBusinessSiteResource,
  RegionalCenterResource,
  SuperviseeCountryResource
} from './regional-center-api.model';

export function mockSuperviseeCountryResource_CH(): SuperviseeCountryResource {
  return {
    countryId: 'CH',
    businessSites: ['GS00CH001', 'GS00CH002']
  };
}

export function mockSuperviseeCountryResource_CN(): SuperviseeCountryResource {
  return {
    countryId: 'CN',
    businessSites: ['GS00NL001', 'GS00NL002']
  };
}
export function mockSuperviseeCountryResource_US(): SuperviseeCountryResource {
  return {
    countryId: 'US',
    businessSites: ['GS00NL001', 'GS00NL002']
  };
}

export function mockSuperviseeCountryResource_FR(): SuperviseeCountryResource {
  return {
    countryId: 'FR',
    businessSites: ['GS00NL001', 'GS00NL002']
  };
}

export function mockRegionalCenterBusinessSiteResource_GS00RC01(): RegionalCenterBusinessSiteResource {
  return {
    address: {
      city: 'Genf',
      countryId: 'CH',
      street: 'Aiport Road',
      streetNumber: '99'
    },
    brands: [
      {
        brandId: 'MB',
        brandCode: '123456'
      },
      {
        brandId: 'MB',
        brandCode: '78945'
      },
      {
        brandId: 'SMT',
        brandCode: '23843'
      }
    ],
    businessSiteId: 'GS00RC01',
    distributionLevel: ['WHOLESALER', 'MANUFACTURER'],
    name: 'RC_1',
    registeredOffice: true
  };
}

export function mockRegionalCenterBusinessSiteResource_GS00RC02(): RegionalCenterBusinessSiteResource {
  return {
    address: {
      city: 'Lyon',
      countryId: 'FR'
    },
    brands: [
      {
        brandId: 'SMT',
        brandCode: '456789'
      }
    ],
    businessSiteId: 'GS00RC02',
    distributionLevel: [],
    name: 'RC_2',
    registeredOffice: false
  };
}

export function mockRegionalCenterBusinessSiteResource_GS00RC03(): RegionalCenterBusinessSiteResource {
  return {
    address: {
      street: 'Oktovriou',
      streetNumber: '44',
      city: 'Athen',
      countryId: 'GR'
    },
    brands: [
      {
        brandId: 'SMT',
        brandCode: '456789'
      }
    ],
    businessSiteId: 'GS00RC03',
    distributionLevel: [],
    name: 'RC_3',
    registeredOffice: false
  };
}

export function mockRegionalCenterResource_GS00RC01_CH(): RegionalCenterResource {
  return {
    businessSite: mockRegionalCenterBusinessSiteResource_GS00RC01(),
    regionalCenterId: '01',
    supervisedCountries: [mockSuperviseeCountryResource_CH()]
  };
}

export function mockRegionalCenterResource_GS00RC02_FR(): RegionalCenterResource {
  return {
    businessSite: mockRegionalCenterBusinessSiteResource_GS00RC02(),
    regionalCenterId: '02',
    supervisedCountries: [mockSuperviseeCountryResource_FR()]
  };
}

export function mockRegionalCenterResource_GS00RC03_GR(): RegionalCenterResource {
  return {
    businessSite: mockRegionalCenterBusinessSiteResource_GS00RC03(),
    regionalCenterId: '03',
    supervisedCountries: [
      mockSuperviseeCountryResource_FR(),
      mockSuperviseeCountryResource_CN(),
      mockSuperviseeCountryResource_US()
    ]
  };
}
