import { TestBed } from '@angular/core/testing';

import { ProductGroupMock } from '../../../../services/product-group/product-group.mock';
import { AppStoreModule } from '../../../../store/app-store.module';
import { MasterProductGroupModule } from '../master-product-group.module';

import { MasterProductGroupCollectionService } from './master-product-group-collection.service';

describe('MasterProductGroupCollectionService', () => {
  const productGroupMock = ProductGroupMock.asMap();
  let service: MasterProductGroupCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppStoreModule, MasterProductGroupModule]
    });
    service = TestBed.inject(MasterProductGroupCollectionService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('select()', () => {
    it('should select product group for a given ID', () => {
      const selection = service.select('PC').projector(productGroupMock);
      expect(selection.id).toEqual('PC');
    });

    it('should throw an error if no product group is found for the given ID', () => {
      expect(() => service.select('99').projector([])).toThrowError();
    });
  });
});
