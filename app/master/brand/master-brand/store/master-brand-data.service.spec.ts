import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../../../shared/services/api/api.service';
import { LoggingService } from '../../../../shared/services/logging/logging.service';
import { AppStoreModule } from '../../../../store/app-store.module';
import { TestingModule } from '../../../../testing/testing.module';
import { ObjectPosition } from '../../../shared/position-control/position-control.model';
import { MasterBrandMock } from '../master-brand.mock';
import { MasterBrand } from '../master-brand.model';
import { MasterBrandModule } from '../master-brand.module';

import { MasterBrandDataService } from './master-brand-data.service';

describe('MasterBrandDataService', () => {
  const brandMock = MasterBrandMock.asList();
  let service: MasterBrandDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, MasterBrandModule, AppStoreModule],
      providers: [MasterBrandDataService, ApiService, LoggingService]
    });

    service = TestBed.inject(MasterBrandDataService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should get all brands from the services contract', done => {
      service.getAll().subscribe(brand => {
        expect(brand).toEqual(brandMock);
        done();
      });
    });
  });

  describe('getById()', () => {
    it('should get specific brand from the services contract', done => {
      service.getById('MB').subscribe(brand => {
        expect(brand).toEqual(brandMock[0]);
        done();
      });
    });
  });

  describe('add()', () => {
    it('should create brand from the services contract', done => {
      const brand: MasterBrand = {
        id: 'SMT',
        name: 'smart'
      };
      service.add(brand).subscribe(result => {
        expect(result.status).toEqual('CREATED');
        done();
      });
    });
  });

  describe('update()', () => {
    it('should update brand from the services contract', done => {
      service.update(brandMock[0]).subscribe(result => {
        expect(result.status).toEqual('UPDATED');
        done();
      });
    });
  });

  describe('updatePosition()', () => {
    it('should update brand position from the services contract', done => {
      const position: ObjectPosition = {
        id: 'FTL',
        afterId: 'MB'
      };
      service.updatePosition(position).subscribe(result => {
        expect(result.status).toEqual('UPDATED');
        done();
      });
    });
  });

  describe('delete()', () => {
    it('should delete brand from the services contract', done => {
      service.delete('MB').subscribe(result => {
        expect(result.status).toEqual('DELETED');
        done();
      });
    });
  });
});
