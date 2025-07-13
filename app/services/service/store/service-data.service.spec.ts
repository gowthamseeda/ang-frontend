import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { TestingModule } from '../../../testing/testing.module';
import { ServiceMock } from '../models/service.mock';

import { ServiceDataService } from './service-data.service';

describe('Service Data Service', () => {
  let service: ServiceDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ServiceDataService, ApiService, LoggingService]
    });

    service = TestBed.inject(ServiceDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    const servicesMock = ServiceMock.forContracts();

    it('should get all services from the services contract', done => {
      service.getAll().subscribe(services => {
        expect(services).toContainEqual(servicesMock[0]);
        expect(services).toContainEqual(servicesMock[1]);
        done();
      });
    });
  });
});
