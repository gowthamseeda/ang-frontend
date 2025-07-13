import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewChangesMadeNotificationComponent } from './review-changes-made-notification.component';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { BusinessSiteTaskService } from '../../business-site-task.service';
import { SnackBarService } from 'app/shared/services/snack-bar/snack-bar.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslatePipeMock } from 'app/testing/pipe-mocks/translate';
import { TaskMock } from 'app/tasks/task.mock';
import {MatDialog} from "@angular/material/dialog";
import {of} from "rxjs";

describe('ReviewChangesMadeNotificationComponent', () => {
  let component: ReviewChangesMadeNotificationComponent;
  let fixture: ComponentFixture<ReviewChangesMadeNotificationComponent>;

  let businessSiteTaskServiceSpy: Spy<BusinessSiteTaskService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let matDialogSpy: Spy<MatDialog>;

  beforeEach(async () => {
    businessSiteTaskServiceSpy = createSpyFromClass(BusinessSiteTaskService)
    snackBarServiceSpy = createSpyFromClass(SnackBarService)
    matDialogSpy = createSpyFromClass(MatDialog)

    await TestBed.configureTestingModule({
      declarations: [ReviewChangesMadeNotificationComponent, TranslatePipeMock],
      providers: [
        { provide: BusinessSiteTaskService, useValue: businessSiteTaskServiceSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReviewChangesMadeNotificationComponent);
    component = fixture.componentInstance;
    component.openTasks = TaskMock.mockTaskArray
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('on accept all', () => {
    it('should display success snackbar if all tasks are successfully approved', () => {
      businessSiteTaskServiceSpy.updateTasks.nextWith()
      spyOn(component.matDialog, 'open').and.returnValue({
        afterClosed: () => of({
          submitted: true, comment: 'Test comment'
          }
        )
      });
      component.onAcceptAll();

      expect(businessSiteTaskServiceSpy.updateTasks).toBeCalledTimes(1);
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('TASK_APPROVED_SUCCESS');
    });

    it('should display error snackbar if some tasks fail to approve', () => {
      businessSiteTaskServiceSpy.updateTasks.throwWith(Error)
      spyOn(component.matDialog, 'open').and.returnValue({
        afterClosed: () => of({
            submitted: true, comment: 'Test comment'
          }
        )
      });
      component.onAcceptAll();

      expect(businessSiteTaskServiceSpy.updateTasks).toBeCalledTimes(1)
      expect(snackBarServiceSpy.showError).toBeCalled()
    });
  });

  describe('on declined all', () => {
    it('should display success snackbar if all tasks are successfully declined', () => {
      businessSiteTaskServiceSpy.updateTasks.nextWith()
      spyOn(component.matDialog, 'open').and.returnValue({
        afterClosed: () => of({
            submitted: true, comment: 'Test comment'
          }
        )
      });
      component.onDeclineAll();

      expect(businessSiteTaskServiceSpy.updateTasks).toBeCalledTimes(1);
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('TASK_APPROVED_SUCCESS');
    });

    it('should display error snackbar if some tasks fail to decline', () => {
      businessSiteTaskServiceSpy.updateTasks.throwWith(Error)
      spyOn(component.matDialog, 'open').and.returnValue({
        afterClosed: () => of({
            submitted: true, comment: 'Test comment'
          }
        )
      });
      component.onDeclineAll();

      expect(businessSiteTaskServiceSpy.updateTasks).toBeCalledTimes(1)
      expect(snackBarServiceSpy.showError).toBeCalled()
    });
  });
});
