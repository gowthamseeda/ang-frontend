import { Translatable } from '../../../shared/pipes/translate-data/translatable.model';

export interface CountryStructureDescription {
  countryId: string;
  id: number;
  name: string;
  parentId?: number;
  structures: CountryStructureDescriptionStructure[];
  translations?: { [key: string]: string };
}

export interface CountryStructureDescriptionStructure {
  countryStructureDescriptionId: number;
  id: string;
  name: string;
  parentId?: string;
}

export interface CountryStructureDescriptionsResponse {
  countryStructureDescriptions: CountryStructureDescriptionResponse[];
}

export interface CountryStructureDescriptionResponse extends Translatable {
  countryId: string;
  id: number;
  name: string;
  parentId?: number;
  structures?: CountryStructureDescriptionStructureResponse[];
  translations?: { [key: string]: string };
}

export interface CountryStructureDescriptionStructureResponse extends Translatable {
  countryStructureDescriptionId: number;
  businessSiteIds?: string[];
  id: string;
  name: string;
  parentId?: string;
}
