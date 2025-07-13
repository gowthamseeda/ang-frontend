import { CurrencyModule } from './currency.module';
import { CurrencyService } from './currency.service';
import { TestBed } from '@angular/core/testing';
import { TestingModule } from '../../testing/testing.module';
import { AppStoreModule } from '../../store/app-store.module';
import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';

describe('CurrencyService', () => {
  let service: CurrencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, CurrencyModule, AppStoreModule],
      providers: [CurrencyService, ApiService, LoggingService]
    });

    service = TestBed.inject(CurrencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllIds()', () => {
    it('should get all currencies from the investors contracts', done => {
      const expected = ['EUR', 'USD'];
      service.getAllIds().subscribe(currencyIds => {
        expect(currencyIds).toEqual(expected);
        done();
      });
    });
  });
});
