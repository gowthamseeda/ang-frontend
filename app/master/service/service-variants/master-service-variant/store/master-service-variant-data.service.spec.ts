import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../../../../shared/services/api/api.service';
import { LoggingService } from '../../../../../shared/services/logging/logging.service';
import { AppStoreModule } from '../../../../../store/app-store.module';
import { TestingModule } from '../../../../../testing/testing.module';
import { ServiceVariantResponse } from '../../models/service-variant-configure.model';
import { MasterServiceVariantMock } from '../master-service-variant.mock';
import { MasterServiceVariantModule } from '../master-service-variant.module';

import { MasterServiceVariantDataService } from './master-service-variant-data.service';

describe('ServiceVariantDataService', () => {
  const serviceVariantMock = MasterServiceVariantMock.asList();
  let service: MasterServiceVariantDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, MasterServiceVariantModule, AppStoreModule],
      providers: [MasterServiceVariantDataService, ApiService, LoggingService]
    });

    service = TestBed.inject(MasterServiceVariantDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should get all service variants', done => {
      service.getAll().subscribe(serviceVariants => {
        expect(serviceVariants).toEqual(serviceVariantMock);
        done();
      });
    });
  });

  // Due to the limitation on custom build json contract test library in this project, it is not possible to differentiate Request Body
  // It is only possible to test based on different URL and assert the result (keeping things simple in a way)
  // Therefore, an alternative approach is to make use of queryParam to have different URL for different scenario test
  // Of course, this is not the ideal way, but it would take much more effort to refactor the existing library and perhaps its would be good to do when we have the capacity
  // Or maybe, there is a library that could help us to perform checks on the request body
  describe('multiCreateOrUpdate()', () => {
    it('when country Restrictions is empty', done => {
      service.queryParam = '?noCountryRestrictions';
      service.multiCreateOrUpdate(serviceVariantMock[0]).subscribe(result => {
        expect(result.status).toEqual('BAD_REQUEST');
        done();
      });
    });

    it('when wrong service Id is provided', done => {
      service.queryParam = '?wrongServiceId';
      service
        .multiCreateOrUpdate(serviceVariantMock[0])
        .subscribe((result: ServiceVariantResponse) => {
          expect(result.fail[0].serviceId).toEqual(170);
          expect(result.fail[0].message?.[0]).toEqual('no service variant found');
          done();
        });
    });

    // Somehow, if the API return NO_CONTENT, the result is null object, so not possible to assert the result.status
    it('when no request body', done => {
      service.queryParam = '?noContent';
      service.multiCreateOrUpdate(serviceVariantMock[0]).subscribe(result => {
        expect(result).toEqual(null);
        done();
      });
    });
  });
});
