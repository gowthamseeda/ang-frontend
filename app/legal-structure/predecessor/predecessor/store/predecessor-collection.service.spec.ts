import { TestBed } from '@angular/core/testing';

import { AppStoreModule } from '../../../../store/app-store.module';
import { PredecessorModule } from '../../predecessor.module';
import { PredecessorMock } from '../predecessor.mock';

import { PredecessorCollectionService } from './predecessor-collection.service';

describe('PredecessorCollectionService', () => {
  const predecessorMockMap = PredecessorMock.asMap();
  const predecessorMock = PredecessorMock.asList()[0];

  let service: PredecessorCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppStoreModule, PredecessorModule]
    });
    service = TestBed.inject(PredecessorCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('select()', () => {
    it('should select predecessor for a given ID', () => {
      const selection = service.select('GS00000001').projector(predecessorMockMap);
      expect(selection).toEqual(predecessorMock);
    });

    it('should return undefined if no investee is found for given ID', () => {
      const selection = service.select('GS00000008').projector(predecessorMockMap);
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
});
