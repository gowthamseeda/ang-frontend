import { TestBed } from '@angular/core/testing';
import { AppStoreModule } from '../../../store/app-store.module';
import { InvesteeMock } from '../investee.mock';
import { InvesteeModule } from '../investee.module';
import { InvesteeCollectionService } from './investee-collection.service';

describe('InvesteeCollectionService', () => {
  const investeeMockMap = InvesteeMock.asMap();
  const investeeMock = InvesteeMock.asList()[0];

  let service: InvesteeCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppStoreModule, InvesteeModule]
    });
    service = TestBed.inject(InvesteeCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('select()', () => {
    it('should select investee for a given ID', () => {
      const selection = service.select('GS00000001').projector(investeeMockMap);
      expect(selection).toEqual(investeeMock);
    });

    it('should return undefined if no investee is found for given ID', () => {
      const selection = service.select('GS000000012').projector(investeeMockMap);
      expect(selection).toEqual(undefined);
    });
  });

  describe('isLoaded()', () => {
    it('should return true when entities are not empty', () => {
      expect(service.isLoaded().projector([{}])).toBeTruthy();
    });

    it('should return false when entities are empty', () => {
      expect(service.isLoaded().projector([])).toBeFalsy();
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
