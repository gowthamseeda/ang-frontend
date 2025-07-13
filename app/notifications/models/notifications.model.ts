export class EmailSetting {
  countryId: string;
  mailFrom?: string;
  mailFroms?: NotificationEmail[];
  npmMail?: string;
  npmMails?: NotificationEmail[];
  countryDefaultLanguage?: string;
}

export class NotificationEmail {
  emailAddress: string;
  focusGroupType: string;
}

export class DataNotification {
  businessSiteId: string;
  changedField: string;
  additionalInfo?: string;
  taskStatus: string;
  date: Date;
  readStatus: boolean;
  taskId?: number;
}

export class OpeningHourNotification {
  businessSiteId: string;
  changedField: string;
  taskStatus: string;
  additionalInfo?: string;
  taskId?: number;
  serviceId?: number;
  productGroupId?: string;
  brandId?: string;
  day?: string;
  startDate?: string;
  endDate?: string;
}

export class CommunicationNotification {
  offeredServiceId: string;
  communicationField: string;
  notificationType: string;
  taskId?: number;
}

class NotificationDeclinedData {
  field: string;
  taskId?: number;
}

export class DeclinedDisplayData{
  shouldDisplay:boolean
  taskId?:number
}

export class DataNotificationChangeFields {
  directChange: string[] = [];
  approved: string[] = [];
  declined: NotificationDeclinedData[] = [];
}

export enum DataNotificationTaskStatus {
  DIRECT_CHANGE = 'DIRECT_CHANGE',
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED'
}

export enum DataNotificationChangedField {
  TAX_NO = 'TAX_NO',
  VAT_NO = 'VAT_NO',
  LEGAL_FOOTER = 'LEGAL_FOOTER'
}
