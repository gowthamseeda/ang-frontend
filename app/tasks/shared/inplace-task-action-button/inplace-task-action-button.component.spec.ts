import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InplaceTaskActionButtonComponent } from './inplace-task-action-button.component';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { BusinessSiteTaskService } from '../business-site-task.service';
import { SnackBarService } from 'app/shared/services/snack-bar/snack-bar.service';
import { MatDialog } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommentsDialogComponent } from '../comments-dialog/comments-dialog.component';
import { TaskMock } from 'app/tasks/task.mock';
import {Status, TaskForDisplay, Type, DataCluster} from 'app/tasks/task.model';
import {TaskWebSocketService} from "../../service/task-websocket.service";
import {of} from "rxjs";

describe('InplaceTaskActionButtonComponent', () => {
  let component: InplaceTaskActionButtonComponent;
  let fixture: ComponentFixture<InplaceTaskActionButtonComponent>;

  let businessSiteTaskServiceSpy: Spy<BusinessSiteTaskService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let matDialogSpy: Spy<MatDialog>;
  let taskWebSocketServiceSpy: Spy<TaskWebSocketService>;

  beforeEach(async () => {
    businessSiteTaskServiceSpy = createSpyFromClass(BusinessSiteTaskService)
    snackBarServiceSpy = createSpyFromClass(SnackBarService)
    matDialogSpy = createSpyFromClass(MatDialog)
    taskWebSocketServiceSpy = createSpyFromClass(TaskWebSocketService)

    await TestBed.configureTestingModule({
      declarations: [InplaceTaskActionButtonComponent],
      providers: [
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: BusinessSiteTaskService, useValue: businessSiteTaskServiceSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        { provide: TaskWebSocketService, useValue: taskWebSocketServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InplaceTaskActionButtonComponent);
    component = fixture.componentInstance;

    component.task = TaskMock.asList()[0]
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onAccept', () => {
    it('should display success snackbar if task is successfully accepted', () => {
      businessSiteTaskServiceSpy.updateStatus.nextWith()
      component.onAccept()

      expect(businessSiteTaskServiceSpy.updateStatus).toBeCalledWith(component.task.taskId, Status.APPROVED)
      expect(snackBarServiceSpy.showInfo).toBeCalledWith('TASK_APPROVED_SUCCESS')
    })

    it('should display error snackbar if task failed to accept', () => {
      businessSiteTaskServiceSpy.updateStatus.throwWith(Error)
      component.onAccept()

      expect(businessSiteTaskServiceSpy.updateStatus).toBeCalledWith(component.task.taskId, Status.APPROVED)
      expect(snackBarServiceSpy.showError).toBeCalledWith(Error)
    })
    it('should call bulkChangeTaskStatus if fieldsStartName or specificFields are present', () => {
      component.fieldsStartName = 'testField';
      component.specificFields = ['field1', 'field2'];
      const status = Status.APPROVED;

      spyOn(component, 'bulkChangeTaskStatus');

      component.onAccept();

      expect(component.bulkChangeTaskStatus).toHaveBeenCalledWith(status);
    });
  })
  describe('onDecline', () => {
    it('should open reject comment dialog onDecline', () => {
      businessSiteTaskServiceSpy.updateStatus.nextWith()
      spyOn(component.dialog, 'open').and.returnValue({
        afterClosed: () => of({
            submitted: true, comment: 'Test comment'
          }
        )
      });
      component.onDecline();

      expect(matDialogSpy.open).toBeCalledWith(CommentsDialogComponent, { data: {task: component.task, isDeclineAll: false} })
    })

    it('should call bulkChangeTaskStatus when dialog is closed with submitted result and no specific task', () => {
      const comment = 'Test comment';
      const status = Status.DECLINED;
      component.task = undefined as unknown as TaskForDisplay;

      spyOn(component.dialog, 'open').and.returnValue({
        afterClosed: () => of({ submitted: true, comment: comment })
      });
      spyOn(component, 'bulkChangeTaskStatus');

      component.onDecline();

      expect(component.dialog.open).toHaveBeenCalledWith(CommentsDialogComponent, { data: { task: component.task, isDeclineAll: true } });
      expect(component.bulkChangeTaskStatus).toHaveBeenCalledWith(status, comment);
    });
  })

  describe('subscribeToTask', () => {
    it('should call evaluateTask when a valid task is received', () => {
      component.fieldsStartName = 'test';
      const taskData = {
        businessSiteId: component.outletId,
        aggregateField: 'testField',
        type: Type.DATA_CHANGE
      };

      spyOn(component, 'evaluateTask');
      taskWebSocketServiceSpy.getLiveTask.mockReturnValue(of(taskData));

      component.subscribeToTask();

      expect(component.evaluateTask).toHaveBeenCalled();
    });
  });

  describe('evaluateTask', () => {
    it('should set isOpenTaskAvailable to true if there are open tasks', (done) => {
      const tasks = [
        { aggregateField: 'testField', type: Type.DATA_CHANGE, status: Status.OPEN, dataCluster: DataCluster.COMMUNICATION_CHANNELS }
      ];

      businessSiteTaskServiceSpy.getBy.mockReturnValue(of(tasks));

      component.evaluateTask();

      component.isOpenTaskAvailable.subscribe(isAvailable => {
        expect(isAvailable).toBe(true);
        expect(component.filteredTasks.length).toBe(1);
        done();
      });
    });

    it('should set isOpenTaskAvailable to false if there are no open tasks', () => {
      const tasks = [
        { aggregateField: 'testField', type: Type.DATA_CHANGE, status: Status.APPROVED }
      ];

      businessSiteTaskServiceSpy.getBy.mockReturnValue(of(tasks));

      component.evaluateTask();

      component.isOpenTaskAvailable.subscribe(isAvailable => {
        expect(isAvailable).toBe(false);
      });
    });
  });
});
