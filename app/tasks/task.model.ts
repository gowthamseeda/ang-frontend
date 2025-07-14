
export enum Status {
  OPEN = 'OPEN',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  CANCELED = 'CANCELED',
  PARTIALLY_COMPLETED = 'PARTIALLY_COMPLETED'
}

export enum Type {
  DATA_VERIFICATION = 'DATA_VERIFICATION',
  DATA_CHANGE = 'DATA_CHANGE'
}

export enum VerificationTaskFormStatus {
  NOT_PRESENT = 'NOT_PRESENT',
  PENDING = 'PENDING',
  REMAIN = 'REMAIN',
  CHANGED = 'CHANGED'
}

export enum DataCluster {
  BASE_DATA_ADDRESS = 'BASE_DATA_ADDRESS',
  BASE_DATA_ADDITIONAL_ADDRESS = 'BASE_DATA_ADDITIONAL_ADDRESS',
  BASE_DATA_PO_BOX = 'BASE_DATA_PO_BOX',
  BASE_DATA_GPS = 'BASE_DATA_GPS',
  BASE_DATA_NAME_ADDITION = 'BASE_DATA_NAME_ADDITION',
  BASE_DATA_STATE_AND_PROVINCE = 'BASE_DATA_STATE_AND_PROVINCE',
  BUSINESS_NAME = 'BUSINESS_NAME',
  OPENING_HOURS = 'OPENING_HOURS',
  COMMUNICATION_CHANNELS= 'COMMUNICATION_CHANNELS',
  GENERAL_COMMUNICATION_CHANNELS = 'GENERAL_COMMUNICATION_CHANNELS',
  LEGAL_TAX_NO = 'LEGAL_TAX_NO',
  LEGAL_VAT_NO = 'LEGAL_VAT_NO',
  LEGAL_LEGAL_FOOTER = 'LEGAL_LEGAL_FOOTER',
  BASE_DATA_ADDRESS_STREET = 'BASE_DATA_ADDRESS_STREET',
  BASE_DATA_ADDRESS_NUMBER = 'BASE_DATA_ADDRESS_NUMBER',
  BASE_DATA_ADDRESS_ADDRESS_ADDITION = 'BASE_DATA_ADDRESS_ADDRESS_ADDITION',
  BASE_DATA_ADDRESS_ZIP_CODE = 'BASE_DATA_ADDRESS_ZIP_CODE',
  BASE_DATA_ADDRESS_CITY = 'BASE_DATA_ADDRESS_CITY',
  BASE_DATA_ADDRESS_DISTRICT = 'BASE_DATA_ADDRESS_DISTRICT',
  BASE_DATA_ADDRESS_STATE = 'BASE_DATA_ADDRESS_STATE',
  BASE_DATA_ADDRESS_PROVINCE = 'BASE_DATA_ADDRESS_PROVINCE'
}

export class Task {
  taskId: number;
  businessSiteId: string;
  status: Status;
  type: Type;
  dataCluster?: DataCluster;
  dueDate?: string;
  creationDate: string;
  comments?: Comment[];
  initiator?: string;
  businessSite?: BusinessSite;
  aggregateName?: string;
  aggregateField?: string;
  diff?: TaskDiff | NewTaskDiff | OpeningHoursDiff | CommunicationDiff;; 
  approvedDiff?: TaskDiff;
  declinedDiff?: TaskDiff;
  tags?: { [key: string]: string[] } | null;
}

export interface TaskRequest {
  businessSiteId: string;
  countryId?: string;
  dataCluster?: String;
  aggregateName?: string;
  aggregateField?: string;
  status: Status;
  type: Type;
  dueDate?: string;
  comment?: string;
  payload?: {
    name: string;
    version: number;
    payload: string;
  };
}

export interface TasksResponse {
  tasks: Task[];
}

export interface TaskFooterEvent {
  taskId?: number;
  payload?: TaskData;
}

export class TaskData {
  dueDate?: string;
  comment?: string;
}

export class BusinessSite {
  businessSiteId: string;
  legalName: string;
  address: Address;
}

export interface TaskUpdateResponse {
  id: number;
  businessSiteId: string;
  countryId: string;
  type: Type;
  status: Status;
  payload: {
    name: string;
    version: number;
    payload: string;
  };
  dataCluster?: DataCluster;
  aggregateName?: string;
  aggregateField?: string;
  comments?: Comment[];
  dueDate?: string;
  initiator?: string;
  commitStatus?: CommitStatus[];
  created: string;
  tags?: { [key: string]: string[] };
  diff?: CommunicationDiff | OpeningHoursDiff;
  lastChanged: string;
  locked: boolean;
}

class CommitStatus {
  id: string;
  success: boolean;
  decline?: boolean;
  message?: string;
}

class Address {
  street?: string;
  streetNumber?: string;
  zipCode?: string;
  city: string;
  countryId: string;
}

export class Comment {
  creationDate: string;
  user: string;
  comment: string;
}

export interface TaskComment {
  taskId: string;
  creationDate: string;
  user: string;
  comment: string;
}

export class TaskDiff {
  old: TaskDiffData;
  new: TaskDiffData;
}

export class NewTaskDiff {
  old: string;
  new: string;
}

export class TaskDiffData {
  [key: string]: any;
}

export class CommunicationDataDiff {
  communicationDataDiff: CommunicationData[];
}

export class CommunicationData {
  offeredServiceId?: string;
  serviceName?: string;
  serviceNameTranslations?: ServiceNameTranslation[];
  brandId?: string;
  productGroupId?: string;
  communicationFieldId: string;
  diff: CommunicationDataDiffData;
}

export interface GeneralCommunicationDataDiff {
  generalCommunicationDataDiff: GeneralCommunicationData[];
}

export interface GeneralCommunicationData {
  brandId?: string;
  productGroupId?: string;
  communicationFieldId: string;
  diff: CommunicationDataDiffData;
}

export class CommunicationDataDiffData {
  old: string;
  new: string;
}

export class CommunicationDiff {
  communicationDataDiff: CommunicationData[];
}

export class BusinessNameDiff {
  old: BusinessNameDiffData[];
  new: BusinessNameDiffData[];
}

export class BusinessNameDiffData {
  brandId: string;
  businessName: string;
}

export class OpeningHoursDiff {
  openingHoursDiff: OpeningHoursData[];
}

export class OpeningHoursDiffData {
  old: OpeningHoursDiffTimes;
  new: OpeningHoursDiffTimes;
}

export class OpeningHoursData {
  id: number;
  productCategoryId: number;
  serviceId: number;
  serviceName?: string;
  serviceNameTranslations?: ServiceNameTranslation[];
  productGroupId: string;
  brandId: string;
  day: string;
  startDate?: string;
  endDate?: string;
  diff: OpeningHoursDiffData;
}

export class OpeningHoursDiffTimes {
  times: OpeningHoursDiffTime[];
  closed: boolean;
}

export class OpeningHoursDiffTime {
  begin: string;
  end: string;
}

class ServiceNameTranslation {
  languageId: string;
  name: string;
}

export class DataVerificationFields {
  dataVerificationFields: DataVerificationField[];
}

export class DataVerificationField {
  aggregateName: string;
  aggregateFields: string[];
  aggregateFieldObjs: AggregateField[];
}

export class AggregateField {
  constructor(
    name: string,
    isExpanded: boolean = false,
    isObject: boolean = false,
    isSubField: boolean = false,
    subFields: string[] = []
  ) {
    this.name = name;
    this.isExpanded = isExpanded;
    this.isObject = isObject;
    this.isSubField = isSubField;
    this.subFields = subFields;
  }

  name: string;
  isExpanded: boolean;
  isObject: boolean;
  isSubField: boolean;
  subFields: string[];
}

export class TaskForDisplay {
  shouldDisplayFutureValue = false;
  futureValue: string;
  isChanged = false;
  taskId: number;
  messageForUnchangedValue: string;
  noValueChangeMsgForBSR: string = 'NO_CHANGES_MADE_TO_THE_FIELD';
  noValueChangeMsgForMTR: string = 'EXISTING_DATA_CONFIRMED';
  showApprovedNotification = false;
  showDeclinedNotification = false;
  showDirectChangeNotification = false;
  showVerificationNotification = false;
}

export class AggregateDataField {
  aggregateName?: string;
  aggregateField?: string;
  dataCluster?: string;
}

export class ChangeTaskStatusesResource {
  taskId: number;
  taskStatus: Status;
  comment?: string;
}
