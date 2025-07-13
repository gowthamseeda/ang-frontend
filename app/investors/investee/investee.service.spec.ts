import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { AppStoreModule } from '../../store/app-store.module';
import { TestingModule } from '../../testing/testing.module';

import { InvesteeMock } from './investee.mock';
import { Investee } from './investee.model';
import { InvesteeService } from './investee.service';
import { InvesteeCollectionService } from './store/investee-collection.service';

describe('InvesteeService', () => {
  let service: InvesteeService;
  let investeeCollectionServiceSpy: Spy<InvesteeCollectionService>;

  beforeEach(() => {
    investeeCollectionServiceSpy = createSpyFromClass(InvesteeCollectionService);
    TestBed.configureTestingModule({
      imports: [TestingModule, AppStoreModule],
      providers: [
        InvesteeService,
        ApiService,
        LoggingService,
        {
          provide: InvesteeCollectionService,
          useValue: investeeCollectionServiceSpy
        }
      ]
    });
    service = TestBed.inject(InvesteeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBy()', () => {
    beforeEach(() => {
      service.fetchForOutlet('GS00000001');
    });

    it('should get investee', done => {
      const expectedInvestee = InvesteeMock.asList()[0];
      investeeCollectionServiceSpy.select.mockReturnValue(() => expectedInvestee);

      service.getBy('GS00000001').subscribe(investee => {
        expect(investee).toEqual(expectedInvestee);
        done();
      });
    });
  });

  describe('isLoaded()', () => {
    it('should return false when investee is not loaded yet', done => {
      investeeCollectionServiceSpy.isLoaded.mockReturnValue(() => false);
      service.isLoaded().subscribe(isLoaded => {
        expect(isLoaded).toBeFalsy();
        done();
      });
    });

    it('should return true when investee is loaded', done => {
      investeeCollectionServiceSpy.isLoaded.mockReturnValue(() => true);

      service.isLoaded().subscribe(isLoaded => {
        expect(isLoaded).toBeTruthy();
        done();
      });
    });
  });

  describe('update()', () => {
    it('should call investeeCollectionService.updateOneInCache', () => {
      const investee: Partial<Investee> = {
        id: 'GS000000001',
        shareCapitalCurrency: 'EUR'
      };
      service.update(investee);
      expect(investeeCollectionServiceSpy.updateOneInCache).toHaveBeenCalledWith(investee);
    });
  });

  describe('save()', () => {
    it('should call investeeCollectionService.update', () => {
      const investee: Investee = {
        id: 'GS000000001',
        shareCapitalCurrency: 'EUR',
        shareCapitalValue: 50000
      };
      service.save(investee);
      expect(investeeCollectionServiceSpy.update).toHaveBeenCalledWith(investee);
    });
  });
});
