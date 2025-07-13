export interface BusinessSite {
  id: string;
  registeredOffice: boolean;
  legalName: string;
  countryName: string;
  address: Address;
  poBox?: POBox;
  hasAssignedLabels: boolean;
}

export interface Address {
  addressAddition?: string;
  city: string;
  district?: string;
  street?: string;
  streetNumber?: string;
  zipCode?: string;
}

export interface LocatedAddress extends Address {
  countryName: string;
  formattedStreetAndNumber?: string;
  formattedZipAndCity?: string;
}

export interface POBox {
  city?: string;
  number: string;
  zipCode?: string;
}

export interface LocatedPOBox extends POBox {
  formattedZipAndCity?: string;
}
