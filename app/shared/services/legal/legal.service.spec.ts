import { TestBed } from '@angular/core/testing';
import { of as observableOf } from 'rxjs';

import { ApiService } from '../api/api.service';
import { LoggingService } from '../logging/logging.service';

import { LegalService, LicenseEntry } from './legal.service';
import { getLicensesMock, getResponse } from './license-entry.mock';
//import SpyMe = jasmine.Spy;
import { TestingModule } from '../../../testing/testing.module';
import SpyInstance = jest.SpyInstance;

describe('LegalService', () => {
  let service: LegalService;
  let get: SpyInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [LegalService, ApiService, LoggingService]
    });

    service = TestBed.inject(LegalService);
    get = jest.spyOn(TestBed.inject(ApiService), 'get').mockReturnValue(observableOf(getResponse()));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should parse Black Duck license text file', done => {
    service.getLicenses().subscribe((licenses: LicenseEntry[]) => {
      expect(licenses).toEqual(getLicensesMock());
      done();
    });
    expect(get).toHaveBeenCalled();
  });
});
