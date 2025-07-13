export interface OutletStructure {
  outlets: OutletStructureOutlets[];
}

export interface OutletStructureOutlets {
  active: boolean;
  brandCodes?: BrandCode[];
  businessNames?: BusinessName[];
  businessSiteId: string;
  city: string;
  companyId: string;
  countryId: string;
  distributionLevels?: string[];
  legalName: string;
  marketStructureEnabled: boolean;
  registeredOffice: boolean;
  subOutlet: boolean;
  subOutlets?: OutletStructureOutlets[];
  mainOutlet: boolean;
}

export interface BrandCode {
  brandCode: string;
  brandId: string;
}

export interface BusinessName {
  businessName: string;
  brandId: string;
}

export interface LoadingStatus {
  isOutletStructureLoading: boolean;
  isError: boolean;
  errorMsg: string;
}
