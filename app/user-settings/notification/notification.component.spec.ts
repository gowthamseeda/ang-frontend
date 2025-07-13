import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateService } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { TranslatePipeMock } from '../../testing/pipe-mocks/translate';

import { NotificationComponent } from './notification.component';
import { NotificationService } from './notification.service';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let notificationServiceSpy: Spy<NotificationService>;

  beforeEach(
    waitForAsync(() => {
      notificationServiceSpy = createSpyFromClass(NotificationService);

      const translateServiceMock = {
        onLangChange: of(),
        onDefaultLangChange: of(),
        get: () => {
          return of('Test Message');
        }
      };

      TestBed.configureTestingModule({
        declarations: [NotificationComponent, TranslatePipeMock],
        imports: [NoopAnimationsModule, ReactiveFormsModule],
        providers: [
          { provide: NotificationService, useValue: notificationServiceSpy },
          { provide: TranslateService, useValue: translateServiceMock }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(NotificationComponent);
      component = fixture.componentInstance;
      component.id = 'TEST_ID';
      component.translationKey = 'TEST_MESSAGE_ID';
      component.message = 'Test Message';
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('closeNotification()', () => {
    it('should mark the notification id as read', () => {
      component.closeNotification();

      expect(notificationServiceSpy.confirmRead).toHaveBeenCalledWith('TEST_ID');
    });
  });

  describe('isNotificationAlreadyRead()', () => {
    it('should return false when the service has a confirmed read', () => {
      notificationServiceSpy.isReadConfirmed.mockReturnValue(true);
      fixture.detectChanges();

      expect(component.isNotificationAlreadyRead()).toBeFalsy();
    });

    it('should return true when the service has no confirmed read', () => {
      notificationServiceSpy.isReadConfirmed.mockReturnValue(false);
      fixture.detectChanges();

      expect(component.isNotificationAlreadyRead()).toBeTruthy();
    });
  });

  describe('isNotificationTranslated()', () => {
    it('should return true if the notification is translated', () => {
      expect(component.isNotificationTranslated()).toBeTruthy();
    });

    it('should return false if the notification is not translated', () => {
      component.message = 'TEST_MESSAGE_ID';
      fixture.detectChanges();

      expect(component.isNotificationTranslated()).toBeFalsy();
    });
  });
});
