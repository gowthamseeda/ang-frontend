import { TestBed } from '@angular/core/testing';
import { AppStoreModule } from 'app/store/app-store.module';
import { createSpyFromClass } from 'jest-auto-spies';

import { TestingModule } from '../../../testing/testing.module';

import { ProductGroupCollectionService } from './product-group-collection.service';
import { ProductGroupDataService } from './product-group-data.service';

describe('ProductGroupCollectionService', () => {
  const productGroupDataServiceSpy = createSpyFromClass(ProductGroupDataService);
  let service: ProductGroupCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, AppStoreModule],
      providers: [
        ProductGroupCollectionService,
        { provide: ProductGroupDataService, useValue: productGroupDataServiceSpy }
      ]
    });
    service = TestBed.inject(ProductGroupCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
