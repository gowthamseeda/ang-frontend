import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpeningHourTaskActionButtonComponent } from './opening-hour-task-action-button.component';
import { BusinessSiteTaskService } from '../business-site-task.service';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipeMock } from '../../../testing/pipe-mocks/translate';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Status } from '../../task.model';
import { TaskMock } from '../../task.mock';


describe('OpeningHourTaskActionButtonComponent', () => {
  let component: OpeningHourTaskActionButtonComponent;
  let fixture: ComponentFixture<OpeningHourTaskActionButtonComponent>;

  let businessSiteTaskServiceSpy: Spy<BusinessSiteTaskService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let matDialogSpy: Spy<MatDialog>;

  beforeEach(async () => {
    businessSiteTaskServiceSpy = createSpyFromClass(BusinessSiteTaskService);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    matDialogSpy = createSpyFromClass(MatDialog);

    await TestBed.configureTestingModule({
      declarations: [OpeningHourTaskActionButtonComponent, TranslatePipeMock],
      providers: [
        { provide: BusinessSiteTaskService, useValue: businessSiteTaskServiceSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(OpeningHourTaskActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onAccept', () => {
    it('should display success snackbar if all tasks are successfully approved', () => {
      matDialogSpy.open.mockReturnValue({
        afterClosed: () => of({ submitted: true, comment: 'Test comment' })
      } as any);

      businessSiteTaskServiceSpy.updateStatus.mockReturnValue(of({}));

      component.openTasks = TaskMock.mockTaskWithOpeningHoursDiff;
      component.onAccept();

      expect(businessSiteTaskServiceSpy.updateStatus).toHaveBeenCalledTimes(1);
      expect(businessSiteTaskServiceSpy.updateStatus).toHaveBeenCalledWith(1, Status.APPROVED, 'Test comment');
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('TASK_APPROVED_SUCCESS');
    });

    it('should display error snackbar if some tasks fail to approve', () => {
      matDialogSpy.open.mockReturnValue({
        afterClosed: () => of({ submitted: true, comment: 'Test comment' })
      } as any);

      businessSiteTaskServiceSpy.updateStatus.mockReturnValue(throwError(() => new Error('Error')));
      component.openTasks = TaskMock.mockTaskWithOpeningHoursDiff;

      component.onAccept();

      expect(businessSiteTaskServiceSpy.updateStatus).toHaveBeenCalledTimes(1);
      expect(businessSiteTaskServiceSpy.updateStatus).toHaveBeenCalledWith(1, Status.APPROVED, 'Test comment');
    });
    
  });

  describe('onDecline', () => {
    it('should display success snackbar if all tasks are successfully declined', () => {
      matDialogSpy.open.mockReturnValue({
        afterClosed: () => of({ submitted: true, comment: 'Test comment' })
      } as any);
      
      businessSiteTaskServiceSpy.updateStatus.mockReturnValue(of({}));
      component.openTasks = TaskMock.mockTaskWithOpeningHoursDiff;
   
      component.onDecline();

      expect(businessSiteTaskServiceSpy.updateStatus).toHaveBeenCalledTimes(1);
      expect(businessSiteTaskServiceSpy.updateStatus).toHaveBeenCalledWith(1, Status.DECLINED, 'Test comment');

      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('TASK_DECLINED_SUCCESS');
    });

    it('should display error snackbar if some tasks fail to decline', () => {
      matDialogSpy.open.mockReturnValue({
        afterClosed: () => of({ submitted: true, comment: 'Test comment' })
      } as any);

      businessSiteTaskServiceSpy.updateStatus.mockReturnValue(throwError(() => new Error('Error')));

     component.openTasks = TaskMock.mockTaskWithOpeningHoursDiff;
      component.onDecline();

      expect(businessSiteTaskServiceSpy.updateStatus).toHaveBeenCalledTimes(1);
      expect(businessSiteTaskServiceSpy.updateStatus).toHaveBeenCalledWith(1, Status.DECLINED, 'Test comment');
    });
  });
   
});