export interface CountryStructureCountryStructureDescriptionResource {
  countryId: string;
  id: number;
  name: string;
  parentStructureDescriptionId?: number;
  translation?: { [key: string]: string };
}

export interface CountryStructureResource {
  businessSiteIds?: Array<string>;
  countryStructureDescriptionId?: number;
  countryStructureDescription?: CountryStructureCountryStructureDescriptionResource;
  name: string;
  parentId?: string;
  id: string;
}

export interface BusinessSiteCountryStructureResource {
  countryStructureId?: string;
}
