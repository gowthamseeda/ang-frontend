import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { TestingModule } from '../../testing/testing.module';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  const testNotificationId = 'TEST_NOTIFICATION_ID';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ApiService, LoggingService, NotificationService]
    });

    service = TestBed.inject(NotificationService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('isReadConfirmed()', () => {
    it('should return state false', () => {
      expect(service.isReadConfirmed(testNotificationId)).toBeFalsy();
    });
  });

  describe('confirmRead()', () => {
    it('should set new notification read state', () => {
      service.confirmRead(testNotificationId);
      expect(service.isReadConfirmed(testNotificationId)).toBeTruthy();
    });
  });
});
