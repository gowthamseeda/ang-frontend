import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslatePipeMock } from '../../../testing/pipe-mocks/translate';
import { DowntimeNotificationComponent } from './downtime-notification.component';

describe('GeneralNotificationComponent', () => {
  let component: DowntimeNotificationComponent;
  let fixture: ComponentFixture<DowntimeNotificationComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DowntimeNotificationComponent, TranslatePipeMock],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DowntimeNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
