import { TestBed } from '@angular/core/testing';
import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { TestingModule } from '../../testing/testing.module';
import { MarketStructureService } from './market-structure.service';

describe('MarketStructureService', () => {
  let service: MarketStructureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [MarketStructureService, ApiService, LoggingService]
    });

    service = TestBed.inject(MarketStructureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('create()', () => {
    it('should create market structure from the structures contract', done => {
      let created = false;
      service
        .create({
          mainBusinessSiteId: 'GS00000010',
          subBusinessSiteIds: ['GS00000005']
        })
        .subscribe(() => {
          created = true;
          done();
        });

      expect(created).toBeTruthy();
    });
  });

  describe('update()', () => {
    it('should update market structure from the structures contract', done => {
      let updated = false;
      service
        .update({
          mainBusinessSiteId: 'GS00000001',
          subBusinessSiteIds: ['GS00000005']
        })
        .subscribe(() => {
          updated = true;
          done();
        });

      expect(updated).toBeTruthy();
    });
  });

  describe('delete()', () => {
    it('should delete a market structure from the structures contract', done => {
      let deleted = false;

      service.delete('GS00000009').subscribe(() => {
        deleted = true;
        done();
      });

      expect(deleted).toBeTruthy();
    });
  });
});
