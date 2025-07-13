import { TestBed } from '@angular/core/testing';
import { createSpyFromClass } from 'jest-auto-spies';

import { AppStoreModule } from '../../../store/app-store.module';
import { TestingModule } from '../../../testing/testing.module';

import { DistributionLevelCollectionService } from './distribution-level-collection.service';
import { DistributionLevelDataService } from './distribution-level-data.service';

describe('DistributionLevelCollectionService', () => {
  let service: DistributionLevelCollectionService;
  let distributionLevelDataServiceSpy;

  beforeEach(() => {
    distributionLevelDataServiceSpy = createSpyFromClass(DistributionLevelDataService);

    TestBed.configureTestingModule({
      imports: [TestingModule, AppStoreModule],
      providers: [
        DistributionLevelCollectionService,
        { provide: DistributionLevelDataService, useValue: distributionLevelDataServiceSpy }
      ]
    });
    service = TestBed.inject(DistributionLevelCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
