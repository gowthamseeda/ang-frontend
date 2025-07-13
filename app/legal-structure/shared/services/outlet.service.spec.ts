import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of, throwError } from 'rxjs';

import { UpdateMoveOutlet } from '../../../admin/move-outlet/service/api/actions.model';
import { ConstraintType } from '../../../admin/shared/models/outlet.model';
import {
  getFailedSwitchRoResponse,
  getSuccessSwitchRoResponse
} from '../../../admin/shared/service/api/admin-response.mock';
import { GenericAdminOutletResponse } from '../../../admin/shared/service/api/admin-response.model';
import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { TestingModule } from '../../../testing/testing.module';
import { DistributionLevelsService } from '../../../traits/distribution-levels/distribution-levels.service';
import { getLocationMock } from '../../location/models/location.mock';
import { LocationApiService } from '../../location/services/location-api.service';
import {
  autoLangMock,
  getOutletMockForCreate,
  getOutletWithGpsMock,
  getOutletWithoutGpsMock
} from '../models/outlet.mock';

import { OutletService } from './outlet.service';

const companyId = 'GC00000001';
const outletMock = autoLangMock;
const locationMock = getLocationMock();
const outletCreateMock = getOutletMockForCreate();
const outletWithoutGpsMock = getOutletWithoutGpsMock();
const outletWithGpsMock = getOutletWithGpsMock();

describe('OutletService', () => {
  let service: OutletService;
  let geocodeServiceSpy: Spy<LocationApiService>;
  let distributionLevelsServiceSpy: Spy<DistributionLevelsService>;
  let apiServiceSpy: Spy<ApiService>

  beforeEach(() => {
    geocodeServiceSpy = createSpyFromClass(LocationApiService);
    distributionLevelsServiceSpy = createSpyFromClass(DistributionLevelsService);
    apiServiceSpy = createSpyFromClass(ApiService);
    apiServiceSpy.get.nextWith(outletMock)
    apiServiceSpy.post.nextWith({ id: 'GS00000004', status: 'CREATED' })
    apiServiceSpy.put.nextWith({ id: 'GS00000004', status: 'CREATED' })

    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        ApiService,
        LoggingService,
        OutletService,
        { provide: LocationApiService, useValue: geocodeServiceSpy },
        { provide: DistributionLevelsService, useValue: distributionLevelsServiceSpy },
        { provide: ApiService, useValue: apiServiceSpy },
      ]
    });

    service = TestBed.inject(OutletService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('getOrLoadBusinessSite()', () => {
    it('should get an outlet from the legal structure contract', done => {
      service.getOrLoadBusinessSite(outletMock.id).subscribe(outlet => {
        expect(outlet).toEqual(outletMock);
        done();
      });
    });
  });

  describe('update()', () => {
    it('should update the given outlet', done => {
      const apiService = TestBed.inject(ApiService);
      jest.spyOn(apiService, 'put').mockReturnValue(of({ id: 'ID', status: 'STATUS' }));

      service.update('GC001', 'GS001', outletMock).subscribe(() => {
        expect(apiService.put).toHaveBeenCalledWith(
          '/legal-structure/api/v1/companies/GC001/business-sites/GS001',
          outletMock
        );
        done();
      });
    });

    it('should also reset the cache for the given outlet', done => {
      const apiService = TestBed.inject(ApiService);
      jest.spyOn(apiService, 'put').mockReturnValue(of({ id: "ID", status: "STATUS" }));
      jest.spyOn(service, 'clearBusinessSite');

      service.update('GC001', 'GS001', outletMock).subscribe(() => {
        expect(service.clearBusinessSite).toHaveBeenCalledWith('GS001');
        done();
      });
    });
  });

  describe('create()', () => {
    it('should create an outlet against the legal structure contract', done => {
      service.create(companyId, outletCreateMock).subscribe(id => {
        expect(id).toEqual('GS00000004');
        done();
      });
    });
  });

  describe('createWithGps()', () => {
    beforeEach(() => {
      jest.spyOn(service, 'create').mockReturnValue(of(outletWithoutGpsMock.id));
    });

    it('should create an outlet with GPS when coordinates can be resolved', done => {
      geocodeServiceSpy.getLocationForAddress.nextWith({
        ...locationMock,
        gps: { latitude: '6', longitude: '9' }
      });

      service.createWithGps(companyId, outletWithoutGpsMock).subscribe(id => {
        expect(id).toEqual(outletWithoutGpsMock.id);
        done();
      });

      expect(service.create).toHaveBeenCalledWith(companyId, outletWithGpsMock);
    });

    it('should create a company without GPS when coordinates cannot be resolved', done => {
      geocodeServiceSpy.getLocationForAddress.throwWith('error');

      service.createWithGps(companyId, outletWithoutGpsMock).subscribe(id => {
        expect(id).toEqual(outletWithoutGpsMock.id);
        done();
      });

      expect(service.create).toHaveBeenCalledWith(companyId, outletWithoutGpsMock);
    });

    it('should create an outlet with state and province', done => {
      geocodeServiceSpy.getLocationForAddress.nextWith({
        ...locationMock,
        gps: { latitude: '6', longitude: '9' }
      });
      service.createWithGps(companyId, outletWithoutGpsMock).subscribe(() => {
        done();
      });

      expect(service.create).toHaveBeenCalledWith(companyId, outletWithGpsMock);
    });

    it('should create an outlet with state only', done => {
      geocodeServiceSpy.getLocationForAddress.nextWith({
        ...locationMock,
        gps: { latitude: '6', longitude: '9' },
        region: {
          state: 'region 2'
        }
      });
      service.createWithGps(companyId, outletWithoutGpsMock).subscribe(() => {
        done();
      });

      expect(service.create).toHaveBeenCalledWith(companyId, {
        ...outletWithGpsMock,
        ...{
          state: 'region 2',
          province: undefined
        }
      });
    });

    it('should create an outlet without state and province if undefined', done => {
      geocodeServiceSpy.getLocationForAddress.nextWith({
        ...locationMock,
        gps: { latitude: '6', longitude: '9' },
        region: undefined
      });
      service.createWithGps(companyId, outletWithoutGpsMock).subscribe(() => {
        done();
      });

      expect(service.create).toHaveBeenCalledWith(companyId, {
        ...outletWithGpsMock,
        ...{
          state: undefined,
          province: undefined
        }
      });
    });
  });

  describe('createWithDistributionLevels()', () => {
    beforeEach(() => {
      geocodeServiceSpy.getLocationForAddress.throwWith('error');
    });

    it('should return the ID of the outlet', done => {
      distributionLevelsServiceSpy.update.nextWith('success');
      jest.spyOn(service, 'createWithGps').mockReturnValue(of(outletMock.id));

      service
        .createWithDistributionLevels(outletMock.companyId, outletCreateMock, ['RETAILER'])
        .subscribe(id => {
          expect(id).toEqual(outletMock.id);
          done();
        });
    });

    it('should return an appropriate error when the outlet was created but the distribution levels failed', done => {
      distributionLevelsServiceSpy.update.throwWith('error');
      jest.spyOn(service, 'createWithGps').mockReturnValue(of(outletMock.id));

      service
        .createWithDistributionLevels(outletMock.companyId, outletCreateMock, ['RETAILER'])
        .subscribe(
          () => { },
          error => {
            expect(error).toEqual({
              message: 'CREATE_OUTLET_FAILED_DISTRIBUTIONS',
              createdOutletId: outletMock.id
            });
            done();
          }
        );
    });

    it('should still return the error caused by a failing create outlet)', done => {
      distributionLevelsServiceSpy.update.nextWith('error');
      jest.spyOn(service, 'createWithGps').mockReturnValue(throwError('error'));

      service
        .createWithDistributionLevels(outletMock.companyId, outletCreateMock, ['RETAILER'])
        .subscribe(
          () => { },
          error => {
            expect(error).toEqual('error');
            done();
          }
        );
    });
  });

  describe('isLegalNameEditable()', () => {
    it('should return true, when the countryId is CH', () => {
      expect(service.isLegalNameEditableInCountry('CH')).toBeTruthy();
    });

    it('should return false, when the countryId is not CH', () => {
      expect(service.isLegalNameEditableInCountry('DE')).toBeFalsy();
    });
  });

  describe('switchRegisteredOffice', () => {
    it('should return status true for switch registered office', done => {
      const switchRoMock = getSuccessSwitchRoResponse();

      apiServiceSpy.patchCustom.nextWith(switchRoMock)

      service
        .switchRegisteredOffice('GC80000008', 'GS80000009')
        .subscribe((response: GenericAdminOutletResponse) => {
          expect(response.status).toBeTruthy();
          expect(response.preconditions).toBeFalsy();
          expect(response.status).toBe(switchRoMock.status);
          done();
        });
    });

    it('should return status false for switch registered office', done => {
      const switchRoMock = getFailedSwitchRoResponse();

      apiServiceSpy.patchCustom.nextWith(switchRoMock)

      service
        .switchRegisteredOffice('GC00000017', 'GS00000017')
        .subscribe((response: GenericAdminOutletResponse) => {
          expect(response.status).toBeFalsy();
          expect(response.preconditions).toBeTruthy();
          expect(response.status).toBe(switchRoMock.status);
          expect(response.preconditions).toStrictEqual(switchRoMock.preconditions);
          done();
        });
    });
  });

  describe('moveOutlet', () => {
    it('should return status true for move outlet', done => {
      apiServiceSpy.patchCustom.nextWith({ id: '1', status: true })

      const updateResource: UpdateMoveOutlet = {
        companyId: 'GC55500008'
      };

      service
        .moveOutlet('GS50000009', updateResource)
        .subscribe((response: GenericAdminOutletResponse) => {
          expect(response.status).toBeTruthy();
          expect(response.preconditions).toBeFalsy();
          done();
        });
    });

    it('should return status false for move outlet', done => {
      const responseMock: GenericAdminOutletResponse = {
        status: false,
        preconditions: [
          {
            type: ConstraintType[ConstraintType.OUTLETSTRUCTURE] as unknown as ConstraintType,
            ids: ['GS50000009'],
            messages: ['Main/Sub Outlets constraint found: [GS50000009].']
          },
          {
            type: ConstraintType[ConstraintType.TASK] as unknown as ConstraintType,
            ids: ['1', '2'],
            messages: ['Tasks constraint found: [1, 2].']
          }
        ],
        id: 'GS20000001',
        businessSiteId: 'GS20000001',
        companyId: 'GC80000008'
      };
      const updateResource: UpdateMoveOutlet = {
        companyId: 'GC80000008'
      };

      apiServiceSpy.patchCustom.nextWith(responseMock)

      service
        .moveOutlet('GS20000001', updateResource)
        .subscribe((response: GenericAdminOutletResponse) => {
          expect(response.preconditions).toBeTruthy();
          expect(response.status).toBe(responseMock.status);
          expect(response.preconditions).toStrictEqual(responseMock.preconditions);
          done();
        });
    });
  });
});
