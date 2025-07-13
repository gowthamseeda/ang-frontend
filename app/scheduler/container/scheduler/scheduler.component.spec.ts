import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TranslatePipeMock } from '../../../testing/pipe-mocks/translate';
import { TestingModule } from '../../../testing/testing.module';
import { getAPISchedulerJobs, getAuditLogCleanSchedulerJobs, getXMLSchedulerJobs } from '../../model/scheduler.mock';
import { SchedulerTableRow, SchedulerType } from '../../model/scheduler.model';
import { ApiSchedulerService } from '../../services/api-scheduler.service';
import { XmlSchedulerService } from '../../services/xml-scheduler.service';

import { SchedulerComponent } from './scheduler.component';
import { AuditLogCleanSchedulerService } from '../../services/audit-log-clean-scheduler.service';

describe('SchedulerComponent', () => {
  let component: SchedulerComponent;
  let fixture: ComponentFixture<SchedulerComponent>;

  let apiSchedulerServiceSpy: Spy<ApiSchedulerService>;
  let xmlSchedulerServiceSpy: Spy<XmlSchedulerService>;
  let auditLogCleanSchedulerServiceSpy: Spy<AuditLogCleanSchedulerService>;

  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let translateServiceSpy: Spy<TranslateService>;

  beforeEach(waitForAsync(() => {
    apiSchedulerServiceSpy = createSpyFromClass(ApiSchedulerService);
    apiSchedulerServiceSpy.getAll.nextWith(getAPISchedulerJobs());
    xmlSchedulerServiceSpy = createSpyFromClass(XmlSchedulerService);
    xmlSchedulerServiceSpy.getAll.nextWith(getXMLSchedulerJobs());
    auditLogCleanSchedulerServiceSpy = createSpyFromClass(AuditLogCleanSchedulerService);
    auditLogCleanSchedulerServiceSpy.getAll.nextWith(getAuditLogCleanSchedulerJobs());
    auditLogCleanSchedulerServiceSpy.getAllCleanSchedulerStatus.nextWith([]);
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userAuthorizationServiceSpy.verify.nextWith(true);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    translateServiceSpy = createSpyFromClass(TranslateService);

    TestBed.configureTestingModule({
      declarations: [SchedulerComponent, TranslatePipeMock],
      imports: [TestingModule],
      providers: [
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: ApiSchedulerService, useValue: apiSchedulerServiceSpy },
        { provide: XmlSchedulerService, useValue: xmlSchedulerServiceSpy },
        { provide: AuditLogCleanSchedulerService, useValue: auditLogCleanSchedulerServiceSpy },
        {
          provide: UserAuthorizationService,
          useValue: {
            isAuthorizedFor: {
              permissions: () => userAuthorizationServiceSpy
            }
          }
        },
        {
          provide: SnackBarService,
          useValue: snackBarServiceSpy
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should init loading indicator for api and xml', () => {
      expect(component.isApiLoading).toBeTruthy();
      expect(component.isXmlLoading).toBeTruthy();
    });

    it('should call functions when init', () => {
      spyOn(component, 'getXmlScheduler');
      spyOn(component, 'getAuditLogCleanScheduler');
      component.ngOnInit();

      // expect(component.getApiScheduler).toHaveBeenCalled();
      expect(component.getXmlScheduler).toHaveBeenCalled();
      expect(component.getAuditLogCleanScheduler).toHaveBeenCalled();
    });

    it('should have auditLogCleanDetails', () => {
      spyOn(component, 'getAuditLogCleanScheduler');
      var result = getAuditLogCleanSchedulerJobs();
      component.ngOnInit();

      expect(component.auditLogCleanDetails.length).toBe(result.length);
      expect(component.auditLogCleanDetails[0].name).toBe(result[0].name);
      expect(component.auditLogCleanDetails[0].currentStatus).toBe(result[0].currentStatus);
      expect(component.auditLogCleanDetails[0].lastRunningTime).toBe(result[0].lastRunningTime);
      expect(component.auditLogCleanDetails[0].lastRunningStatus).toBe(result[0].lastRunningStatus);
      expect(component.auditLogCleanDetails[0].lastDeletedRecords).toBe(result[0].lastDeletedRecords);
    });
  });

  describe('triggerAction', () => {
    beforeEach(() => {
      spyOn(component, 'runApi');
      spyOn(component, 'runXml');
      spyOn(component, 'abortApi');
      spyOn(component, 'abortXml');
    });

    it('should trigger API action if scheduler Type is API and isRunning is FALSE', () => {
      const input = mapToMockSchedulerTableRow(SchedulerType.API, false);
      component.triggerAction(input);

      expect(component.runApi).toHaveBeenCalled();
      expect(component.runXml).not.toHaveBeenCalled();
      expect(component.abortApi).not.toHaveBeenCalled();
      expect(component.abortXml).not.toHaveBeenCalled();
    });

    it('should trigger API action if scheduler Type is API and isRunning is TRUE', () => {
      const input = mapToMockSchedulerTableRow(SchedulerType.API, true);
      component.triggerAction(input);

      expect(component.runApi).not.toHaveBeenCalled();
      expect(component.runXml).not.toHaveBeenCalled();
      expect(component.abortApi).toHaveBeenCalled();
      expect(component.abortXml).not.toHaveBeenCalled();
    });

    it('should trigger XML action if scheduler Type is API and isRunning is FALSE', () => {
      const input = mapToMockSchedulerTableRow(SchedulerType.XML, false);
      component.triggerAction(input);

      expect(component.runApi).not.toHaveBeenCalled();
      expect(component.runXml).toHaveBeenCalled();
      expect(component.abortApi).not.toHaveBeenCalled();
      expect(component.abortXml).not.toHaveBeenCalled();
    });

    it('should trigger XML action if scheduler Type is XML and isRunning is TRUE', () => {
      const input = mapToMockSchedulerTableRow(SchedulerType.XML, true);
      component.triggerAction(input);

      expect(component.runApi).not.toHaveBeenCalled();
      expect(component.runXml).not.toHaveBeenCalled();
      expect(component.abortApi).not.toHaveBeenCalled();
      expect(component.abortXml).toHaveBeenCalled();
    });
  });

  function mapToMockSchedulerTableRow(
    tableType: SchedulerType,
    isRunning: boolean
  ): SchedulerTableRow {
    return {
      jobId: 'COUNTRY',
      schedule: '0',
      isActive: true,
      isRunning: isRunning,
      lastRunningStatus: '',
      lastRunningTime: new Date(),
      tableType: tableType
    } as SchedulerTableRow;
  }
});
