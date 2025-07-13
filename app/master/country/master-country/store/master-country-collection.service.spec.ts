import { TestBed } from '@angular/core/testing';

import { AppStoreModule } from '../../../../store/app-store.module';
import { MasterCountryModule } from '../master-country.module';

import { MasterCountryCollectionService } from './master-country-collection.service';

describe('MasterCountryCollectionService', () => {
  let service: MasterCountryCollectionService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppStoreModule, MasterCountryModule]
    });
    service = TestBed.inject(MasterCountryCollectionService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
