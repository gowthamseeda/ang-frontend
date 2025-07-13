export class MasterServiceVariant {
  id: number;
  serviceId: number;
  serviceCharacteristicId?: number;
  productCategoryId: number;
  brandId?: string;
  productGroupId?: string;
  allowedSeriesIds?: number[];
  allowedModelSeriesIds?: string[];
  onlineOnlyAllowed?: boolean;
  nonCustomerFacingAllowed?: boolean;
  countryRestrictions?: string[];
  active: boolean;
  allowedCatalogIds?: number[];
  excludedServiceVariantIds?: number[];
}

export class MasterServiceVariantUpdate {
  serviceId: number;
  productGroupId: string;
  brandId?: string;
  countryRestrictions: string[];
  productCategoryId: number;
  onlineOnlyAllowed?: boolean;
  active: boolean;
}
