import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../../../shared/services/api/api.service';
import { LoggingService } from '../../../../shared/services/logging/logging.service';
import { AppStoreModule } from '../../../../store/app-store.module';
import { TestingModule } from '../../../../testing/testing.module';

import { MasterServiceVariantMock } from './master-service-variant.mock';
import { MasterServiceVariant, MasterServiceVariantUpdate } from './master-service-variant.model';
import { MasterServiceVariantModule } from './master-service-variant.module';
import { MasterServiceVariantService } from './master-service-variant.service';
import { MasterServiceVariantCollectionService } from './store/master-service-variant-collection.service';
import { MasterServiceVariantDataService } from './store/master-service-variant-data.service';

describe('MasterServiceVariantService', () => {
  const serviceVariantMock = MasterServiceVariantMock.asList();
  let service: MasterServiceVariantService;
  let serviceVariantDataService: MasterServiceVariantDataService;

  let serviceVariantCollectionService: MasterServiceVariantCollectionService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, MasterServiceVariantModule, AppStoreModule],
      providers: [
        MasterServiceVariantService,
        MasterServiceVariantDataService,
        ApiService,
        LoggingService,
        MasterServiceVariantCollectionService
      ]
    });

    service = TestBed.inject(MasterServiceVariantService);
    serviceVariantDataService = TestBed.inject(MasterServiceVariantDataService);
    serviceVariantCollectionService = TestBed.inject(MasterServiceVariantCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchAll()', () => {
    it('should fetch all service variants', done => {
      const spy = spyOn(serviceVariantCollectionService, 'getAll');

      service.fetchAll();
      expect(spy).toBeCalled();
      done();
    });
  });

  describe('getAll()', () => {
    it('should get all service variants', done => {
      service.getAll().subscribe(serviceVariants => {
        expect(serviceVariants).toEqual(serviceVariantMock);
        done();
      });
    });
  });

  describe('getBy()', () => {
    it('should get service variant', done => {
      const expected = serviceVariantMock[0];

      service.getBy(1).subscribe(serviceVariant => {
        expect(serviceVariant).toEqual(expected);
        done();
      });
    });
  });

  /*const isLoadingSelector: MemoizedSelector<object, boolean> = createSelector(
    () => false // Return value for the selector
  );*/

  describe('isLoading()', () => {
    it('should return false when is not loaded yet', done => {
      spyOn(serviceVariantCollectionService, 'isLoading').and.returnValue(() => false);
      //jest.spyOn(serviceVariantCollectionService, 'isLoading').mockReturnValue(false);
      service.isLoading().subscribe(isLoading => {
        expect(isLoading).toBeFalsy();
        done();
      });
    });

    it('should return true when is isLoading', done => {
      spyOn(serviceVariantCollectionService, 'isLoading').and.returnValue(() => true);

      service.isLoading().subscribe(isLoading => {
        expect(isLoading).toBeTruthy();
        done();
      });
    });
  });

  describe('update()', () => {
    it('should call masterServiceVariantDataService.update', done => {
      const serviceVariants: MasterServiceVariantUpdate[] = [
        serviceVariantMock[0],
        serviceVariantMock[1]
      ];

      service.createOrUpdate(serviceVariants).subscribe(() => {
        expect(serviceVariantDataService.multiCreateOrUpdate).toHaveBeenCalledWith(serviceVariants);
      });
      done();
    });
  });

  describe('delete()', () => {
    it('should call masterServiceVariantDataService.delete', done => {
      const serviceVariants: MasterServiceVariant[] = [
        serviceVariantMock[0],
        serviceVariantMock[1]
      ];

      service.delete(serviceVariants).subscribe(() => {
        expect(serviceVariantDataService.multiDelete).toHaveBeenCalledWith(serviceVariants);
      });
      done();
    });
  });

  describe('clearCacheAndFetchAll()', () => {
    it('should call to clear cache and fetch all', done => {
      const clearCacheSpy = spyOn(serviceVariantCollectionService, 'clearCache');
      const fetchAllSpy = spyOn(service, 'fetchAll');

      service.clearCacheAndFetchAll();
      expect(clearCacheSpy).toHaveBeenCalled();
      expect(fetchAllSpy).toHaveBeenCalled();
      done();
    });
  });
});
