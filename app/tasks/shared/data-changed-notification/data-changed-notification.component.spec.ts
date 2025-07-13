import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { TranslatePipeMock } from '../../../testing/pipe-mocks/translate';
import { BusinessSiteTaskService } from '../business-site-task.service';

import { DataChangedNotificationComponent } from './data-changed-notification.component';

describe('ReadOnlyNotificationComponent', () => {
  let component: DataChangedNotificationComponent;
  let fixture: ComponentFixture<DataChangedNotificationComponent>;
  let businessSiteTaskServiceSpy: Spy<BusinessSiteTaskService>;

  beforeEach(
    waitForAsync(() => {
      businessSiteTaskServiceSpy = createSpyFromClass(BusinessSiteTaskService);
      businessSiteTaskServiceSpy.existsFor.nextWith(false);

      TestBed.configureTestingModule({
        declarations: [DataChangedNotificationComponent, TranslatePipeMock],
        providers: [{ provide: BusinessSiteTaskService, useValue: businessSiteTaskServiceSpy }],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DataChangedNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
