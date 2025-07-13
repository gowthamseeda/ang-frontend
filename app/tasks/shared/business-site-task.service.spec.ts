import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { throwError } from 'rxjs';

import { UserAuthorizationService } from '../../iam/user/user-authorization.service';
import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { TestingModule } from '../../testing/testing.module';
import { DataCluster, Status, Task, TaskRequest, Type } from '../task.model';

import { BusinessSiteTaskService, TaskQueryParams } from './business-site-task.service';
import { TaskMock } from '../task.mock';

describe('BusinessSiteTaskService', () => {
  let service: BusinessSiteTaskService;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let apiServiceSpy: Spy<ApiService>;

  beforeEach(() => {
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.verify.nextWith(true);

    apiServiceSpy = createSpyFromClass(ApiService);
    apiServiceSpy.get.nextWith({ tasks: TaskMock.forContracts() });

    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        BusinessSiteTaskService,
        { provide: ApiService, useValue: apiServiceSpy },
        LoggingService,
        {
          provide: UserAuthorizationService,
          useValue: {
            isAuthorizedFor: userAuthorizationServiceSpy
          }
        }
      ]
    });
    service = TestBed.inject(BusinessSiteTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBy()', () => {
    it('should return empty task list if contract return not found', done => {
      apiServiceSpy.get.nextWith({ tasks: [] });

      const outletId = 'GS00000002';
      service.getBy(outletId).subscribe(response => {
        expect(response).toEqual([]);
        done();
      });
    });

    it('should return empty array if permission denied', done => {
      const outletId = 'GS00000001';
      const params: TaskQueryParams = {
        type: Type.DATA_VERIFICATION
      };
      userAuthorizationServiceSpy.verify.nextWith(false);
      service.getBy(outletId, params).subscribe(response => {
        expect(response).toEqual([]);
        done();
      });
    });

    it('should return tasks from contracts with type DATA_VERIFICATION', done => {
      const outletId = 'GS00000001';
      const params: TaskQueryParams = {
        type: Type.DATA_VERIFICATION
      };

      apiServiceSpy.get.nextWith({
        tasks: TaskMock.forContracts().filter(task => task.type == params.type)
      });

      const expected: Task[] = [
        {
          taskId: 1,
          businessSiteId: 'GS00000001',
          type: Type.DATA_VERIFICATION,
          status: Status.OPEN,
          dataCluster: DataCluster.BASE_DATA_ADDRESS,
          creationDate: '2020-01-01T00:00:00.000Z'
        }
      ];

      service.getBy(outletId, params).subscribe(response => {
        expect(response).toEqual(expected);
        done();
      });
    });
  });

  describe('existsFor()', () => {
    it('should return true when at least one task is present', done => {
      const outletId = 'GS00000001';
      const params: TaskQueryParams = {
        type: Type.DATA_VERIFICATION
      };

      service.existsFor(outletId, params).subscribe(exists => {
        expect(exists).toBeTruthy();
        done();
      });
    });

    it('should return false when no task is present', done => {
      apiServiceSpy.get.nextWith({ tasks: [] });
      const outletId = 'GS00000002';
      service.existsFor(outletId).subscribe(exists => {
        expect(exists).toBeFalsy();
        done();
      });
    });
  });

  describe('existsOpenDataChangeFor()', () => {
    it('should return true when at least one task is present', done => {
      const outletId = 'GS20000001';
      service.existsOpenDataChangeFor(outletId, [DataCluster.OPENING_HOURS]).subscribe(exists => {
        expect(exists).toBeTruthy();
        done();
      });
    });

    it('should return false when no task is present', done => {
      apiServiceSpy.get.nextWith({ tasks: [] });
      const outletId = 'GS00000002';
      service.existsOpenDataChangeFor(outletId, [DataCluster.BUSINESS_NAME]).subscribe(exists => {
        expect(exists).toBeFalsy();
        done();
      });
    });

    it('should return false when task return error', done => {
      const outletId = 'GS00000002';
      jest.spyOn(service, 'getBy').mockReturnValue(throwError('error'));

      service.existsOpenDataChangeFor(outletId, [DataCluster.BUSINESS_NAME]).subscribe(exists => {
        expect(exists).toBeFalsy();
        done();
      });
    });
  });

  describe('createTask', () => {
    it('should create task', done => {
      apiServiceSpy.post.nextWith({ id: '1', status: 'CREATED' });

      const task: TaskRequest = {
        businessSiteId: 'GS00000001',
        comment: 'Please check address information.',
        countryId: 'DE',
        dataCluster: DataCluster.LEGAL_TAX_NO,
        dueDate: '2020-12-31',
        status: Status.OPEN,
        type: Type.DATA_VERIFICATION
      };
      service.createTask(task).subscribe(result => {
        expect(result.status).toBe('CREATED');
        done();
      });
    });
  });

  describe('getByOutletId()', () => {
    it('should return empty task list if contract return not found', done => {
      apiServiceSpy.get.nextWith({ tasks: [] });
      const outletId = 'GS00000002';
      service.getByOutletId(outletId).subscribe(response => {
        expect(response).toEqual([]);
        done();
      });
    });

    it('should return empty array if permission denied', done => {
      const outletId = 'GS00000001';
      userAuthorizationServiceSpy.verify.nextWith(false);
      service.getByOutletId(outletId).subscribe(response => {
        expect(response).toEqual([]);
        done();
      });
    });

    it('should return tasks from contracts with same outletId', done => {
      const outletId = 'GS00000001';

      apiServiceSpy.get.nextWith({
        tasks: TaskMock.forContracts().filter(task => task.businessSiteId == outletId)
      });

      const expected: Task[] = [
        {
          taskId: 1,
          businessSiteId: 'GS00000001',
          type: Type.DATA_VERIFICATION,
          status: Status.OPEN,
          dataCluster: DataCluster.BASE_DATA_ADDRESS,
          creationDate: '2020-01-01T00:00:00.000Z'
        },
        {
          taskId: 322,
          businessSiteId: 'GS00000001',
          type: Type.DATA_CHANGE,
          status: Status.OPEN,
          dataCluster: DataCluster.OPENING_HOURS,
          creationDate: '2020-06-12T14:35:00.000Z'
        },
        {
          taskId: 346,
          businessSiteId: 'GS00000001',
          type: Type.DATA_CHANGE,
          status: Status.OPEN,
          dataCluster: DataCluster.COMMUNICATION_CHANNELS,
          creationDate: '2020-06-12T14:35:00.000Z'
        }
      ];
      userAuthorizationServiceSpy.verify.nextWith(true);
      service.getByOutletId(outletId).subscribe(response => {
        expect(response).toEqual(expected);
        done();
      });
    });
  });
});
