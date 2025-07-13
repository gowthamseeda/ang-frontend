import { Injectable } from '@angular/core';
import {
  DataNotification,
  DataNotificationChangeFields
} from '../../../../notifications/models/notifications.model';

@Injectable({
  providedIn: 'root'
})
export class BaseDataUtil {
  getDataNotificationChangeFields(notifications: DataNotification[]): DataNotificationChangeFields {
    let dataNotificationChangFields = new DataNotificationChangeFields();

    if(notifications == undefined)
      return dataNotificationChangFields

    if (notifications.length > 0) {
      notifications.forEach(notification => {
        if (notification.taskStatus == 'DIRECT_CHANGE') {
          dataNotificationChangFields.directChange = [
            ...dataNotificationChangFields.directChange,
            notification.changedField
          ];
        }
        if (notification.taskStatus == 'APPROVED') {
          dataNotificationChangFields.approved = [
            ...dataNotificationChangFields.approved,
            notification.changedField
          ];
        }
        if (notification.taskStatus == 'DECLINED') {
          dataNotificationChangFields.declined = [
            ...dataNotificationChangFields.declined,
            { field: notification.changedField, taskId: notification.taskId }
          ];
        }
      });
    }

    return dataNotificationChangFields;
  }
}
