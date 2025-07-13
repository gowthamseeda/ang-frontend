import { Validity } from '../validity/validity.model';

export interface BrandProductGroupValidity {
  brandId: string;
  productGroupId: string;
  validity?: Validity;
}
