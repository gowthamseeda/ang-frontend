import {DataNotification} from "./notifications.model";

export const notificationMock: DataNotification[] = [
  {
    businessSiteId: 'GS00000001',
    changedField: 'TAX_NO',
    date: new Date('2024-08-13T07:28:28.333'),
    taskId: undefined,
    taskStatus: 'APPROVED',
    readStatus: false
  },
  {
    businessSiteId: 'GS00000001',
    changedField: 'VAT_NO',
    date: new Date('2024-08-13T07:28:28.333'),
    taskId: undefined,
    taskStatus: 'APPROVED',
    readStatus: false
  }
];
