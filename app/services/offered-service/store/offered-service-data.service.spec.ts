import { TestBed } from '@angular/core/testing';
import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { TestingModule } from '../../../testing/testing.module';
import { OfferedServiceMock } from '../offered-service.mock';
import { OfferedServiceDataService } from './offered-service-data.service';

describe('OfferedServiceDataService', () => {
  let service: OfferedServiceDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [OfferedServiceDataService, ApiService, LoggingService]
    });

    service = TestBed.inject(OfferedServiceDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get()', () => {
    it('should get offered services from the services contracts', done => {
      const outletId = 'GS00000001';
      service.get(outletId).subscribe(response => {
        expect(response).toEqual(OfferedServiceMock.forContracts());
        done();
      });
    });
  });
});
