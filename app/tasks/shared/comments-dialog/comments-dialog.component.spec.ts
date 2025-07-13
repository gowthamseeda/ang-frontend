import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsDialogComponent } from './comments-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskMock } from 'app/tasks/task.mock';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { BusinessSiteTaskService } from '../business-site-task.service';
import { SnackBarService } from 'app/shared/services/snack-bar/snack-bar.service';
import { TranslatePipeMock } from 'app/testing/pipe-mocks/translate';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Status } from 'app/tasks/task.model';

describe('RejectCommentsDialogComponent', () => {
  let component: CommentsDialogComponent;
  let fixture: ComponentFixture<CommentsDialogComponent>;

  let businessSiteTaskServiceSpy: Spy<BusinessSiteTaskService>
  let snackBarServiceSpy: Spy<SnackBarService>

  beforeEach(async () => {
    businessSiteTaskServiceSpy = createSpyFromClass(BusinessSiteTaskService)
    snackBarServiceSpy = createSpyFromClass(SnackBarService)

    await TestBed.configureTestingModule({
      declarations: [CommentsDialogComponent, TranslatePipeMock],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: jest.fn()
          }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: TaskMock.mockTaskArray[1]
        },
        { provide: BusinessSiteTaskService, useValue: businessSiteTaskServiceSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CommentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should display success snackbar if task is successfully rejected', () => {
      const spy = jest.spyOn(component.dialogRef, 'close');
      businessSiteTaskServiceSpy.updateStatus.nextWith();
      component.commentForm.get('comment')?.setValue('TESTING');
      component.data.isAcceptAll = undefined;
      component.data.task = {
        shouldDisplayFutureValue: true,
        futureValue: 'Future Value Example',
        isChanged: true,
        taskId: 123,
        messageForUnchangedValue: 'No changes detected',
        noValueChangeMsgForBSR: 'NO_CHANGES_MADE_TO_THE_FIELD',
        noValueChangeMsgForMTR: 'EXISTING_DATA_CONFIRMED',
        showApprovedNotification: true,
        showDeclinedNotification: false,
        showDirectChangeNotification: true,
        showVerificationNotification: false,
      };
      component.onSubmit();

      expect(businessSiteTaskServiceSpy.updateStatus).toBeCalledWith(
        component.data.task?.taskId, Status.DECLINED, 'TESTING'
      );
      expect(snackBarServiceSpy.showInfo).toBeCalledWith('TASK_REJECTED_SUCCESS')
      expect(spy).toBeCalled();
    })

    it('should display error snackbar if task failed to accept', () => {
      businessSiteTaskServiceSpy.updateStatus.throwWith(Error);
      component.commentForm.get('comment')?.setValue('TESTING');
      component.data.isAcceptAll = undefined;
      component.data.task = {
        shouldDisplayFutureValue: true,
        futureValue: 'Future Value Example',
        isChanged: true,
        taskId: 123,
        messageForUnchangedValue: 'No changes detected',
        noValueChangeMsgForBSR: 'NO_CHANGES_MADE_TO_THE_FIELD',
        noValueChangeMsgForMTR: 'EXISTING_DATA_CONFIRMED',
        showApprovedNotification: true,
        showDeclinedNotification: false,
        showDirectChangeNotification: true,
        showVerificationNotification: false,
      };
      component.onSubmit();

      expect(businessSiteTaskServiceSpy.updateStatus).toBeCalledWith(
        component.data.task?.taskId, Status.DECLINED, 'TESTING'
      );
      expect(snackBarServiceSpy.showError).toBeCalledWith(Error);
    })

    it('should close dialog when accept all is true', () => {
      const spy = jest.spyOn(component.dialogRef, 'close');
      businessSiteTaskServiceSpy.updateStatus.nextWith()
      component.commentForm.get('comment')?.setValue('TESTING');
      component.data.isAcceptAll = true;
      component.onSubmit();

      expect(spy).toBeCalledWith({ submitted: true, comment: 'TESTING' });
    })
    it('should close dialog when decline all is true', () => {
      const spy = jest.spyOn(component.dialogRef, 'close');
      businessSiteTaskServiceSpy.updateStatus.nextWith()
      component.commentForm.get('comment')?.setValue('TESTING');
      component.data.isDeclineAll = true;
      component.onSubmit();

      expect(spy).toBeCalledWith({ submitted: true, comment: 'TESTING' });
    })
  })

  it('should close dialog on close', () => {
    const spy = jest.spyOn(component.dialogRef, 'close');

    component.closeDialog()

    expect(spy).toBeCalled()
  })
});
