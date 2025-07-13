export interface ServiceVariant {
  id: number;
  serviceId: number;
  productCategoryId: number;
  brandId?: string;
  productGroupId?: string;
  allowedSeriesIds?: number[];
  allowedModelSeriesIds?: string[];
  onlineOnlyAllowed: boolean;
  countryRestrictions?: string[];
  active?: boolean;
  nonCustomerFacingAllowed?: boolean;
  serviceCharacteristicId?: number;
}
