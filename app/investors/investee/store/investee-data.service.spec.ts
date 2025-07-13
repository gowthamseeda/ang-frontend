import { TestBed } from '@angular/core/testing';
import { Update } from '@ngrx/entity';
import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { AppStoreModule } from '../../../store/app-store.module';
import { TestingModule } from '../../../testing/testing.module';
import { InvesteeMock } from '../investee.mock';
import { Investee } from '../investee.model';
import { InvesteeDataService } from './investee-data.service';

describe('InvesteeDataService', () => {
  const investeeMock = InvesteeMock.forContracts();

  let service: InvesteeDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, AppStoreModule],
      providers: [InvesteeDataService, ApiService, LoggingService]
    });
    service = TestBed.inject(InvesteeDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getById()', () => {
    it('should get Investee from investors contracts', done => {
      service.getById('GS00000001').subscribe(investee => {
        expect(investee).toEqual(investeeMock);
        done();
      });
    });
  });

  describe('update()', () => {
    it('should update Investee and return StatusCode UPDATED', done => {
      const update: Update<Investee> = {
        id: 'GS00000001',
        changes: {
          id: 'GS00000001',
          shareCapitalValue: 666666,
          shareCapitalCurrency: 'USD'
        }
      };
      service.update(update).subscribe(status => {
        expect(status.status).toBe('UPDATED');
        done();
      });
    });
  });
});
