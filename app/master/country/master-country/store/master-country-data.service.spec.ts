import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../../../shared/services/api/api.service';
import { LoggingService } from '../../../../shared/services/logging/logging.service';
import { AppStoreModule } from '../../../../store/app-store.module';
import { TestingModule } from '../../../../testing/testing.module';
import { MasterCountryMock } from '../master-country.mock';
import { MasterCountry } from '../master-country.model';
import { MasterCountryModule } from '../master-country.module';

import { MasterCountryDataService } from './master-country-data.service';

describe('MasterCountryDataService', () => {
  const countryMock = MasterCountryMock.asList();
  let service: MasterCountryDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule, MasterCountryModule, AppStoreModule],
      providers: [MasterCountryDataService, ApiService, LoggingService]
    });

    service = TestBed.inject(MasterCountryDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should get all countries from the geography contract', done => {
      service.getAll().subscribe(country => {
        expect(country).toEqual(countryMock);
        done();
      });
    });
  });

  describe('getById()', () => {
    it('should get specific country from the geography contract', done => {
      service.getById('GB').subscribe(country => {
        expect(country).toEqual(countryMock[0]);
        done();
      });
    });
  });

  describe('add()', () => {
    it('should create country from the geography contract', done => {
      const addCountry: MasterCountry = {
        id: 'NZ',
        name: 'New Zealand',
        languages: []
      };
      service.add(addCountry).subscribe(result => {
        expect(result.status).toEqual('CREATED');
        done();
      });
    });
  });

  describe('update()', () => {
    it('should update country from the geography contract', done => {
      service.update(countryMock[0]).subscribe(result => {
        expect(result.status).toEqual('UPDATED');
        done();
      });
    });
  });

  describe('delete()', () => {
    it('should delete country from the geography contract', done => {
      service.delete('GB').subscribe(result => {
        expect(result.status).toEqual('DELETED');
        done();
      });
    });
  });
});
