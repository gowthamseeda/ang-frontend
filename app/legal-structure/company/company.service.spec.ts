import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of, throwError } from 'rxjs';

import { getRegionMappingMock } from '../../geography/regionmapping/regionmapping.mock';
import { RegionMappingService } from '../../geography/regionmapping/regionmapping.service';
import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { TestingModule } from '../../testing/testing.module';
import { DistributionLevelsService } from '../../traits/distribution-levels/distribution-levels.service';
import { LocationApiService } from '../location/services/location-api.service';

import { getCompanyMock_GC00000001, getCompanyMock_GC00000004 } from './company.mock';
import { CompanyService } from './company.service';

describe('CompanyService', () => {
  let service: CompanyService;
  let geocodeServiceSpy: Spy<LocationApiService>;
  let regionMappingServiceSpy: Spy<RegionMappingService>;
  let distributionLevelsServiceSpy: Spy<DistributionLevelsService>;

  let companyMock: any;
  let companyMock_GC00000004: any;

  beforeEach(() => {
    companyMock = getCompanyMock_GC00000001();
    companyMock_GC00000004 = getCompanyMock_GC00000004();
    geocodeServiceSpy = createSpyFromClass(LocationApiService);
    regionMappingServiceSpy = createSpyFromClass(RegionMappingService);
    regionMappingServiceSpy.get.nextWith(getRegionMappingMock());
    distributionLevelsServiceSpy = createSpyFromClass(DistributionLevelsService);

    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ApiService,
        LoggingService,
        CompanyService,
        { provide: LocationApiService, useValue: geocodeServiceSpy },
        { provide: RegionMappingService, useValue: regionMappingServiceSpy },
        { provide: DistributionLevelsService, useValue: distributionLevelsServiceSpy }
      ]
    });

    service = TestBed.inject(CompanyService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('get()', () => {
    it('should get a company from the legal structure contract', done => {
      service.get(companyMock.id).subscribe(company => {
        expect(company).toEqual(companyMock);
        done();
      });
    });
  });

  describe('create()', () => {
    it('should create a company against the legal structure contract', done => {
      service.create(companyMock_GC00000004).subscribe(id => {
        expect(id).toEqual(companyMock_GC00000004.id);
        done();
      });
    });
  });

  describe('createWithDistributionLevels()', () => {
    beforeEach(() => {});

    it('should return the ID of the registered office created with the company when following the happy path', done => {
      distributionLevelsServiceSpy.update.nextWith('success');
      jest
        .spyOn(service, 'createAndGetRegisteredOfficeId')
        .mockReturnValue(of(companyMock.registeredOfficeId));

      service.createWithDistributionLevels(companyMock, ['RETAILER']).subscribe(id => {
        expect(id).toEqual(companyMock.registeredOfficeId);
        done();
      });
    });

    it('should return an appropriate error when the company was created but the distribution levels failed', done => {
      distributionLevelsServiceSpy.update.throwWith('error');
      jest
        .spyOn(service, 'createAndGetRegisteredOfficeId')
        .mockReturnValue(of(companyMock.registeredOfficeId));

      service.createWithDistributionLevels(companyMock, ['RETAILER']).subscribe(
        () => {},
        error => {
          expect(error).toEqual({
            message: 'CREATE_COMPANY_FAILED_DISTRIBUTIONS',
            createdRegisteredOfficeId: companyMock.registeredOfficeId
          });
          done();
        }
      );
    });

    it('should still return the error caused by a failing create company)', done => {
      distributionLevelsServiceSpy.update.throwWith('error');
      jest.spyOn(service, 'createAndGetRegisteredOfficeId').mockReturnValue(throwError('error'));

      service.createWithDistributionLevels(companyMock, ['RETAILER']).subscribe(
        () => {},
        error => {
          expect(error).toEqual('error');
          done();
        }
      );
    });
  });

  describe('update()', () => {
    it('should update a company from the legal structure contract', done => {
      let updated = false;

      service.update('GC00000002', companyMock).subscribe(() => {
        updated = true;
        done();
      });

      expect(updated).toBeTruthy();
    });
  });
});
