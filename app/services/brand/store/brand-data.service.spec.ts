import { TestBed } from '@angular/core/testing';
import { AppStoreModule } from 'app/store/app-store.module';

import { BrandMock } from '../brand.mock';

import { BrandDataService } from './brand-data.service';
import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { TestingModule } from '../../../testing/testing.module';

describe('BrandDataService', () => {
  const brandsMock = BrandMock.asList();
  let service: BrandDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, AppStoreModule],
      providers: [BrandDataService, ApiService, LoggingService]
    });

    service = TestBed.inject(BrandDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should get all brands from the services contract', done => {
      service.getAll().subscribe(brands => {
        expect(brands).toEqual([brandsMock[0], brandsMock[3]]);
        done();
      });
    });
  });
});
