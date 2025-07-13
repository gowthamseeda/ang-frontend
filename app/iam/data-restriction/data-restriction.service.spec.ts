import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { TestingModule } from '../../testing/testing.module';

import { getDataRestrictionMock } from './data-restriction.mock';
import { DataRestriction } from './data-restriction.model';
import { DataRestrictionService } from './data-restriction.service';

describe('DataRestrictionService', () => {
  let service: DataRestrictionService;
  let dataRestrictionMock: DataRestriction;

  beforeEach(() => {
    dataRestrictionMock = getDataRestrictionMock();
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ApiService, LoggingService, DataRestrictionService]
    });
    service = TestBed.inject(DataRestrictionService);
  });

  it('should create ', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should getAll all data restrictions of specific type', done => {
      service.get('Country').subscribe(dataRestrictions => {
        expect(dataRestrictions).toEqual(dataRestrictionMock);
        done();
      });
    });
  });
});
