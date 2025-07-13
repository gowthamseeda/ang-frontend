import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../../shared/services/api/api.service';
import { ServiceVariantMock } from '../service-variant.mock';

import { ServiceVariantDataService } from './service-variant-data.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { TestingModule } from '../../../testing/testing.module';

describe('Service Variant Data Service', () => {
  let service: ServiceVariantDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ServiceVariantDataService, ApiService, LoggingService]
    });

    service = TestBed.inject(ServiceVariantDataService);
  });

  it('should be created', () => {
    const dataService: ServiceVariantDataService = TestBed.inject(ServiceVariantDataService);
    expect(dataService).toBeTruthy();
  });

  describe('getAllForStructureBy()', () => {
    const serviceVariantsMock = ServiceVariantMock.forContracts();

    it('should get all service variants from the contracts', done => {
      service.getAllForStructureBy('DE').subscribe(serviceVariants => {
        expect(serviceVariants).toEqual(serviceVariantsMock);
        done();
      });
    });
  });
});
