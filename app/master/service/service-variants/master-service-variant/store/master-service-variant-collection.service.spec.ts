import { TestBed } from '@angular/core/testing';

import { AppStoreModule } from '../../../../../store/app-store.module';
import { MasterServiceVariantMock } from '../master-service-variant.mock';
import { MasterServiceVariantModule } from '../master-service-variant.module';

import { MasterServiceVariantCollectionService } from './master-service-variant-collection.service';

describe('ServiceVariantCollectionService', () => {
  const serviceVariantMock = MasterServiceVariantMock.asMap();
  let service: MasterServiceVariantCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [MasterServiceVariantModule, AppStoreModule] });
    service = TestBed.inject(MasterServiceVariantCollectionService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('select()', () => {
    it('should select service variant for a given ID', () => {
      const selection = service.select(1).projector(serviceVariantMock);
      expect(selection).toEqual(serviceVariantMock[1]);
    });

    it('should throw an error if no service variant is found for the given ID', () => {
      expect(() => service.select(99).projector([])).toThrowError();
    });
  });

  describe('isLoading()', () => {
    it('should return true when entities are not empty', () => {
      expect(service.isLoading().projector(true)).toBeTruthy();
    });

    it('should return false when entities are empty', () => {
      expect(service.isLoading().projector(false)).toBeFalsy();
    });
  });
});
