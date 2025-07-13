import { EventHistory } from './outlet-history-snapshot.model';

export interface MasterDataSnapshot {
  snapshots: any[];
}

export interface MasterDataBrands extends MasterDataSnapshot {
  brands: MasterDataBrand[];
}

export interface MasterDataBrand extends EventHistory {
  brandId: string;
  name: string;
  position: number;
  isDeleted: boolean;
}

export interface MasterDataOutletRelationships extends MasterDataSnapshot {
  outletRelationships: MasterDataOutletRelationship[];
}

export interface MasterDataOutletRelationship extends EventHistory {
  outletRelationshipId: string;
  name: string;
  description: string;
  isDeleted: boolean;
}

export interface DetailSnapshotMasterDataDescriptor {
  type: string;
  fieldType: string;
  fieldValue: string | number;
  historyDate: string;
}

export interface MasterDataProductGroup extends MasterDataSnapshot {
  productGroups: ProductGroup[];
}

export interface ProductGroup extends EventHistory {
  productGroupId: string;
  name: string;
  shortname: string;
  translations: ProductGroupTranslation[];
  position: number;
  isDeleted: boolean;
}

export interface ProductGroupTranslation {
  languageId: string;
  name: string;
  shortName: string;
}

export interface MasterDataLabels extends MasterDataSnapshot {
  labels: MasterDataLabel[];
}

export interface MasterDataLabel extends EventHistory {
  labelId: number;
  name: string;
  assignableTo: string[];
  restrictedToBrandIds: string[];
  restrictedToCountryIds: string[];
  restrictedToDistributionLevels: string[];
  translations: LabelTranslations[];
}

export interface LabelTranslations {
  languageId: string;
  name: string;
}

export interface MasterDataCountry extends MasterDataSnapshot {
  countries: Country[];
}

export interface Country extends EventHistory {
  countryId: string;
  name: string;
  defaultLanguageId: string;
  translations: CountryTranslations[];
  highlight: boolean;
}

export interface CountryTranslations {
  languageId: string;
  name: string;
}

export interface MasterDataLanguage extends MasterDataSnapshot {
  languages: Language[];
}

export interface Language extends EventHistory {
  languageId: string;
  name: string;
  representation: string;
  isDeleted: boolean;
}

export interface MasterDataKeyTypes extends MasterDataSnapshot {
  keyTypes: MasterDataKeyType[];
}

export interface MasterDataKeyType extends EventHistory {
  keyTypeId: string;
  name: string;
  description?: string;
  translations: KeyTypeDescriptionTranslationTranslations[];
  maxValueLength?: number;
  countryRestrictions: string[];
  brandRestrictions: string[];
  productGroupRestrictions: string[];
  isDeleted: boolean;
}

export interface KeyTypeDescriptionTranslationTranslations {
  languageId: string;
  description: string;
}

export interface MasterDataService extends MasterDataSnapshot {
  services: Service[];
}

export interface Service extends EventHistory {
  serviceId: number;
  name: string;
  description: string;
  active: boolean;
  position: number;
  openingHoursSupport: boolean;
  allowedDistributionLevels: string[];
  isDeleted: boolean;
  translation: ServiceTranslationResource[];
}

export interface ServiceTranslationResource {
  languageId: string;
  name: string;
  nameDescription?: string;
}

export interface MasterDataCloseDownReason extends MasterDataSnapshot {
  closeDownReasons: CloseDownReason[];
}

export interface CloseDownReason extends EventHistory {
  closeDownReasonId: string;
  name: string;
  validity: String[];
  translations: CloseDownReasonTranslations[];
}

export interface CloseDownReasonTranslations {
  languageId: string;
  name: string;
}
