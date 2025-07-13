import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../../../shared/services/api/api.service';
import { LoggingService } from '../../../../shared/services/logging/logging.service';
import { AppStoreModule } from '../../../../store/app-store.module';
import { TestingModule } from '../../../../testing/testing.module';
import { ObjectPosition } from '../../../shared/position-control/position-control.model';
import { MasterServiceMock } from '../master-service.mock';
import { MasterService } from '../master-service.model';
import { MasterServiceModule } from '../master-service.module';

import { MasterServiceDataService } from './master-service-data.service';

describe('MasterServiceDataService', () => {
  const serviceMock = MasterServiceMock.asList();
  let service: MasterServiceDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, MasterServiceModule, AppStoreModule],
      providers: [MasterServiceDataService, ApiService, LoggingService]
    });

    service = TestBed.inject(MasterServiceDataService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get()', () => {
    it('should get service based on id', done => {
      service.getById(serviceMock[2].id).subscribe(service => {
        expect(service.name).toEqual(serviceMock[2].name);
        expect(service.retailerVisibility).toBe(true);
        done();
      });
    });

    it('should get service based on id - retailerVisibility false', done => {
      service.getById(serviceMock[1].id).subscribe(service => {
        expect(service.name).toEqual(serviceMock[1].name);
        expect(service.retailerVisibility).toBe(false);
        done();
      });
    });
  });

  describe('getAll()', () => {
    it('should get all services from the services contract', done => {
      service.getAll().subscribe(services => {
        expect(services.length).toEqual(serviceMock.length);
        done();
      });
    });
  });

  describe('add()', () => {
    it('should create service from the services contract', done => {
      const masterService: MasterService = {
        name: 'after-sales',
        active: true,
        id: 10,
        position: 10,
        openingHoursSupport: false,
        description: 'description for after sales'
      };

      service.add(masterService).subscribe(result => {
        expect(result.status).toEqual('CREATED');
        done();
      });
    });
  });

  describe('updatePosition()', () => {
    it('should update service position from the services contract', done => {
      const position: ObjectPosition = {
        id: '1',
        afterId: '120'
      };
      service.updatePosition(position).subscribe(result => {
        expect(result.status).toEqual('UPDATED');
        done();
      });
    });
  });

  describe('update()', () => {
    it('should call MasterServiceCollectionService.update - update retailerVisibility - false', done => {
      const masterService = {
        id: 170,
        changes: {
          name: 'Sale Used Vehicles',
          translations: { 'de-DE': 'Gebrauchtwagenverkauf' },
          openingHoursSupport: true,
          retailerVisibility: false
        }
      };

      service.update(masterService).subscribe(result => {
        expect(result.status).toEqual('UPDATED');
        done();
      });
    });
  });
});
