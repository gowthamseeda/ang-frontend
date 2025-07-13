import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { TestingModule } from '../../../testing/testing.module';
import { getCountryStructureDescription_US_Regions_Areas_Markets_Response } from '../model/country-structure-description.mock';

import { CountryStructureDescriptionApiService } from './country-structure-description-api.service';

describe('CountryStructureDescriptionApiService Test Suite', () => {
  let service: CountryStructureDescriptionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ApiService, LoggingService, CountryStructureDescriptionApiService]
    });

    service = TestBed.inject(CountryStructureDescriptionApiService);
  });

  test('should create', () => {
    expect(service).toBeTruthy();
  });

  test('should get country structure description including structures', done => {
    service.getCountryStructureDescriptions('US').subscribe(desc => {
      expect(desc).toEqual(getCountryStructureDescription_US_Regions_Areas_Markets_Response());
      done();
    });
  });
});
