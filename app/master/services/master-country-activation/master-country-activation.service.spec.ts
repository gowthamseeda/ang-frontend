import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { TestingModule } from '../../../testing/testing.module';

import {
  getMasterCountriesActivationMock,
  getMasterCountriesActivationSingleMock
} from './master-country-activation.mock';
import { MasterCountryActivationService } from './master-country-activation.service';

describe('MasterCountryActivationService', () => {
  const countriesActivationMock = getMasterCountriesActivationMock();
  let service: MasterCountryActivationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [MasterCountryActivationService, ApiService, LoggingService]
    });

    service = TestBed.inject(MasterCountryActivationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get country activation from structures contract', done => {
    service.get().subscribe(countriesActivation => {
      expect(countriesActivation).toEqual([getMasterCountriesActivationSingleMock()]);
      done();
    });
  });

  it('should create country activation from structures contract', done => {
    service.create(countriesActivationMock[1]).subscribe(result => {
      expect(result.status).toEqual('CREATED');
      done();
    });
  });

  it('should delete country activation from the services contract', done => {
    service.delete(countriesActivationMock[0].activationId).subscribe(result => {
      expect(result.status).toEqual('DELETED');
      done();
    });
  });
});
