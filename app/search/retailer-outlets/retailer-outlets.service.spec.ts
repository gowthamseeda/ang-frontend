import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { TestingModule } from '../../testing/testing.module';

import {
  getAutoLangRetailerOutletMock,
  getDaimlerTSSRetailerOutletMock
} from './retailer-outlets.mock';
import { RetailerOutletsService } from './retailer-outlets.service';

describe('RetailerOutletsService', () => {
  let service: RetailerOutletsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [RetailerOutletsService, ApiService, LoggingService]
    });
    service = TestBed.inject(RetailerOutletsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should get all retailer outlets from the search contract', done => {
      const expectedRetailerOutlets = [
        getAutoLangRetailerOutletMock(),
        getDaimlerTSSRetailerOutletMock()
      ];

      service.getAll().subscribe(retailerOutlets => {
        expect(retailerOutlets.searchItems).toEqual(expectedRetailerOutlets);
        done();
      });
    });
  });
});
