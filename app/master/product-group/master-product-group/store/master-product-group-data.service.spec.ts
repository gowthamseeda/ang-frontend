import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../../../shared/services/api/api.service';
import { LoggingService } from '../../../../shared/services/logging/logging.service';
import { AppStoreModule } from '../../../../store/app-store.module';
import { TestingModule } from '../../../../testing/testing.module';
import { MasterProductGroupMock } from '../master-product-group.mock';
import { MasterProductGroup } from '../master-product-group.model';
import { MasterProductGroupModule } from '../master-product-group.module';

import { MasterProductGroupDataService } from './master-product-group-data.service';

describe('MasterProductGroupDataService', () => {
  const productGroupMock = MasterProductGroupMock.asList();
  let service: MasterProductGroupDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, MasterProductGroupModule, AppStoreModule],
      providers: [MasterProductGroupDataService, ApiService, LoggingService]
    });

    service = TestBed.inject(MasterProductGroupDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should get all product groups from the services contract', done => {
      service.getAll().subscribe(productGroup => {
        expect(productGroup).toEqual(productGroupMock);
        done();
      });
    });
  });

  describe('getById()', () => {
    it('should get specific product-group from the services contract', done => {
      service.getById('PC').subscribe(productGroup => {
        expect(productGroup).toEqual(productGroupMock[0]);
        done();
      });
    });
  });

  describe('add()', () => {
    it('should create product-group from the services contract', done => {
      const addProductGroup: MasterProductGroup = {
        id: 'TRUCK',
        name: 'truck',
        position: '0',
        shortName: 'truck'
      };
      service.add(addProductGroup).subscribe(result => {
        expect(result.status).toEqual('CREATED');
        done();
      });
    });
  });

  describe('update()', () => {
    it('should update product-group from the services contract', done => {
      service.update(productGroupMock[0]).subscribe(result => {
        expect(result.status).toEqual('UPDATED');
        done();
      });
    });
  });

  describe('delete()', () => {
    it('should delete product-group from the services contract', done => {
      service.delete('PC').subscribe(result => {
        expect(result.status).toEqual('DELETED');
        done();
      });
    });
  });
});
