import { CurrencyDataService } from './currency-data.service';
import { TestBed } from '@angular/core/testing';
import { TestingModule } from '../../../testing/testing.module';
import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { AppStoreModule } from '../../../store/app-store.module';
import { CurrencyMock } from '../currency.mock';
import { CurrencyModule } from '../currency.module';

describe('CurrencyDataService', () => {
  const currenciesMockList = CurrencyMock.asList();
  let service: CurrencyDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, CurrencyModule, AppStoreModule],
      providers: [CurrencyDataService, ApiService, LoggingService]
    });

    service = TestBed.inject(CurrencyDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should get all currencies from investors contract', done => {
      service.getAll().subscribe(currencies => {
        expect(currencies).toEqual(currenciesMockList);
        done();
      });
    });
  });
});
