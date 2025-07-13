import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { SortingService } from '../../../shared/services/sorting/sorting.service';
import { AppStoreModule } from '../../../store/app-store.module';
import { TestingModule } from '../../../testing/testing.module';
import { ObjectPosition } from '../../shared/position-control/position-control.model';

import { MasterServiceMock } from './master-service.mock';
import { MasterService } from './master-service.model';
import { MasterServiceModule } from './master-service.module';
import { MasterServiceService } from './master-service.service';
import { MasterServiceCollectionService } from './store/master-service-collection.service';
import { MasterServiceDataService } from './store/master-service-data.service';

describe('MasterServiceService', () => {
  const serviceMock = MasterServiceMock.asList();
  let service: MasterServiceService;

  let sortingServiceSpy: Spy<SortingService>;
  let serviceCollectionService: MasterServiceCollectionService;
  let serviceDataService: MasterServiceDataService;

  beforeEach(() => {
    sortingServiceSpy = createSpyFromClass(SortingService);

    TestBed.configureTestingModule({
      imports: [TestingModule, MasterServiceModule, AppStoreModule],
      providers: [
        MasterServiceService,
        ApiService,
        LoggingService,
        MasterServiceCollectionService,
        MasterServiceDataService,
        { provide: SortingService, useValue: sortingServiceSpy }
      ]
    });

    serviceCollectionService = TestBed.inject(MasterServiceCollectionService);
    serviceDataService = TestBed.inject(MasterServiceDataService);
    service = TestBed.inject(MasterServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should get all services', done => {
      service.getAll().subscribe(result => {
        expect(result.length).toEqual(serviceMock.length);
        done();
      });
    });
  });

  describe('getBy()', () => {
    it('should get service', done => {
      const expected = serviceMock[0];

      service.getBy(1).subscribe(serviceVariant => {
        expect(serviceVariant).toEqual(expected);
        done();
      });
    });
  });

  describe('create()', () => {
    it('should call MasterServiceCollectionService.add', () => {
      const masterService: MasterService = {
        name: 'After-sales',
        active: true,
        id: 10,
        position: 10,
        openingHoursSupport: false,
        description: 'new description'
      };
      service.create(masterService).subscribe(result => {
        expect(result.id).toEqual(masterService.id);
        expect(result.name).toEqual(masterService.name);

        expect(serviceCollectionService.add).toHaveBeenCalledWith(masterService);
      });
    });
  });

  describe('delete()', () => {
    it('should call MasterServiceCollectionService.delete', () => {
      service.delete(1).subscribe(() => {
        expect(serviceCollectionService.delete).toHaveBeenCalled();
      });
    });
  });

  describe('update()', () => {
    it('should call MasterServiceCollectionService.update', () => {
      const masterService: MasterService = serviceMock[0];
      masterService.name = 'updatedValue';

      service.update(masterService).subscribe(result => {
        expect(result.name).toEqual(masterService.name);

        expect(serviceCollectionService.update).toHaveBeenCalledWith(masterService);
      });
    });
  });

  describe('updatePosition()', () => {
    it('should call MasterServiceDataService.updatePosition', () => {
      const position: ObjectPosition = {
        id: '1',
        afterId: '120'
      };
      service.updatePosition(position).subscribe(result => {
        expect(serviceDataService.updatePosition).toHaveBeenCalledWith(position);
      });
    });
  });
});
