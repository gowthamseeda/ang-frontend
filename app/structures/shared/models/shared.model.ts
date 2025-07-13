import { Translatable } from '../../../shared/pipes/translate-data/translatable.model';
import { BrandCode } from '../../../traits/shared/brand-code/brand-code.model';

export class StructuresMember {
  id: string;
  companyId: string;
  legalName: string;
  address: StructuresAddress;
  country: StructuresCountry;
  active: boolean;
  isRegisteredOffice: boolean;
  brandCodes?: BrandCode[];
}

export class StructuresAddress {
  street?: string | undefined;
  streetNumber?: string | undefined;
  zipCode?: string | undefined;
  city: string;
}

export class StructuresCountry implements Translatable {
  id: string;
  name: string;
  translations?: { [key: string]: any };
}
