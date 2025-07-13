import { CurrencyCollectionService } from './currency-collection.service';
import { TestBed } from '@angular/core/testing';
import { AppStoreModule } from '../../../store/app-store.module';
import { CurrencyModule } from '../currency.module';
import { CurrencyMock } from '../currency.mock';

describe('CurrencyCollectionService', () => {
  const currencies = CurrencyMock.asMap();
  let service: CurrencyCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [CurrencyModule, AppStoreModule] });
    service = TestBed.inject(CurrencyCollectionService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('selectAllIds()', () => {
    it('should select all currency IDs', done => {
      const selection = service.selectAllIds().projector(currencies);
      expect(selection).toEqual(['EUR', 'USD']);
      done();
    });
  });

  describe('isLoaded()', () => {
    it('should select loaded state and return true', () => {
      expect(service.isLoaded().projector(true)).toBeTruthy();
    });

    it('should select loaded state and return false', () => {
      expect(service.isLoaded().projector(false)).toBeFalsy();
    });
  });
});
