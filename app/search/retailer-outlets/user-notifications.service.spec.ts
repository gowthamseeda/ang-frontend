import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { TestingModule } from '../../testing/testing.module';

import {UserNotificationsService} from "./user-notifications.service";
import {getUserNotificationsMock} from "./user-notifications.mock";

describe('UserNotificationsService', () => {
  let service: UserNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [UserNotificationsService, ApiService, LoggingService]
    });
    service = TestBed.inject(UserNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should get user notifications', done => {
      const expectedUserNotifications = getUserNotificationsMock();

      service.get().subscribe(userNotifications => {
        expect(userNotifications).toEqual(expectedUserNotifications);
        done();
      });
    });
  });
  describe('update', () => {
    it('should update business site notification status to false when pass in business site id', done => {
      service.updateNotification('GS00000001').subscribe(response => {
        expect(response).toMatchObject({ status: 'UPDATED' });
        done();
      });
    });
  });
});
