export interface OutletResponse {
  businessSite: BusinessSiteResponse;
  businessNames?: BusinessNameResponse[];
  brandCodes?: BrandCodeResponse[];
  offeredServicesVehicle?: OfferedServiceResponse[];
  brands?: BrandResponse[];
  productGroups?: ProductGroupResponse[];
  productCategories?: ProductCategoryResponse[];
  businessSiteType: string;
  openingHours: OpeningHoursResponse;
}

export interface BusinessSiteResponse {
  id: string;
  legalName: string;
  companyId: string;
  companyLegalName: string;
  registeredOffice: boolean;
  companysRegisteredOfficeId: string;
  countryId: string;
  state?: string;
  province?: string;
  countryName: string;
  nameAddition?: string;
  address: BusinessSiteAddressResponse;
  gps?: BusinessSiteGPSResponse;
  additionalTranslations?: Object;
  poBox?: BusinessSitePoBoxResponse;
  defaultLanguageId?: string;
  startOperationDate?: string;
  closeDownDate?: string;
  closeDownReason?: BusinessSiteCloseDownReason;
  roles?: string[];
  affiliate?: boolean;
  active?: boolean;
  status?: string;
}

export interface BusinessSiteAddressResponse {
  addressAddition?: string;
  city: string;
  district?: string;
  street?: string;
  streetNumber?: string;
  zipCode?: string;
}

export interface BusinessSiteGPSResponse {
  latitude: string;
  longitude: string;
}

export interface BusinessSitePoBoxResponse {
  city?: string;
  number: string;
  zipCode?: string;
}

export interface BusinessSiteCloseDownReason {
  id: number;
  name: string;
}

export interface BusinessNameResponse {
  brandId: string;
  businessName: string;
  translations?: { [key: string]: string };
}

export interface BrandCodeResponse {
  brandCode: string;
  brandId: string;
}

export interface OfferedServiceResponse {
  brandId?: string;
  nonCustomerFacing?: boolean;
  onlineOnly?: boolean;
  productCategoryId: string;
  productGroupId?: string;
  serviceCharacteristicId?: number;
  serviceId: number;
  serviceName?: string;
  translations?: { [key: string]: string };
}

export interface BrandResponse {
  brandId: string;
  brandName: string;
}

export interface ProductGroupResponse {
  name: string;
  shortName: string;
  translations?: {
    [key: string]: {
      name: string;
      shortName: string;
    };
  };
}

export interface ProductCategoryResponse {
  name: string;
  translations?: { [key: string]: string };
}

export interface OpeningHoursResponse {
  date: string;
  begin: string;
  end: string;
}
