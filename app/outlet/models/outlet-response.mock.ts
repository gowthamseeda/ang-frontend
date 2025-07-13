import {
  BrandCodeResponse,
  BrandResponse,
  BusinessNameResponse,
  BusinessSiteAddressResponse,
  BusinessSiteCloseDownReason,
  BusinessSiteGPSResponse,
  BusinessSitePoBoxResponse,
  BusinessSiteResponse,
  OfferedServiceResponse,
  OpeningHoursResponse,
  OutletResponse,
  ProductCategoryResponse,
  ProductGroupResponse
} from './outlet-response.model';

export function outletApiResponse_GET(): OutletResponse {
  return {
    businessSite: getBusinessSite(),
    businessNames: getBusinessNames(),
    brandCodes: getBrandCodes(),
    offeredServicesVehicle: getOfferedServices(),
    brands: getBrands(),
    productGroups: getProductGroups(),
    productCategories: getProductCategories(),
    businessSiteType: 'BASIC',
    openingHours: getOpeningHours()
  };
}

function getOpeningHours(): OpeningHoursResponse {
  return {
    date: '2020-02-14',
    begin: '08:00',
    end: '18:00'
  };
}

function getBusinessSite(): BusinessSiteResponse {
  return {
    id: 'GS00000001',
    legalName: 'BusinessSite LegalName',
    companyId: 'GC0000001',
    companyLegalName: 'Company',
    registeredOffice: true,
    companysRegisteredOfficeId: 'GS0000001',
    countryId: 'DE',
    countryName: 'Germany',
    nameAddition: 'Name Addition',
    address: getBusinessSiteAddress(),
    gps: getBusinessSiteGps(),
    additionalTranslations: {},
    poBox: getBusinessSitePoBox(),
    defaultLanguageId: 'de_DE',
    startOperationDate: '2020-01-24',
    closeDownDate: '2020-05-24',
    closeDownReason: getBusinessSiteCloseDownReason(),
    roles: ['role1', 'role2'],
    affiliate: false,
    active: true,
    status: 'status'
  };
}

function getBusinessSiteAddress(): BusinessSiteAddressResponse {
  return {
    street: 'Street',
    streetNumber: '2',
    zipCode: '12345',
    city: 'City',
    district: 'District',
    addressAddition: 'Address Addition'
  };
}

function getBusinessSiteGps(): BusinessSiteGPSResponse {
  return {
    latitude: '6',
    longitude: '9'
  };
}

function getBusinessSitePoBox(): BusinessSitePoBoxResponse {
  return {
    city: 'Ulm',
    number: '12345',
    zipCode: '89075'
  };
}

function getBusinessSiteCloseDownReason(): BusinessSiteCloseDownReason {
  return {
    id: 1,
    name: 'closed'
  };
}

function getBusinessNames(): BusinessNameResponse[] {
  return [
    {
      brandId: 'MB',
      businessName: 'BusinessName1',
      translations: {
        de_DE: 'translatedBusinessName1'
      }
    }
  ];
}

function getBrandCodes(): BrandCodeResponse[] {
  return [
    {
      brandCode: '10000002',
      brandId: 'BAB'
    }
  ];
}

function getOfferedServices(): OfferedServiceResponse[] {
  return [
    {
      brandId: 'MB',
      nonCustomerFacing: true,
      onlineOnly: true,
      productCategoryId: '1',
      productGroupId: 'PC',
      serviceId: 1,
      serviceName: 'Service',
      translations: {
        'en-US': 'Service',
        'de-DE': 'Service Kundendienst'
      }
    }
  ];
}

function getBrands(): BrandResponse[] {
  return [
    {
      brandId: 'MB',
      brandName: 'Mercedes-Benz'
    }
  ];
}

function getProductGroups(): ProductGroupResponse[] {
  return [
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
  ];
}

function getProductCategories(): ProductCategoryResponse[] {
  return [
    {
      name: 'Vehicle',
      translations: {
        'en-US': 'Vehicle',
        'de-DE': 'Fahrzeug'
      }
    }
  ];
}
