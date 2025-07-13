import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { DeviceDetectorService } from 'ngx-device-detector';

import { SnackBarService } from '../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../testing/testing.module';

import { IeNotificationComponent } from './ie-notification.component';

describe('IeNotificationComponent', () => {
  let component: IeNotificationComponent;
  let fixture: ComponentFixture<IeNotificationComponent>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let deviceServiceSpy: Spy<DeviceDetectorService>;

  beforeEach(
    waitForAsync(() => {
      snackBarServiceSpy = createSpyFromClass(SnackBarService);
      deviceServiceSpy = createSpyFromClass(DeviceDetectorService);

      TestBed.configureTestingModule({
        imports: [TestingModule],
        declarations: [IeNotificationComponent],
        providers: [
          { provide: SnackBarService, useValue: snackBarServiceSpy },
          { provide: DeviceDetectorService, useValue: deviceServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    deviceServiceSpy.getDeviceInfo.mockReturnValue({});

    fixture = TestBed.createComponent(IeNotificationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call SnackBarService if browser is IE', () => {
    deviceServiceSpy.getDeviceInfo.mockReturnValue({ browser: 'IE' });
    fixture.detectChanges();
    expect(snackBarServiceSpy.showInfoPermanent).toHaveBeenCalled();
  });

  it('should not call SnackBarService if browser is not IE', () => {
    deviceServiceSpy.getDeviceInfo.mockReturnValue({ browser: 'Chrome' });
    fixture.detectChanges();
    expect(snackBarServiceSpy.showInfoPermanent).not.toHaveBeenCalled();
  });
});
