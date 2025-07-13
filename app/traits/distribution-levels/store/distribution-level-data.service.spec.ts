import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { AppStoreModule } from '../../../store/app-store.module';
import { TestingModule } from '../../../testing/testing.module';

import { DistributionLevelDataService } from './distribution-level-data.service';

describe('DistributionLevelDataService', () => {
  let service: DistributionLevelDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, AppStoreModule],
      providers: [ApiService, LoggingService]
    });

    service = TestBed.inject(DistributionLevelDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getById', () => {
    it('should get the distribution levels for a specific outlet from the traits contract', done => {
      service.getById('GS00000001').subscribe(entity => {
        expect(entity.distributionLevels).toEqual(['RETAILER']);
        done();
      });
    });
    it('should return empty if no distribution levels are found in the traits contract', done => {
      service.getById('GSNODISLVL').subscribe(entity => {
        expect(entity.distributionLevels).toEqual([]);
        done();
      });
    });
  });

  describe('update', () => {
    it('should update the distribution levels for specific outlet if found in the traits contracts', done => {
      let updated = false;
      service.update({ id: 'GS00000001', changes: {} }).subscribe(() => {
        updated = true;
        done();
      });
      expect(updated).toBeTruthy();
    });
  });
});
