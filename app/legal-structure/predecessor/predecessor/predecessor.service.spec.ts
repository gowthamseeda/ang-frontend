import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { AppStoreModule } from '../../../store/app-store.module';
import { TestingModule } from '../../../testing/testing.module';

import { PredecessorMock } from './predecessor.mock';
import { Predecessor } from './predecessor.model';
import { PredecessorService } from './predecessor.service';
import { PredecessorCollectionService } from './store/predecessor-collection.service';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

describe('PredecessorService', () => {
  let service: PredecessorService;
  let predecessorCollectionServiceSpy: Spy<PredecessorCollectionService>;

  beforeEach(() => {

    predecessorCollectionServiceSpy = createSpyFromClass(PredecessorCollectionService)


    TestBed.configureTestingModule({
      imports: [TestingModule, AppStoreModule],
      providers: [
        PredecessorService,
        {
          provide: PredecessorCollectionService,
          useValue: predecessorCollectionServiceSpy
        },
        ApiService,
        LoggingService
      ]
    });
    service = TestBed.inject(PredecessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBy()', () => {
    beforeEach(() => {
      service.fetchForOutlet('GS00000001');
    });

    it('should get predecessor', done => {
      const expectedPredecessor = PredecessorMock.asList()[0];
      predecessorCollectionServiceSpy.select.mockReturnValue(() => expectedPredecessor)

      service.getBy('GS00000001').subscribe(predecessor => {
        expect(predecessor).toEqual(expectedPredecessor);
        done();
      });
    });
  });

  describe('isLoaded()', () => {
    it('should return false when predecessor is not loaded yet', done => {
      predecessorCollectionServiceSpy.isLoaded.mockReturnValue(() => false)
      service.isLoaded().subscribe(isLoaded => {
        expect(isLoaded).toBeFalsy();
        done();
      });
    });

    it('should return true when predecessor is loaded', done => {
      predecessorCollectionServiceSpy.isLoaded.mockReturnValue(() => true)

      service.isLoaded().subscribe(isLoaded => {
        expect(isLoaded).toBeTruthy();
        done();
      });
    });
  });

  describe('update()', () => {
    it('should call predecessorCollectionService.updateOneInCache', () => {
      const predecessor: Partial<Predecessor> = {
        id: 'GS000000001',
        predecessors: [
          {
            businessSiteId: 'GS00000004'
          }
        ]
      };
      service.update(predecessor);
      expect(predecessorCollectionServiceSpy.updateOneInCache).toHaveBeenCalledWith(predecessor);
    });
  });

  describe('save()', () => {
    it('should call predecessorCollectionService.update', () => {
      const predecessor: Predecessor = {
        id: 'GS000000001',
        predecessors: [
          {
            businessSiteId: 'GS00000005'
          }
        ],
        successors: []
      };
      service.save(predecessor);
      expect(predecessorCollectionServiceSpy.update).toHaveBeenCalledWith(predecessor);
    });
  });
});
