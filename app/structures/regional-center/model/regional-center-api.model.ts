export interface AddressResource {
  city: string;
  countryId: string;
  street?: string;
  streetNumber?: string;
  zipCode?: string;
}

export interface BrandCodeResource {
  brandCode: string;
  brandId: string;
}

export interface SuperviseeCountryResource {
  businessSites: string[];
  countryId: string;
  cpiIndex?: string;
}

export interface RegionalCenterBusinessSiteResource {
  address: AddressResource;
  brands: BrandCodeResource[];
  businessSiteId: string;
  distributionLevel: string[];
  name: string;
  registeredOffice: boolean;
}

export interface RegionalCenterResource {
  businessSite: RegionalCenterBusinessSiteResource;
  regionalCenterId: string;
  supervisedCountries?: SuperviseeCountryResource[];
}

export interface RegionalCentersResource {
  regionalCenters: RegionalCenterResource[];
}
