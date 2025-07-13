import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';
import { BusinessSiteTaskService } from '../../shared/business-site-task.service';
import { getUserMock } from '../../../iam/user/user.mock';
import { UserService } from '../../../iam/user/user.service';
import { ApiError, ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';
import { TaskMock } from '../../task.mock';
import {
  CommunicationDataDiff,
  DataCluster,
  OpeningHoursDiff,
  Status,
  Task,
  Type
} from '../../task.model';
import { TaskService } from '../../task/task.service';

import { TaskDetailContainerComponent } from './task-detail-container.component';
import { TranslateCountryPipe } from '../../../shared/pipes/translate-country/translate-country.pipe';
import { CountryService } from '../../../geography/country/country.service';
import { TranslateDataPipe } from '../../../shared/pipes/translate-data/translate-data.pipe';

const routeParamsMock = {
  snapshot: {
    params: {
      taskId: 1
    }
  }
};

const taskMock = {
  taskId: 1,
  businessSite: {
    businessSiteId: 'GS0000001',
    legalName: 'Name',
    address: {
      city: 'Ulm',
      countryId: '123'
    }
  },
  status: Status.OPEN,
  type: Type.DATA_CHANGE,
  dataCluster: DataCluster.BASE_DATA_ADDRESS,
  creationDate: ''
};

const user = getUserMock();

describe('TaskDetailContainerComponent', () => {
  let component: TaskDetailContainerComponent;
  let fixture: ComponentFixture<TaskDetailContainerComponent>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let taskServiceSpy: Spy<TaskService>;
  let businessSiteTaskServiceSpy: Spy<BusinessSiteTaskService>;
  let routerSpy: Spy<Router>;
  let userServiceSpy: Spy<UserService>;
  let userServiceSettingsSpy: Spy<UserSettingsService>;

  beforeEach(waitForAsync(() => {
    taskServiceSpy = createSpyFromClass(TaskService);
    taskServiceSpy.getBy.mockReturnValue(of(taskMock));
    taskServiceSpy.fetchBy.nextWith();
    businessSiteTaskServiceSpy = createSpyFromClass(BusinessSiteTaskService);
    routerSpy = createSpyFromClass(Router);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    userServiceSpy = createSpyFromClass(UserService);
    userServiceSpy.getCurrent.nextWith(user);
    userServiceSettingsSpy = createSpyFromClass(UserSettingsService);
    userServiceSettingsSpy.getLanguageId.nextWith('en-EN');

    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        TestingModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: TranslateFakeLoader }
        })
      ],
      declarations: [TaskDetailContainerComponent, TranslateCountryPipe],
      providers: [
        ApiService,
        LoggingService,
        TranslateService,
        CountryService,
        TranslateDataPipe,
        { provide: BusinessSiteTaskService, useValue: businessSiteTaskServiceSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: ActivatedRoute, useValue: routeParamsMock },
        { provide: UserService, useValue: userServiceSpy },
        { provide: UserSettingsService, useValue: userServiceSettingsSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return taskId 1 as route param onInit', () => {
    expect(component.taskId).toBe(1);
  });

  it('should call taskService.getBy on init', () => {
    expect(taskServiceSpy.getBy).toHaveBeenCalledTimes(1);
  });

  it('should have header and task-info component rendered in view', () => {
    const headerElement = fixture.debugElement.nativeElement.querySelector('gp-header');
    const taskInfoElement = fixture.debugElement.nativeElement.querySelector('gp-task-info');

    expect(headerElement).not.toBe(null);
    expect(taskInfoElement).not.toBe(null);
  });

  it('should have rendered task-info-detail table cell value', () => {
    const taskInfoDetail = fixture.debugElement.nativeElement.querySelector('mat-table').innerHTML;

    expect(taskInfoDetail).toContain(taskMock.businessSite.legalName);
    expect(taskInfoDetail).toContain(taskMock.businessSite.address.city);
    expect(taskInfoDetail).toContain(taskMock.businessSite.address.countryId);
    expect(taskInfoDetail).toContain(taskMock.businessSite.businessSiteId);
  });

  describe('approve()', () => {
    it('should call snackbarService.showInfo on success', () => {
      businessSiteTaskServiceSpy.updateStatus.nextWith(true);
      component.approve({ taskId: 1 });
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('TASK_APPROVED_SUCCESS');
    });

    it('should call snackbarService.showError on error', () => {
      const error = { message: 'GENERAL_API_ERROR' } as ApiError;
      businessSiteTaskServiceSpy.updateStatus.throwWith(error);
      component.approve({ taskId: 1 });
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });

  describe('reject()', () => {
    it('should call snackbarService.showInfo on success', () => {
      businessSiteTaskServiceSpy.updateStatus.nextWith(true);
      component.reject({ taskId: 1 });
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('TASK_REJECTED_SUCCESS');
    });

    it('should call snackbarService.showError on error', () => {
      const error = { message: 'GENERAL_API_ERROR' } as ApiError;
      businessSiteTaskServiceSpy.updateStatus.throwWith(error);
      component.reject({ taskId: 1 });
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });

  describe('isCurrentUserTaskInitiator()', () => {
    it('should return true if the current user is the task initiator', () => {
      const task: Task = {
        ...TaskMock.asList()[0],
        initiator: 'JODOE'
      };

      const userId = task.initiator ? task.initiator : '';
      const isCurrentUser = component.isCurrentUserTaskInitiator(userId);
      expect(isCurrentUser).toBeTruthy();
    });

    it('should return false if the current user is not the task initiator', () => {
      const task: Task = {
        ...TaskMock.asList()[0],
        initiator: 'TESTUSER'
      };

      const userId = task.initiator ? task.initiator : '';
      const isCurrentUser = component.isCurrentUserTaskInitiator(userId);
      expect(isCurrentUser).toBeFalsy();
    });
  });

  describe('TaskDetail ', () => {
    it('should have businessSite value', done => {
      component.task.subscribe(task => {
        expect(task.businessSite).toEqual(taskMock.businessSite);
        done();
      });
    });
  });

  describe('diffIsNotEmpty', () => {
    it('should return true if openingHoursDiff is not empty', () => {
      const mockOpeningHoursDiff: OpeningHoursDiff = {
        openingHoursDiff: [
          {
            id: 1,
            productCategoryId: 1,
            serviceId: 1,
            brandId: 'MB',
            productGroupId: 'PC',
            day: 'SU',
            diff: {
              old: { times: [], closed: false },
              new: { times: [], closed: true }
            }
          }
        ]
      };

      expect(component.diffIsNotEmpty(mockOpeningHoursDiff)).toBeTruthy();
    });

    it('should return false if openingHoursDiff is empty', () => {
      const mockOpeningHoursDiff: OpeningHoursDiff = {
        openingHoursDiff: []
      };
      expect(component.diffIsNotEmpty(mockOpeningHoursDiff)).toBeFalsy();
    });

    it('should return true if communicationDataDiff is not empty', () => {
      const mockCommunicationDataDiff: CommunicationDataDiff = {
        communicationDataDiff: [
          {
            offeredServiceId: 'GS1-1',
            brandId: 'MB',
            productGroupId: 'PC',
            communicationFieldId: 'TEL',
            diff: {
              old: '',
              new: '0123456789'
            }
          }
        ]
      };

      expect(component.diffIsNotEmpty(mockCommunicationDataDiff)).toBeTruthy();
    });

    it('should return false if communicationDataDiff is empty', () => {
      const mockCommunicationDataDiff: CommunicationDataDiff = {
        communicationDataDiff: []
      };
      expect(component.diffIsNotEmpty(mockCommunicationDataDiff)).toBeFalsy();
    });
  });

  describe('noMorePendingTask', () => {
    const mockEmptyOpeningHoursDiff: OpeningHoursDiff = {
      openingHoursDiff: []
    };
    const mockSomethingOpeningHoursDiff: OpeningHoursDiff = {
      openingHoursDiff: [
        {
          id: 1,
          productCategoryId: 1,
          serviceId: 1,
          brandId: 'MB',
          productGroupId: 'PC',
          day: 'SU',
          diff: {
            old: { times: [], closed: false },
            new: { times: [], closed: true }
          }
        }
      ]
    };
    const mockEmptyCommunicationDataDiff: CommunicationDataDiff = {
      communicationDataDiff: []
    };
    const mockSomethingCommunicationDataDiff: CommunicationDataDiff = {
      communicationDataDiff: [
        {
          offeredServiceId: 'GS1-1',
          brandId: 'MB',
          productGroupId: 'PC',
          communicationFieldId: 'TEL',
          diff: {
            old: '',
            new: '0123456789'
          }
        }
      ]
    };

    it('should return true if diff is empty and approvedDiff or declinedDiff is not empty', () => {
      expect(
        component.noMorePendingTask(
          mockEmptyOpeningHoursDiff,
          mockSomethingOpeningHoursDiff,
          mockEmptyOpeningHoursDiff
        )
      ).toBeTruthy();
      expect(
        component.noMorePendingTask(
          mockEmptyOpeningHoursDiff,
          mockEmptyOpeningHoursDiff,
          mockSomethingOpeningHoursDiff
        )
      ).toBeTruthy();
    });

    it('should return false if diff is not empty', () => {
      expect(
        component.noMorePendingTask(
          mockSomethingOpeningHoursDiff,
          mockEmptyOpeningHoursDiff,
          mockEmptyOpeningHoursDiff
        )
      ).toBeFalsy();
    });

    it('should return true if communicationDataDiff is not empty', () => {
      expect(
        component.noMorePendingTask(
          mockEmptyCommunicationDataDiff,
          mockSomethingCommunicationDataDiff,
          mockEmptyCommunicationDataDiff
        )
      ).toBeTruthy();
      expect(
        component.noMorePendingTask(
          mockEmptyCommunicationDataDiff,
          mockEmptyCommunicationDataDiff,
          mockSomethingCommunicationDataDiff
        )
      ).toBeTruthy();
    });

    it('should return false if communicationDataDiff is empty', () => {
      expect(
        component.noMorePendingTask(
          mockSomethingCommunicationDataDiff,
          mockEmptyCommunicationDataDiff,
          mockEmptyCommunicationDataDiff
        )
      ).toBeFalsy();
    });
  });
});
