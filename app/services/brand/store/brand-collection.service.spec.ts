import { TestBed } from '@angular/core/testing';
import { AppStoreModule } from 'app/store/app-store.module';
import { createSpyFromClass } from 'jest-auto-spies';

import { TestingModule } from '../../../testing/testing.module';
import { BrandMock } from '../brand.mock';

import { BrandCollectionService } from './brand-collection.service';
import { BrandDataService } from './brand-data.service';

describe('BrandCollectionService', () => {
  const brandDataServiceSpy = createSpyFromClass(BrandDataService);
  const brandMock = BrandMock.asMap();
  let service: BrandCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, AppStoreModule],
      providers: [{ provide: BrandDataService, useValue: brandDataServiceSpy }]
    });
    service = TestBed.inject(BrandCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('select()', () => {
    it('should select the brand for the given ID', () => {
      const selection = service.select('MB').projector(brandMock);
      expect(selection).toEqual(brandMock['MB']);
    });

    it('should throw an error if no brand is found for the given ID', () => {
      expect(() => service.select('MB').projector([])).toThrowError();
    });
  });

  describe('selectAllIds()', () => {
    it('should select all brand IDs', () => {
      const selection = service.selectAllIds().projector(brandMock);
      expect(selection).toEqual(Object.keys(brandMock));
    });
  });
});
