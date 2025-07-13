import { Translatable } from '../../../shared/pipes/translate-data/translatable.model';
import { BrandProductGroup } from '../../brand-product-group/brand-product-group.model';

export interface Service extends Translatable, ServiceQueryParams {
  id: number;
  name: string;
  position: number;
  countryRestrictions?: string[];
  brandProductGroups?: BrandProductGroup[];
  translations?: { [key: string]: any };
  active: boolean;
  openingHoursSupport: boolean;
  allowedDistributionLevels?: string[];
  description?: string;
  detailDescription?: string;
}

export interface ServiceQueryParams {
  productCategoryId?: number;
  serviceId?: number;
}
