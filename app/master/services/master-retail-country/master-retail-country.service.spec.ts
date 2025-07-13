import { TestBed } from '@angular/core/testing';

import { MasterRetailCountryService } from './master-retail-country.service';
import {
  getMasterRetailCountriesMock,
  getNewMasterRetailCountryMock,
  getUpdatedMasterRetailCountryMock
} from './master-retail-country.mock';
import { TestingModule } from '../../../testing/testing.module';
import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';

describe('MasterRetailCountryService', () => {
  let service: MasterRetailCountryService;

  const retailCountriesMock = getMasterRetailCountriesMock();
  const newRetailCountryMock = getNewMasterRetailCountryMock();
  const updatedRetailCountryMock = getUpdatedMasterRetailCountryMock();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ApiService, LoggingService, MasterRetailCountryService]
    });
    service = TestBed.inject(MasterRetailCountryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should get all retail countries from the geography retail-countries', done => {
      service.getAll().subscribe(retailCountries => {
        expect(retailCountries).toEqual(retailCountriesMock.retailCountries);
        done();
      });
    });
  });

  describe('get()', () => {
    it('should get specific retailCountry from the geography retail-countries', done => {
      service.get('GB').subscribe(result => {
        expect(result).toEqual(retailCountriesMock.retailCountries[0]);
        done();
      });
    });
  });

  describe('create()', () => {
    it('should create retailCountry from the geography retail-countries', done => {
      let status = false;
      service.create(newRetailCountryMock).subscribe(() => {
        status = true;
      });
      expect(status).toBeTruthy();
      done();
    });
  });

  describe('update()', () => {
    it('should update retailCountry from the geography retail-countries', done => {
      let status = false;
      service.update(updatedRetailCountryMock).subscribe(() => {
        status = true;
      });
      expect(status).toBeTruthy();
      done();
    });
  });

  describe('delete()', () => {
    it('should delete specific retailCountry from the geography retail-countries', done => {
      let status = false;
      service.delete('GB').subscribe(() => {
        status = true;
      });
      expect(status).toBeTruthy();
      done();
    });
  });
});
