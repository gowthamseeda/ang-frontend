export interface ServiceVariant {
  id: number;
  service: string;
  productGroup?: string;
  brand?: string;
  active: boolean;
}

export interface ServiceVariantTable extends ServiceVariant {
  isMultiCheck: boolean;
}

export interface ServiceVariantView extends ServiceVariant {
  countryRestrictions?: string[];
}
