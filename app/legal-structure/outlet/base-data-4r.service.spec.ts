import { TestBed } from '@angular/core/testing';

import { AGGREGATE_FIELDS } from '../../shared/model/constants';
import { Status, Task, Type } from '../../tasks/task.model';
import { BaseData4rService } from './base-data-4r.service';

describe('BaseData4rService', () => {
  let service: BaseData4rService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseData4rService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('address verification tasks', () => {
    it('should set and get address verification tasks (true) when the task is open', done => {
      const tasks: Task[] = [
        {
          taskId: 1,
          businessSiteId: 'GS01',
          status: Status.OPEN,
          type: Type.DATA_VERIFICATION,
          creationDate: '2024-01-09',
          aggregateField: AGGREGATE_FIELDS.BASE_DATA_ADDRESS_NUMBER
        }
      ];

      service.setAddressVerificationTasks(tasks);
      service.isAddressOpenVerificationTaskByAggregateField(AGGREGATE_FIELDS.BASE_DATA_ADDRESS_NUMBER).subscribe(hasOpenTask => {
        expect(hasOpenTask).toBeTruthy();
        done();
      });
    });

    it('should set and get address verification tasks (false) when the task is closed', done => {
      const tasks: Task[] = [
        {
          taskId: 2,
          businessSiteId: 'GS02',
          status: Status.APPROVED,
          type: Type.DATA_VERIFICATION,
          creationDate: '2024-01-10',
          aggregateField: AGGREGATE_FIELDS.BASE_DATA_ADDRESS_DISTRICT
        }
      ];

      service.setAddressVerificationTasks(tasks);
      service.isAddressOpenVerificationTaskByAggregateField(AGGREGATE_FIELDS.BASE_DATA_ADDRESS_NUMBER).subscribe(hasOpenTask => {
        expect(hasOpenTask).toBeFalsy();
        done();
      });
    });
  })

  describe('additional address verification tasks', () => {
    it('should set and get additional address verification tasks (true) when the task is open', done => {
      const tasks: Task[] = [
        {
          taskId: 1,
          businessSiteId: 'GS01',
          status: Status.OPEN,
          type: Type.DATA_VERIFICATION,
          creationDate: '2024-01-09',
          aggregateField: AGGREGATE_FIELDS.BASE_DATA_ADDITIONAL_ADDRESS_CITY
        }
      ];

      service.setAdditionalAddressVerificationTasks(tasks);
      service.isAdditionalAddressOpenVerificationTaskByAggregateField(AGGREGATE_FIELDS.BASE_DATA_ADDITIONAL_ADDRESS_CITY).subscribe(hasOpenTask => {
        expect(hasOpenTask).toBeTruthy();
        done();
      });
    });

    it('should set and get additional address verification tasks (false) when the task is closed', done => {
      const tasks: Task[] = [
        {
          taskId: 2,
          businessSiteId: 'GS02',
          status: Status.APPROVED,
          type: Type.DATA_VERIFICATION,
          creationDate: '2024-01-10',
          aggregateField: AGGREGATE_FIELDS.BASE_DATA_ADDITIONAL_ADDRESS_ZIP_CODE
        }
      ];

      service.setAdditionalAddressVerificationTasks(tasks);
      service.isAdditionalAddressOpenVerificationTaskByAggregateField(AGGREGATE_FIELDS.BASE_DATA_ADDITIONAL_ADDRESS_ZIP_CODE).subscribe(hasOpenTask => {
        expect(hasOpenTask).toBeFalsy();
        done();
      });
    });
  })

  describe('po box verification tasks', () => {
    it('should set and get po box verification tasks (true) when the task is open', done => {
      const tasks: Task[] = [
        {
          taskId: 1,
          businessSiteId: 'GS01',
          status: Status.OPEN,
          type: Type.DATA_VERIFICATION,
          creationDate: '2024-01-09',
          aggregateField: AGGREGATE_FIELDS.BASE_DATA_PO_BOX_NUMBER
        }
      ];

      service.setPoBoxVerificationTasks(tasks);
      service.isPoBoxOpenVerificationTaskByAggregateField(AGGREGATE_FIELDS.BASE_DATA_PO_BOX_NUMBER).subscribe(hasOpenTask => {
        expect(hasOpenTask).toBeTruthy();
        done();
      });
    });

    it('should set and get po box verification tasks (false) when the task is closed', done => {
      const tasks: Task[] = [
        {
          taskId: 2,
          businessSiteId: 'GS02',
          status: Status.APPROVED,
          type: Type.DATA_VERIFICATION,
          creationDate: '2024-01-10',
          aggregateField: AGGREGATE_FIELDS.BASE_DATA_PO_BOX_ZIP_CODE
        }
      ];

      service.setPoBoxVerificationTasks(tasks);
      service.isPoBoxOpenVerificationTaskByAggregateField(AGGREGATE_FIELDS.BASE_DATA_PO_BOX_ZIP_CODE).subscribe(hasOpenTask => {
        expect(hasOpenTask).toBeFalsy();
        done();
      });
    });
  })

  describe('gps verification tasks', () => {
    it('should set and get gps verification tasks (true) when the task is open', done => {
      const tasks: Task[] = [
        {
          taskId: 1,
          businessSiteId: 'GS01',
          status: Status.OPEN,
          type: Type.DATA_VERIFICATION,
          creationDate: '2024-01-09',
          aggregateField: AGGREGATE_FIELDS.BASE_DATA_GPS_LONGITUDE
        }
      ];

      service.setGpsVerificationTasks(tasks);
      service.isGpsOpenVerificationTaskByAggregateField(AGGREGATE_FIELDS.BASE_DATA_GPS_LONGITUDE).subscribe(hasOpenTask => {
        expect(hasOpenTask).toBeTruthy();
        done();
      });
    });

    it('should set and get gps verification tasks (false) when the task is closed', done => {
      const tasks: Task[] = [
        {
          taskId: 2,
          businessSiteId: 'GS02',
          status: Status.APPROVED,
          type: Type.DATA_VERIFICATION,
          creationDate: '2024-01-10',
          aggregateField: AGGREGATE_FIELDS.BASE_DATA_GPS_LATITUDE
        }
      ];

      service.setGpsVerificationTasks(tasks);
      service.isGpsOpenVerificationTaskByAggregateField(AGGREGATE_FIELDS.BASE_DATA_GPS_LATITUDE).subscribe(hasOpenTask => {
        expect(hasOpenTask).toBeFalsy();
        done();
      });
    });
  })

  describe('all verification tasks', () => {
    it('should return true observable when the task is open', done => {
      const tasks: Task[] = [
        {
          taskId: 1,
          businessSiteId: 'GS01',
          status: Status.OPEN,
          type: Type.DATA_VERIFICATION,
          creationDate: '2024-01-09',
          aggregateField: AGGREGATE_FIELDS.BASE_DATA_GPS_LONGITUDE
        }
      ];

      service.setAllVerificationTasks(tasks);
      service.isOpenVerificationTaskByAggregateField(AGGREGATE_FIELDS.BASE_DATA_GPS_LONGITUDE).subscribe(hasOpenTask => {
        expect(hasOpenTask).toBeTruthy();
        done();
      });
    });

    it('should return true observable when the task is closed/not present', done => {
      const tasks: Task[] = [
        {
          taskId: 2,
          businessSiteId: 'GS02',
          status: Status.APPROVED,
          type: Type.DATA_VERIFICATION,
          creationDate: '2024-01-10',
          aggregateField: AGGREGATE_FIELDS.BASE_DATA_GPS_LATITUDE
        }
      ];

      service.setAllVerificationTasks(tasks);
      service.isOpenVerificationTaskByAggregateField(AGGREGATE_FIELDS.BASE_DATA_GPS_LATITUDE).subscribe(hasOpenTask => {
        expect(hasOpenTask).toBeFalsy();
        done();
      });
    });
  })

  describe('Edit Page', () => {
    it('should return true if from edit outlet', done => {
      service.setEditPage(true)

      service.getEditPage().subscribe(editPage => {
        expect(editPage).toBeTruthy();
        done();
      })
    })

    it('should return true if from create outlet', done => {
      service.setEditPage(false)

      service.getEditPage().subscribe(editPage => {
        expect(editPage).toBeFalsy();
        done();
      })
    })
  })
});
