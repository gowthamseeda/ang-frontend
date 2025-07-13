import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { TranslatePipeMock } from '../../../testing/pipe-mocks/translate';
import { DataCluster, Status, Type } from '../../task.model';
import { BusinessSiteTaskService } from '../business-site-task.service';

import { VerifyDataNotificationComponent } from './verify-data-notification.component';

describe('ReadOnlyNotificationComponent', () => {
  let component: VerifyDataNotificationComponent;
  let fixture: ComponentFixture<VerifyDataNotificationComponent>;
  let businessSiteTaskServiceSpy: Spy<BusinessSiteTaskService>;

  beforeEach(
    waitForAsync(() => {
      businessSiteTaskServiceSpy = createSpyFromClass(BusinessSiteTaskService);
      businessSiteTaskServiceSpy.existsFor.nextWith(false);

      TestBed.configureTestingModule({
        declarations: [VerifyDataNotificationComponent, TranslatePipeMock],
        providers: [{ provide: BusinessSiteTaskService, useValue: businessSiteTaskServiceSpy }],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyDataNotificationComponent);
    component = fixture.componentInstance;
    component.outletId = 'GS0000001';
    component.taskFilter = {
      dataClusters: [DataCluster.BASE_DATA_ADDRESS],
      status: Status.OPEN,
      type: Type.DATA_CHANGE
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return message if task present', () => {
    businessSiteTaskServiceSpy.existsFor.nextWith(true);
    component.showMessage = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toBeTruthy();
  });

  it('should not return message if task not present', () => {
    businessSiteTaskServiceSpy.existsFor.nextWith(false);
    component.showMessage = false;

    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toBeFalsy();
  });
});
