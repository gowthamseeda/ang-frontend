import { TestBed } from '@angular/core/testing';

import { AppStoreModule } from '../../../../store/app-store.module';
import { MasterServiceMock } from '../master-service.mock';
import { MasterServiceModule } from '../master-service.module';

import { MasterServiceCollectionService } from './master-service-collection.service';

describe('MasterServiceCollectionService', () => {
  const serviceMock = MasterServiceMock.asMap();
  let service: MasterServiceCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppStoreModule, MasterServiceModule]
    });
    service = TestBed.inject(MasterServiceCollectionService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('select()', () => {
    it('should select service for a given ID', () => {
      const selection = service.select(1).projector(serviceMock);
      expect(selection).toEqual(serviceMock[1]);
    });

    it('should throw an error if no service is found for the given ID', () => {
      expect(() => service.select(99).projector([])).toThrowError();
    });
  });
});
