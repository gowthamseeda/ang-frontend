import { TestBed } from '@angular/core/testing';
import { BaseDataUtil } from './baseDataUtil';
import { DataNotification } from '../../../../notifications/models/notifications.model';

describe('BaseDataUtil', () => {
  let service: BaseDataUtil;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BaseDataUtil]
    });

    service = TestBed.inject(BaseDataUtil);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty DataNotificationChangeFields for an empty notifications array', () => {
    const notifications: DataNotification[] = [];
    const result = service.getDataNotificationChangeFields(notifications);
    expect(result.directChange).toEqual([]);
    expect(result.approved).toEqual([]);
    expect(result.declined).toEqual([]);
  });

  it('should categorize notifications by taskStatus', () => {
    const notifications: DataNotification[] = [
      { businessSiteId: 'GS0001', changedField: 'STREET', taskStatus: 'DIRECT_CHANGE', date: new Date(), readStatus: false },
      { businessSiteId: 'GS0001', changedField: 'STATE', taskStatus: 'APPROVED', date: new Date(), readStatus: false },
      { businessSiteId: 'GS0001', changedField: 'COUNTRY', taskStatus: 'DECLINED', date: new Date(), readStatus: false, taskId: 1 }
    ];
    const result = service.getDataNotificationChangeFields(notifications);

    expect(result.directChange).toEqual(['STREET']);
    expect(result.approved).toEqual(['STATE']);
    expect(result.declined).toEqual([{ field: 'COUNTRY', taskId: 1 }]);
  });

  it('should handle multiple notifications with the same taskStatus', () => {
    const notifications: DataNotification[] = [
      { businessSiteId: 'GS0001', changedField: 'STATE', taskStatus: 'DIRECT_CHANGE', date: new Date(), readStatus: false },
      { businessSiteId: 'GS0001', changedField: 'PROVINCE', taskStatus: 'DIRECT_CHANGE', date: new Date(), readStatus: false },
      { businessSiteId: 'GS0001', changedField: 'LATITUDE', taskStatus: 'APPROVED', date: new Date(), readStatus: false },
      { businessSiteId: 'GS0001', changedField: 'STREET', taskStatus: 'DECLINED', date: new Date(), readStatus: false, taskId: 2 },
      { businessSiteId: 'GS0001', changedField: 'COUNTRY', taskStatus: 'DECLINED', date: new Date(), readStatus: false, taskId: 3 }
    ];
    const result = service.getDataNotificationChangeFields(notifications);

    expect(result.directChange).toEqual(['STATE', 'PROVINCE']);
    expect(result.approved).toEqual(['LATITUDE']);
    expect(result.declined).toEqual([{ field: 'STREET', taskId: 2 }, { field: 'COUNTRY', taskId: 3 }]);
  });

  it('should handle a mix of taskStatus values in any order', () => {
    const notifications: DataNotification[] = [
      { businessSiteId: 'GS0001', changedField: 'STATE', taskStatus: 'DECLINED', date: new Date(), readStatus: false, taskId: 4 },
      { businessSiteId: 'GS0001', changedField: 'COUNTRY', taskStatus: 'APPROVED', date: new Date(), readStatus: false },
      { businessSiteId: 'GS0001', changedField: 'STREET', taskStatus: 'DIRECT_CHANGE', date: new Date(), readStatus: false },
      { businessSiteId: 'GS0001', changedField: 'PROVINCE', taskStatus: 'APPROVED', date: new Date(), readStatus: false }
    ];
    const result = service.getDataNotificationChangeFields(notifications);

    expect(result.directChange).toEqual(['STREET']);
    expect(result.approved).toEqual(['COUNTRY', 'PROVINCE']);
    expect(result.declined).toEqual([{ field: 'STATE', taskId: 4 }]);
  });
});
