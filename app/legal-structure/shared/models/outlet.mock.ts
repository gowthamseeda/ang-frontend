import { Outlet, OutletTranslation } from './outlet.model';

export const outletTranslationMock: OutletTranslation = {
  legalName: 'TranslatedOutlet Name',
  nameAddition: 'TranslatedOutlet Name addition',
  address: {
    street: 'Translated Street',
    streetNumber: '10a',
    city: 'Translated City',
    district: 'Translated District',
    addressAddition: 'Translated Address Addition'
  },
  poBox: {
    city: 'Neu-Ulm'
  },
  state: 'Translated Address State',
  province: 'Translated Address Province'
};

export function getOutletMock(): Outlet {
  return {
    id: '7654321',
    active: true,
    legalName: 'Outlet Name',
    nameAddition: 'Name Addition',
    companyLegalName: 'Company Name',
    companyId: 'GC00000001',
    countryName: 'Country Name',
    countryId: 'CH',
    address: {
      street: 'Street',
      streetNumber: '1',
      zipCode: 'ZIP123',
      city: 'City',
      district: 'District',
      addressAddition: 'Address Addition'
    },
    defaultLanguageId: 'de-CH',
    poBox: {
      number: '',
      zipCode: '',
      city: ''
    },
    additionalTranslations: { 'fr-CH': outletTranslationMock },
    affiliate: false,
    startOperationDate: undefined,
    closeDownDate: undefined,
    closeDownReason: undefined,
    hasAssignableLabels: true
  };
}

export const autoLangMock = {
  companyLegalName: 'Auto Lang',
  companyId: 'GC00000001',
  countryId: 'CH',
  affiliate: false,
  address: {
    street: 'Sonnenwiesenstra\u00dfe',
    streetNumber: '17',
    zipCode: '8280',
    city: 'Kreuzlingen',
    district: 'Kreuzlingen Süd',
    addressAddition: 'z. Hd. Frau Müller'
  },
  id: 'GS00000001',
  legalName: 'Auto Lang',
  countryName: 'Switzerland'
};

export function getOutletMockForCreate(): Outlet {
  return {
    id: '',
    active: true,
    legalName: 'My Brand-New business site',
    countryId: 'GB',
    companyId: 'GC00000001',
    companyLegalName: '',
    state: 'region 1',
    province: 'region 2',
    address: {
      district: 'Example district',
      street: 'Example street',
      city: 'Example city',
      streetNumber: '42',
      addressAddition: 'Example address addition',
      zipCode: '12345'
    },
    gps: {
      latitude: '48.1768',
      longitude: '9.9769'
    },
    affiliate: false,
    hasAssignableLabels: true
  };
}

export function getOutletWithoutGpsMock(): Outlet {
  const { gps, ...withoutGps } = getOutletMockForCreate();
  return withoutGps;
}

export function getOutletWithGpsMock(): Outlet {
  return {
    ...getOutletMockForCreate(),
    ...{
      gps: {
        latitude: '6',
        longitude: '9'
      },
      state: 'state',
      province: 'province'
    }
  };
}

export function getOutletMockWithPoBox(): Outlet {
  return {
    id: '7654321',
    active: true,
    legalName: 'Outlet Name',
    nameAddition: 'Name Addition',
    companyLegalName: 'Company Name',
    companyId: 'GC00000001',
    countryName: 'Country Name',
    countryId: 'CH',
    state: 'Bayern',
    province: 'Oberfranken',
    address: {
      street: 'Street',
      streetNumber: '1',
      zipCode: 'ZIP123',
      city: 'City',
      district: 'District',
      addressAddition: 'Address Addition'
    },
    defaultLanguageId: 'de-CH',
    poBox: {
      number: '1234567',
      zipCode: '10585',
      city: 'Berlin'
    },
    additionalTranslations: { 'fr-CH': outletTranslationMock },
    affiliate: false,
    hasAssignableLabels: true
  };
}

export function getOutletMockWithRegistedOffice(): Outlet {
  return {
    id: 'GS00000001',
    active: true,
    legalName: 'Outlet Name',
    nameAddition: 'Name Addition',
    companyLegalName: 'Company Name',
    companyId: 'GC00000001',
    countryName: 'Country Name',
    countryId: 'CH',
    registeredOffice: true,
    address: {
      street: 'Street',
      streetNumber: '1',
      zipCode: 'ZIP123',
      city: 'City',
      district: 'District',
      addressAddition: 'Address Addition'
    },
    defaultLanguageId: 'de-CH',
    poBox: {
      number: '',
      zipCode: '',
      city: ''
    },
    additionalTranslations: { 'fr-CH': outletTranslationMock },
    affiliate: false,
    startOperationDate: undefined,
    closeDownDate: undefined,
    closeDownReason: undefined,
    hasAssignableLabels: true
  };
}