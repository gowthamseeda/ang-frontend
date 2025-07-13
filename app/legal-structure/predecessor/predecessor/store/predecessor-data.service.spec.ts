import { TestBed } from '@angular/core/testing';
import { Update } from '@ngrx/entity';

import { ApiService } from '../../../../shared/services/api/api.service';
import { LoggingService } from '../../../../shared/services/logging/logging.service';
import { AppStoreModule } from '../../../../store/app-store.module';
import { TestingModule } from '../../../../testing/testing.module';
import { PredecessorMock } from '../predecessor.mock';
import { Predecessor } from '../predecessor.model';

import { PredecessorDataService } from './predecessor-data.service';

describe('PredecessorDataService', () => {
  const predecessorMock = PredecessorMock.forContracts();

  let service: PredecessorDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, AppStoreModule],
      providers: [PredecessorDataService, ApiService, LoggingService]
    });
    service = TestBed.inject(PredecessorDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getById()', () => {
    it('should get Predecessor from investors contracts', done => {
      service.getById('GS00000002').subscribe(predecessor => {
        expect(predecessor).toEqual(predecessorMock);
        done();
      });
    });
  });

  describe('update()', () => {
    it('should update Predecessor and return StatusCode UPDATED', done => {
      const update: Update<Predecessor> = {
        id: 'GS00000002',
        changes: {
          id: 'GS000000002',
          predecessors: [
            {
              businessSiteId: 'GS00000005'
            }
          ]
        }
      };
      service.update(update).subscribe(status => {
        expect(status.status).toBe('UPDATED');
        done();
      });
    });
  });
});
