import { OutletProfileState } from '../store/reducers/outlet.reducers';

export function getProfile(): OutletProfileState {
  return {
    businessSiteType: 'BASIC',
    businessSite: {
      id: 'GS00000001',
      legalName: 'BusinessSite LegalName',
      registeredOffice: true,
      countryName: 'Germany',
      address: {
        addressAddition: 'Address Addition',
        city: 'City',
        district: 'District',
        street: 'Street',
        streetNumber: '2',
        zipCode: '12345'
      },
      poBox: {
        city: 'Ulm',
        number: '12345',
        zipCode: '89075'
      },
      hasAssignedLabels: true
    },
    businessNames: ['BusinessName1'],
    brandCodes: [
      {
        brandCode: '10000002',
        brandId: 'BAB'
      }
    ],
    brands: [
      {
        brandId: 'MB',
        brandName: 'Mercedes-Benz'
      }
    ],
    productGroups: [
      {
        name: 'Passenger Car',
        shortName: 'PC',
        translations: {
          'de-DE': {
            name: 'Personenkraftwagen',
            shortName: 'PKW'
          }
        }
      }
    ],
    services: [
      {
        serviceId: 1,
        serviceName: 'Service',
        translations: {
          'en-US': 'Service',
          'de-DE': 'Service Kundendienst'
        },
        productCategoryId: '1',
        brandId: 'MB',
        productGroupId: 'PC'
      }
    ],
    productCategories: [
      {
        name: 'Vehicle',
        translations: {
          'en-US': 'Vehicle',
          'de-DE': 'Fahrzeug'
        }
      }
    ],
    openingHours: {
      date: '2020-02-14',
      fromTime: '08:00',
      toTime: '18:00'
    }
  };
}
