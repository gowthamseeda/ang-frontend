import { TestBed } from '@angular/core/testing';
import { AppStoreModule } from 'app/store/app-store.module';
import { ProductGroupMock } from '../product-group.mock';
import { ProductGroupDataService } from './product-group-data.service';
import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { TestingModule } from '../../../testing/testing.module';

describe('ProductGroupDataService', () => {
  const productGroupMock = ProductGroupMock.asList();
  let service: ProductGroupDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, AppStoreModule],
      providers: [ProductGroupDataService, ApiService, LoggingService]
    });

    service = TestBed.inject(ProductGroupDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should get all product groups from the services contract', done => {
      service.getAll().subscribe(productGroups => {
        expect(productGroups).toEqual(productGroupMock);

        done();
      });
    });
  });
});
