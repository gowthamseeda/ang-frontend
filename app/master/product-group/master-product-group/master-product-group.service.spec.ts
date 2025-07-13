import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { SortingService } from '../../../shared/services/sorting/sorting.service';
import { AppStoreModule } from '../../../store/app-store.module';
import { TestingModule } from '../../../testing/testing.module';

import { MasterProductGroupMock } from './master-product-group.mock';
import { MasterProductGroup } from './master-product-group.model';
import { MasterProductGroupModule } from './master-product-group.module';
import { MasterProductGroupService } from './master-product-group.service';
import { MasterProductGroupCollectionService } from './store/master-product-group-collection.service';

describe('MasterProductGroupService', () => {
  const productGroupMock = MasterProductGroupMock.asList();
  let service: MasterProductGroupService;

  let sortingServiceSpy: Spy<SortingService>;
  let masterProductGroupCollectionService: MasterProductGroupCollectionService;

  beforeEach(() => {
    sortingServiceSpy = createSpyFromClass(SortingService);

    TestBed.configureTestingModule({
      imports: [TestingModule, MasterProductGroupModule, AppStoreModule],
      providers: [
        MasterProductGroupService,
        ApiService,
        LoggingService,
        MasterProductGroupCollectionService,
        { provide: SortingService, useValue: sortingServiceSpy }
      ]
    });

    masterProductGroupCollectionService = TestBed.inject(MasterProductGroupCollectionService);
    service = TestBed.inject(MasterProductGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should get all service variants', done => {
      service.getAll().subscribe(result => {
        expect(result).toEqual(productGroupMock);
        done();
      });
    });
  });

  describe('getBy()', () => {
    it('should get product group', done => {
      const expected = productGroupMock[0];

      service.getBy('PC').subscribe(productGroup => {
        expect(productGroup).toEqual(expected);
        done();
      });
    });
  });

  describe('fetchBy()', () => {
    it('should get service variant by Id', done => {
      service.fetchBy('PC').subscribe(result => {
        expect(result).toEqual(productGroupMock[0]);
        done();
      });
    });
  });

  describe('create()', () => {
    it('should call masterProductGroupCollectionService.add', () => {
      const productGroup: MasterProductGroup = {
        id: 'truck',
        shortName: 'TRUCK',
        position: '0',
        name: 'trucks'
      };
      service.create(productGroup).subscribe(result => {
        expect(result.id).toEqual(productGroup.id);
        expect(result.shortName).toEqual(productGroup.shortName);
        expect(result.name).toEqual(productGroup.name);

        expect(masterProductGroupCollectionService.add).toHaveBeenCalledWith(productGroup);
      });
    });
  });

  describe('delete()', () => {
    it('should call masterProductGroupCollectionService.delete', () => {
      service.delete('PC').subscribe(() => {
        expect(masterProductGroupCollectionService.delete).toHaveBeenCalled();
      });
    });
  });

  describe('update()', () => {
    it('should call masterProductGroupCollectionService.update', () => {
      const productGroup: MasterProductGroup = productGroupMock[0];
      productGroup.name = 'updatedValue';

      service.update(productGroup).subscribe(result => {
        expect(result.name).toEqual(productGroup.name);

        expect(masterProductGroupCollectionService.update).toHaveBeenCalledWith(productGroup);
      });
    });
  });
});
