export interface Address {
  street: string;
  number: string;
  city: string;
  countryId: string;
}

export interface BrandCode {
  brandId: string;
  code: string;
}

export interface SuperviseeCountry {
  countryId: string;
  businessSiteIds: string[];
  cpiIndex: string;
}

export interface RegionalCenter {
  id: string;
  businessSiteId: string;
  name: string;
  address: Address;
  brandCodes: BrandCode[];
  registeredOffice: boolean;
  distributionLevels: string[];
  superviseeCountries: SuperviseeCountry[];
}
