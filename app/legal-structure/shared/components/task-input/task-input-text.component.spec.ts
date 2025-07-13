import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TaskInputTextComponent } from './task-input-text.component';
import { TaskMock } from '../../../../tasks/task.mock';
import { TaskCommentComponent } from '../../../../shared/components/task-comment/task-comment.component';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { TaskDataService } from '../../../../tasks/task/store/task-data.service';
import { MatDialog } from '@angular/material/dialog';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';
import { ReactiveFormsModule, FormBuilder, FormControl } from '@angular/forms';
import { TasksService } from '../../services/tasks.service';
import { UserService } from '../../../../iam/user/user.service';
import { FeatureToggleService } from '../../../../shared/directives/feature-toggle/feature-toggle.service';
import { BaseData4rService } from '../../../outlet/base-data-4r.service';
import { of, take } from 'rxjs';
import { VerificationTaskFormStatus } from '../../../../tasks/task.model';

function getOutletFormMock() {
  return new FormBuilder().group({
    nameAddition: ''
  });
}

describe('TaskInputTextComponent', () => {
  let component: TaskInputTextComponent;
  let taskDataServiceSpy: Spy<TaskDataService>;
  let taskService: Spy<TasksService>;
  let userService: Spy<UserService>;
  let featureToggleService: Spy<FeatureToggleService>;
  let fixture: ComponentFixture<TaskInputTextComponent>;
  let matDialogSpy: Spy<MatDialog>;
  let baseDataService: Spy<BaseData4rService>;

  beforeEach(waitForAsync(() => {
    taskDataServiceSpy = createSpyFromClass(TaskDataService);
    matDialogSpy = createSpyFromClass(MatDialog);
    taskService = createSpyFromClass(TasksService);
    taskService.getDataChangeTasks.nextWith(TaskMock.asList());
    userService = createSpyFromClass(UserService);
    userService.getRoles.nextWith([]);
    featureToggleService = createSpyFromClass(FeatureToggleService);
    featureToggleService.isFeatureEnabled.nextWith(true);
    baseDataService = createSpyFromClass(BaseData4rService);
    baseDataService.isOpenVerificationTaskByAggregateField.mockReturnValue(of(true));
    baseDataService.getEditPage.nextWith(true);
    baseDataService.subscribeToAllCompletedVerificationTasks.nextWith([]);

    TestBed.configureTestingModule({
      declarations: [TaskInputTextComponent, TranslatePipeMock],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: TaskDataService, useValue: taskDataServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: TasksService, useValue: taskService },
        { provide: UserService, useValue: userService },
        { provide: FeatureToggleService, useValue: featureToggleService },
        { provide: BaseData4rService, useValue: baseDataService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskInputTextComponent);
    component = fixture.componentInstance;
    component.parentForm = getOutletFormMock();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('On Init', () => {
    it('should display declined data if name addition is included in data notification change fields', () => {
      component.dataNotificationChangeFieldsInclusion = ['NAME_ADDITION'];
      component.dataNotificationChangeFields = {
        declined: [{ field: 'NAME_ADDITION', taskId: 1 }],
        directChange: [],
        approved: []
      };
      component.ngOnInit();

      expect(component.declinedData).toEqual({ shouldDisplay: true, taskId: 1 });
    });

    it('should not display declined data if name addition is not included in data notification change fields', () => {
      component.dataNotificationChangeFieldsInclusion = ['STREET_NUMBER'];
      component.dataNotificationChangeFields = {
        declined: [{ field: 'STREET', taskId: 2 }],
        directChange: [],
        approved: []
      };
      component.ngOnInit();

      expect(component.declinedData).toEqual({ shouldDisplay: false });
    });
  });

  it('should call checkDataChanged, checkDataApproved, and checkDataDeclined on ngOnChanges', () => {
    const checkDataChangedSpy = spyOn<any>(component, 'checkDataChanged');
    const checkDataApprovedSpy = spyOn<any>(component, 'checkDataApproved');
    const checkDataDeclinedSpy = spyOn<any>(component, 'checkDataDeclined');

    component.ngOnChanges();

    expect(checkDataChangedSpy).toHaveBeenCalled();
    expect(checkDataApprovedSpy).toHaveBeenCalled();
    expect(checkDataDeclinedSpy).toHaveBeenCalled();
  });

  it('should trigger task comment pop up on click', () => {
    const mockTaskWithComment = TaskMock.mockTaskArray[3];
    taskDataServiceSpy.getById.nextWith(mockTaskWithComment);
    component.taskCommentPopup();

    expect(matDialogSpy.open).toBeCalledWith(TaskCommentComponent, {
      data: mockTaskWithComment.comments
    });
  });

  describe('onKeyUp', () => {
    let mockControl: FormControl;
    beforeEach(() => {
      const controlName = 'nameAddition';
      const mockValue = 'test';
      mockControl = new FormControl(mockValue);

      spyOn(component.inputChange, 'emit');
      spyOn(component.isVerificationTaskPresent, 'pipe').and.returnValue(of(true));
      spyOn(component.parentForm, 'get').and.callFake((name: string) => {
        return name === controlName ? mockControl : null;
      });
      component.isBusinessSiteResponsible = true;
      component.fieldName = controlName;
    });

    it('should emit the value on key up', () => {
      const event = new Event('keyup');
      component.onKeyUp(event);
      expect(component.inputChange.emit).toHaveBeenCalledWith(event);
    });
  });

  describe('onKeyDown when isMTR should', () => {
    let mockControl: FormControl;

    beforeEach(() => {
      const controlName = 'nameAddition';
      const mockValue = 'test';
      mockControl = new FormControl(mockValue);
      spyOn(component.inputChange, 'emit');
      spyOn(component.parentForm, 'get').and.callFake((name: string) => {
        return name === controlName ? mockControl : null;
      });
      component.isMarketResponsible = true;
      component.fieldName = controlName;
      (component.taskForDisplay.shouldDisplayFutureValue = true), fixture.detectChanges();
    });

    it('should remain the test value', () => {
      const mockEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter'
      });
      component.onKeyDown(mockEvent);
      expect(component.parentForm.get('nameAddition')?.value).toBe('test');
      expect(matDialogSpy.open).toHaveBeenCalled();
    });
  });
  it('should update verificationTaskStatus correctly when aggregateField is included', () => {
    const aggregateField = 'testField';
    component.aggregateField = aggregateField;
    component.fieldName = 'nameAddition';
    component.initialValue = null;
    component.value = '';
    component.isVerificationTaskPresent = of(true);
    component.parentForm.get('nameAddition')?.setValue('');

    baseDataService.subscribeToAllCompletedVerificationTasks.nextWith([aggregateField]);

    component.subscribeToRemainVerificationTasks();

    expect(component.verificationTaskStatus).toBe(VerificationTaskFormStatus.REMAIN);
  });

  it('should update verificationTaskStatus to CHANGED when field value is different from initialValue', () => {
    const aggregateField = 'testField';
    component.aggregateField = aggregateField;
    component.fieldName = 'nameAddition';
    component.initialValue = 'initial';
    component.value = '';
    component.isVerificationTaskPresent = of(true);
    component.parentForm.get('nameAddition')?.setValue('changedValue');

    baseDataService.subscribeToAllCompletedVerificationTasks.nextWith([aggregateField]);

    component.subscribeToRemainVerificationTasks();

    expect(component.verificationTaskStatus).toBe(VerificationTaskFormStatus.CHANGED);
  });

  it('should not update verificationTaskStatus when aggregateField is not included', () => {
    const aggregateField = 'testField';
    component.aggregateField = aggregateField;
    component.fieldName = 'nameAddition';
    component.initialValue = null;
    component.value = '';
    component.isVerificationTaskPresent = of(true);
    component.parentForm.get('nameAddition')?.setValue('');

    baseDataService.subscribeToAllCompletedVerificationTasks.nextWith(['otherField']);

    component.subscribeToRemainVerificationTasks();

    expect(component.verificationTaskStatus).toBe(VerificationTaskFormStatus.NOT_PRESENT);
  });

  describe('initTaskWithRoles', () => {
    beforeEach(() => {
      component.aggregateField = 'testField';
    });

    it('should set isMarketResponsible and isBusinessSiteResponsible based on roles', () => {
      userService.getRoles.nextWith(['GSSNPLUS.MarketTaskResponsible']);
      component.initTaskWithRoles();
      expect(component.isMarketResponsible).toBe(true);
      expect(component.isBusinessSiteResponsible).toBe(false);

      userService.getRoles.nextWith(['GSSNPLUS.BusinessSiteResponsible']);
      component.initTaskWithRoles();
      expect(component.isMarketResponsible).toBe(false);
      expect(component.isBusinessSiteResponsible).toBe(true);
    });

    it('should set isVerificationTaskPresent based on roles', () => {
      userService.getRoles.nextWith(['GSSNPLUS.MarketTaskResponsible']);
      baseDataService.isOpenVerificationTaskByAggregateField.mockReturnValue(of(true));
      component.initTaskWithRoles();
      component.isVerificationTaskPresent.pipe(take(1)).subscribe(value => {
        expect(value).toBe(true);
      });

      userService.getRoles.nextWith([]);
      component.initTaskWithRoles();
      component.isVerificationTaskPresent.pipe(take(1)).subscribe(value => {
        expect(value).toBe(false);
      });
    });

    it('should not fetch data change tasks if feature is disabled', () => {
      userService.getRoles.nextWith(['GSSNPLUS.MarketTaskResponsible']);
      featureToggleService.isFeatureEnabled.nextWith(false);
      component.initTaskWithRoles();
      component.openDataChange.pipe(take(1)).subscribe(task => {
        expect(task).toBeUndefined();
      });
      expect(component.taskForDisplay.shouldDisplayFutureValue).toBe(false);
      expect(component.hasChange).toBe(false);
    });

    it('should set taskForDisplay and futureValue based on data change tasks', () => {
      userService.getRoles.nextWith(['GSSNPLUS.MarketTaskResponsible']);
      featureToggleService.isFeatureEnabled.nextWith(true);
      const mockTask = {
        ...TaskMock.asList()[0],
        aggregateField: 'testField',
        taskId: 1,
        diff: { new: 'newValue', old: 'oldValue' }
      };
      taskService.getDataChangeTasks.nextWith([mockTask]);
      component.initTaskWithRoles();
      expect(component.taskForDisplay.taskId).toBe(mockTask.taskId);
      expect(component.taskForDisplay.shouldDisplayFutureValue).toBe(true);
      component.futureValue.pipe(take(1)).subscribe(value => {
        expect(value).toBe('newValue');
      });
    });

    it('should handle empty data change tasks', () => {
      userService.getRoles.nextWith(['GSSNPLUS.MarketTaskResponsible']);
      featureToggleService.isFeatureEnabled.nextWith(true);
      taskService.getDataChangeTasks.nextWith([]);
      component.initTaskWithRoles();
      expect(component.taskForDisplay.shouldDisplayFutureValue).toBe(false);
    });

    it('should set hasChange based on data change tasks', () => {
      userService.getRoles.nextWith(['GSSNPLUS.MarketTaskResponsible']);
      featureToggleService.isFeatureEnabled.nextWith(true);
      const mockTask = {
        ...TaskMock.asList()[0],
        aggregateField: 'testField',
        taskId: 1,
        diff: { new: 'newValue', old: 'oldValue' }
      };
      taskService.getDataChangeTasks.nextWith([mockTask]);
      component.initTaskWithRoles();
      expect(component.hasChange).toBe(true);

      const mockTaskWithEmptyNewValue = {
        ...TaskMock.asList()[0],
        aggregateField: 'testField',
        diff: { new: null, old: 'oldValue' }
      };
      taskService.getDataChangeTasks.nextWith([mockTaskWithEmptyNewValue]);
      component.initTaskWithRoles();
      expect(component.hasChange).toBe(true);
    });
  });
});
