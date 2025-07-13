import { Company } from './company.model';

export function getCompanyMock(): Company {
  return {
    legalName: 'Company Name',
    countryId: 'DE',
    address: {
      street: 'Street',
      streetNumber: '12',
      zipCode: '89071',
      city: 'City',
      district: 'District',
      addressAddition: 'Address Addition'
    }
  };
}

export function getCompanyWithGpsMock(): Company {
  return {
    ...getCompanyMock_GC00000001(),
    ...{
      gps: {
        latitude: '6',
        longitude: '9'
      },
      state: 'region 1',
      province: 'region 2'
    }
  };
}

export function getCompanyMock_GC00000001(): any {
  return {
    id: 'GC00000001',
    legalName: 'Auto Lang',
    countryId: 'CH',
    registeredOfficeId: 'GS00000001',
    affiliate: false,
    address: {
      street: 'Sonnenwiesenstraße',
      streetNumber: '17',
      zipCode: '8280',
      city: 'Kreuzlingen',
      district: 'Kreuzlingen Süd',
      addressAddition: 'z. Hd. Frau Müller'
    }
  };
}

export function getCompanyMock_GC00000004(): Company {
  return {
    id: 'GC00000004',
    legalName: 'Auto Laenger',
    countryId: 'CH',
    registeredOfficeId: 'GS00000004',
    address: {
      city: 'Example city',
      street: 'Example street',
      streetNumber: '42',
      zipCode: '12345',
      district: 'Example district',
      addressAddition: 'Example address addition'
    },
    gps: {
      longitude: '48.1768',
      latitude: '9.9769'
    },
    state: 'region 1',
    province: 'region 2'
  };
}
