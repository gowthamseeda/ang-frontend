import { Translatable } from '../../../shared/pipes/translate-data/translatable.model';

export class MasterKeyType implements Translatable {
  id: string;
  name: string;
  description?: string;
  translations?: { [key: string]: any };
  maxValueLength: number;
  countryRestrictions?: string[];
  brandRestrictions?: string[];
  productGroupRestrictions?: string[];
}
