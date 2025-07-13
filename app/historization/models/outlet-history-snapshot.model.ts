import { Translatable } from '../../shared/pipes/translate-data/translatable.model';

export interface OutletHistorySnapshot {
  groups: SnapshotEntry[];
}

export interface SnapshotEntry {
  group: string;
  snapshot: Outlet;
  changes?: SnapshotChanges[];
}

export interface SnapshotChanges {
  id?: string;
  userId: string;
  changedField: string;
  snapshotDate?: Date;
}

export interface EventHistory {
  eventName?: string;
  occurredOn?: Date;
  occurredOnForTimeOnly?: string;
}

export interface Outlet
  extends OutletBaseData,
    OutletLegalInfo,
    OutletOfferedService,
    OutletAssignedKeys,
    OutletAssignedLabels,
    OutletGeneralCommunications,
    OutletRelationship {
  id: string;
}

export interface OutletBaseData extends OutletHistoryDataClusterSnapshot {
  companyId?: string;
  companyRegisteredOfficeId?: string;
  active?: boolean;
  registeredOffice?: boolean;
  affiliate?: boolean;
  legalName?: string;
  companyLegalName?: string;
  nameAddition?: string;
  countryId?: string;
  countryName?: string;
  address?: Address;
  additionalAddress?: Address;
  state?: string;
  productGroupId?: string;
  province?: string;
  gps?: GPS;
  poBox?: POBox;
  defaultLanguageId?: string;
  additionalTranslations?: { [key: string]: OutletTranslation };
  startOperationDate?: Date;
  closeDownDate?: Date;
  closeDownReason?: CloseDownReason;
  predecessors?: string[];
  distributionLevels?: string[];
  status?: string;
  businessNames?: BusinessName[];
  permitted: boolean;
  deleted: boolean;
  snapshotDate?: Date;
}

export interface OutletLegalInfo extends OutletHistoryDataClusterSnapshot {
  companyId?: string;
  companyLegalInfo?: CompanyLegalInfo;
  businessSiteLegalInfo?: BusinessSiteLegalInfo;
}

export interface OutletHistoryDataClusterSnapshot {}

export interface Address {
  street?: string;
  streetNumber?: string;
  zipCode?: string;
  city?: string;
  district?: string;
  addressAddition?: string;
}

export interface GPS {
  latitude?: string;
  longitude?: string;
}

export interface POBox {
  number: string;
  zipCode?: string;
  city?: string;
}

export interface OutletTranslation {
  legalName?: string;
  nameAddition?: string;
  address?: {
    street: string;
    streetNumber: string;
    city: string;
    district: string;
    addressAddition: string;
  };
  poBox?: POBoxTranslation;
  state?: string;
  province?: string;
  businessNames?: BusinessName[];
}

export interface POBoxTranslation {
  city?: string;
}

export interface CloseDownReason extends Translatable {
  id: number;
  name: string;
  validity?: string[];
  translations?: any;
}

export interface BusinessName {
  businessName: string;
  brandId: string;
  isDeleted: boolean;
}

export interface CompanyLegalInfo {
  vatNo?: string;
  legalFooter?: string;
  legalFooterTranslation?: LegalFooterTranslation[];
}

export interface BusinessSiteLegalInfo {
  taxNo?: string;
  taxNoIsDeleted: boolean;
}

export interface LegalFooterTranslation {
  languageId: string;
  translation: string;
}

export interface OutletOfferedService extends OutletHistoryDataClusterSnapshot {
  offeredServices?: OfferedService[];
}

export interface OfferedService {
  offeredServiceId: string;
  businessSite?: BusinessSite;
  service?: Service;
  serviceCharacteristic?: ServiceCharacteristic;
  productCategory?: ProductCategory;
  brand?: Brand;
  productGroup?: ProductGroup;
  series?: Series[];
  modelSeries?: ModelSeries[];
  catalog?: Catalog[];
  onlineOnly?: boolean;
  nonCustomerFacing?: boolean;
  validity?: Validity;
  isDeleted: boolean;
  openingHours?: OpeningHours[];
  communications?: CommunicationData[];

  // Will be available when the feature is implemented in future
  contractees?: Contractee[];
  contracteeList?: Contractee[];
}

export interface Contractee {
  contracteeId: string;
}

export interface CommunicationData {
  communicationFieldId: string;
  value?: string;
  communicationFieldIsDeleted?: boolean;
}

export interface Catalog {
  id: number;
}

export interface OpeningHours {
  id: number;
  startDate?: string;
  endDate?: string;
  day: string;
  times?: OpeningHour;
}

export interface OpeningHour {
  begin: string;
  end: string;
}

export interface ModelSeries {
  id: string;
}

export interface Series {
  id: number;
}

export interface Service {
  id: number;
  name: string;
  allowedDistributionLevels?: string[];
}

export interface ServiceCharacteristic {
  id: number;
}

export interface BusinessSite {
  id: string;
}

export interface ProductCategory {
  id: number;
}

export interface Brand {
  id: string;
}

export interface ProductGroup {
  id: string;
}

export interface ProductGroupTranslation {
  languageId: string;
  name: string;
  shortName: string;
}

export interface Validity extends EventHistory {
  application: boolean;
  applicationValidUntil?: Date;
  validFrom?: Date;
  validUntil?: Date;
  valid?: boolean;
}

export interface OutletAssignedKeys extends OutletHistoryDataClusterSnapshot {
  assignedKeys?: AssignedKey;
}

export interface AssignedKey {
  alias?: String;
  brandCodes?: BrandCodes[];
  externalKeys?: ExternalKeys[];
  federalId?: String;
  gssnClassicId?: String;
  isDeleted: Boolean;
}

export interface BrandCodes {
  brandId: string;
  brandCode: string;
}

export interface ExternalKeys {
  keyType: string;
  value: string;
  brandId?: string;
  productGroupId?: string;
}

export interface OutletAssignedLabels extends OutletHistoryDataClusterSnapshot {
  assignedLabels?: AssignedLabels;
}

export interface AssignedLabels {
  brandLabels?: BrandLabels[];
  isDeleted: Boolean;
}

export interface BrandLabels {
  labelId: string;
  brandId: string;
}

export interface OutletGeneralCommunications extends OutletHistoryDataClusterSnapshot {
  generalCommunicationData?: GeneralCommunicationData;
}

export interface GeneralCommunicationData {
  communicationData: CommunicationData[];
}

export interface CommunicationData {
  communicationFieldId: string;
  brandId?: string;
  value?: string;
}

export interface AdditionalTranslationCheck {
  isLegalNameFieldChanged: boolean;
  isNameAdditionFieldChanged: boolean;
  isAddressStreetFieldChanged: boolean;
  isAddressStreetNumberFieldChanged: boolean;
  isAddressCityFieldChanged: boolean;
  isAddressDistrictFieldChanged: boolean;
  isAddressAdditionFieldChanged: boolean;
  isPoBoxCityFieldChanged: boolean;
  isProvinceFieldChanged: boolean;
  isStateFieldChanged: boolean;
  isBusinessNamesFieldChanged: boolean;
}

export interface LegalContractStatus {
  id: string;
  brandId: string;
  companyRelationshipId?: string;
  isDeleted: boolean;
  required: boolean;
  languageId?: string;
  disclosures?: string;
  status?: string;
  contractStatusKey: string;
}

export interface OutletRelationship extends OutletHistoryDataClusterSnapshot {
  outletRelationship?: Relationship;
}

export interface Relationship {
  outletRelationships: Relationships[];
}

export interface Relationships {
  id: string;
  relationshipKey: string;
  relatedBusinessSiteId: string;
  relationshipDefCode: string;
  isDeleted: boolean;
}

export interface OfferedServiceValidity {
  businessSiteId: string;
  offeredServiceId: string;
  validities: Validity[];
}
