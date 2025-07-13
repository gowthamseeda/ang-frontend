import { TestBed } from '@angular/core/testing';

import { TestingModule } from '../../testing/testing.module';
import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import {
  getAllCloseDownReasonsForBusinessSiteMock,
  getAllCloseDownReasonsForCompanyMock,
  getAllCloseDownReasonsMock
} from './close-down-reasons.mock';
import { CloseDownReasonsService } from './close-down-reasons.service';

describe('CloseDownReasonsService', () => {
  const allCloseDownReasons = getAllCloseDownReasonsMock();
  const allCloseDownReasons4Company = getAllCloseDownReasonsForCompanyMock();
  const allCloseDownReasons4BusinessSite = getAllCloseDownReasonsForBusinessSiteMock();

  let service: CloseDownReasonsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [CloseDownReasonsService, ApiService, LoggingService]
    });

    service = TestBed.inject(CloseDownReasonsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should get all close down reasons', done => {
      service.getAll().subscribe(closeDownReasons => {
        expect(closeDownReasons).toEqual(allCloseDownReasons);
        done();
      });
    });
  });

  describe('getAll4Company()', () => {
    it('should get all close down reasons valid for a company', done => {
      service.getAllValidForCompany().subscribe(closeDownReason => {
        expect(closeDownReason).toEqual(allCloseDownReasons4Company);
        done();
      });
    });
  });

  describe('getAll4BusinessSite()', () => {
    it('should get all close down reasons valid for a business site', done => {
      service.getAllValidForBusinessSite().subscribe(closeDownReason => {
        expect(closeDownReason).toEqual(allCloseDownReasons4BusinessSite);
        done();
      });
    });
  });
});
