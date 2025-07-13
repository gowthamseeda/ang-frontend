import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { SortingService } from '../../../shared/services/sorting/sorting.service';
import { AppStoreModule } from '../../../store/app-store.module';
import { TestingModule } from '../../../testing/testing.module';
import { ObjectPosition } from '../../shared/position-control/position-control.model';

import { MasterBrandMock } from './master-brand.mock';
import { MasterBrand } from './master-brand.model';
import { MasterBrandModule } from './master-brand.module';
import { MasterBrandService } from './master-brand.service';
import { MasterBrandCollectionService } from './store/master-brand-collection.service';
import { MasterBrandDataService } from './store/master-brand-data.service';

describe('MasterBrandService', () => {
  const brandMock = MasterBrandMock.asList();
  let service: MasterBrandService;

  let sortingServiceSpy: Spy<SortingService>;
  let masterBrandCollectionService: MasterBrandCollectionService;
  let brandDataService: MasterBrandDataService;

  beforeEach(() => {
    sortingServiceSpy = createSpyFromClass(SortingService);

    TestBed.configureTestingModule({
      imports: [TestingModule, MasterBrandModule, AppStoreModule],
      providers: [
        MasterBrandService,
        ApiService,
        LoggingService,
        MasterBrandCollectionService,
        MasterBrandDataService,
        { provide: SortingService, useValue: sortingServiceSpy }
      ]
    });

    masterBrandCollectionService = TestBed.inject(MasterBrandCollectionService);
    brandDataService = TestBed.inject(MasterBrandDataService);

    service = TestBed.inject(MasterBrandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should get all brands', done => {
      service.getAll().subscribe(result => {
        expect(result).toEqual(brandMock);
        done();
      });
    });
  });

  describe('getBy()', () => {
    it('should get service', done => {
      const expected = brandMock[0];

      service.getBy('MB').subscribe(brand => {
        expect(brand).toEqual(expected);
        done();
      });
    });
  });

  describe('fetchBy()', () => {
    it('should get brand by Id', done => {
      service.fetchBy('MB').subscribe(result => {
        expect(result).toEqual(brandMock[0]);
        done();
      });
    });
  });

  describe('create()', () => {
    it('should call MasterBrandCollectionService.add', () => {
      const brand: MasterBrand = {
        id: 'BRAND',
        name: 'brand'
      };
      service.create(brand).subscribe(result => {
        expect(result.id).toEqual(brand.id);
        expect(result.name).toEqual(brand.name);

        expect(masterBrandCollectionService.add).toHaveBeenCalledWith(brand);
      });
    });
  });

  describe('delete()', () => {
    it('should call MasterBrandCollectionService.delete', () => {
      service.delete('MB').subscribe(() => {
        expect(masterBrandCollectionService.delete).toHaveBeenCalled();
      });
    });
  });

  describe('update()', () => {
    it('should call MasterBrandCollectionService.update', () => {
      const brand: MasterBrand = brandMock[0];
      brand.name = 'updatedValue';

      service.update(brand).subscribe(result => {
        expect(result.name).toEqual(brand.name);

        expect(masterBrandCollectionService.update).toHaveBeenCalledWith(brand);
      });
    });
  });

  describe('updatePosition()', () => {
    it('should call MasterBrandDataService.updatePosition', () => {
      const position: ObjectPosition = {
        id: 'FTL',
        afterId: 'MB'
      };
      service.updatePosition(position).subscribe(result => {
        expect(brandDataService.updatePosition).toHaveBeenCalledWith(position);
      });
    });
  });

  describe('sort()', () => {
    it('should sort brands', done => {
      service.sort(brandMock.reverse(), ['id']).subscribe(brands => {
        expect(brands).toMatchObject(brandMock);
        done();
      });
    });
  });
});
