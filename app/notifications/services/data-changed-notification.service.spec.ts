import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { TestingModule } from '../../testing/testing.module';

import {DataChangedNotificationService} from "./data-changed-notification.service";
import {notificationMock} from "../models/notifications.mock";

describe('DataChangedNotificationService', () => {
  let service: DataChangedNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ApiService, LoggingService, DataChangedNotificationService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    service = TestBed.inject(DataChangedNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get data changed notification', () => {
    service.get('GS00000001', 'GC00000001').subscribe(notifications => {
      expect(notifications).toMatchObject(notificationMock);
    });
  });
});
