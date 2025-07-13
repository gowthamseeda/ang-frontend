import { TestBed } from '@angular/core/testing';

import { AppStoreModule } from '../../../../store/app-store.module';
import { MasterBrandMock } from '../master-brand.mock';
import { MasterBrandModule } from '../master-brand.module';

import { MasterBrandCollectionService } from './master-brand-collection.service';

describe('MasterBrandCollectionService', () => {
  const brandMock = MasterBrandMock.asMap();
  let service: MasterBrandCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppStoreModule, MasterBrandModule]
    });
    service = TestBed.inject(MasterBrandCollectionService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('select()', () => {
    it('should select brand for a given ID', () => {
      const selection = service.select('MB').projector(brandMock);
      expect(selection.id).toEqual('MB');
    });

    it('should throw an error if no brand is found for the given ID', () => {
      expect(() => service.select('MM').projector([])).toThrowError();
    });
  });
});
