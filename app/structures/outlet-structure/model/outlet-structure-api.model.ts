export interface OutletStructureResource {
  companyLegalName: string;
  companyCity: string;
  companyId: string;
  outlets: OutletStructureOutletsResource[];
}

export interface OutletStructureOutletsResource {
  active: boolean;
  brandCodes?: BrandCodeResource[];
  businessNames?: BusinessNameResource[];
  businessSiteId: string;
  city: string;
  companyId: string;
  countryId: string;
  distributionLevels?: string[];
  legalName: string;
  marketStructureEnabled: boolean;
  registeredOffice: boolean;
  subOutlet: boolean;
  subOutlets?: OutletStructureOutletsResource[];
  mainOutlet: boolean;
}

export interface BrandCodeResource {
  brandCode: string;
  brandId: string;
}

export class BusinessNameResource {
  businessName: string;
  brandId: string;
}
