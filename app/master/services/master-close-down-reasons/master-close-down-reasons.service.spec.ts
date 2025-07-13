import { TestBed } from '@angular/core/testing';
import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { TestingModule } from '../../../testing/testing.module';
import {
  getMasterCloseDownReasonSingleMock,
  getMasterCloseDownReasonsMock
} from './master-close-down-reasons.mock';
import { MasterCloseDownReasonsService } from './master-close-down-reasons.service';

describe('MasterCloseDownReasonsService', () => {
  const closeDownReasonsMock = getMasterCloseDownReasonsMock();
  const closeDownReasonSingleMock = getMasterCloseDownReasonSingleMock();

  let service: MasterCloseDownReasonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [MasterCloseDownReasonsService, ApiService, LoggingService]
    });

    service = TestBed.inject(MasterCloseDownReasonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should get all new close down reasons', done => {
      service.getAll().subscribe(closeDownReasons => {
        expect(closeDownReasons).toEqual(closeDownReasonsMock);
        done();
      });
    });
  });

  describe('get()', () => {
    it('should get specific close down reason from the service contract', done => {
      service.get('2').subscribe(closeDownReason => {
        expect(closeDownReason).toEqual(closeDownReasonSingleMock[0]);
        done();
      });
    });
  });

  describe('create()', () => {
    it('should create close down reason from the service contract', done => {
      service.create(closeDownReasonsMock[2]).subscribe(result => {
        expect(result.status).toEqual('CREATED');
        done();
      });
    });
  });

  describe('update()', () => {
    it('should update close down reason from the service contract', done => {
      service.update('1', closeDownReasonsMock[0]).subscribe(result => {
        expect(result.status).toEqual('UPDATED');
        done();
      });
    });
  });

  describe('delete()', () => {
    it('should delete close down reason from the service contract', done => {
      service.delete('3').subscribe(result => {
        expect(result.status).toEqual('DELETED');
        done();
      });
    });
  });
});
