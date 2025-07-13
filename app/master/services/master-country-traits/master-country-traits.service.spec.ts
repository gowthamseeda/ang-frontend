import { TestBed } from '@angular/core/testing';
import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { TestingModule } from '../../../testing/testing.module';
import {
  getMasterCountryTraitsMock,
  updateMasterCountryTraitsMock
} from './master-country-traits.mock';
import { MasterCountryTraitsService } from './master-country-traits.service';

describe('MasterCountryTraitsService', () => {
  let service: MasterCountryTraitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [MasterCountryTraitsService, ApiService, LoggingService]
    });
    service = TestBed.inject(MasterCountryTraitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get specific country traits from the services contract', done => {
    service.get('DE').subscribe(countryTraits => {
      expect(countryTraits).toEqual(getMasterCountryTraitsMock());
      done();
    });
  });

  it('should update country-traits from the services contract', done => {
    service.update(updateMasterCountryTraitsMock()).subscribe(result => {
      expect(result.status).toEqual('UPDATED');
      done();
    });
  });
});
