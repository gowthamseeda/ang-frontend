import { TestBed } from '@angular/core/testing';
import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { TestingModule } from '../../../testing/testing.module';
import { getMasterCountryGroupsMock } from './master-country-group.mock';
import { MasterCountryGroupService } from './master-country-group.service';

describe('MasterCountryGroupService', () => {
  const countryGroupsMock = getMasterCountryGroupsMock();
  let service: MasterCountryGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [MasterCountryGroupService, ApiService, LoggingService]
    });
    service = TestBed.inject(MasterCountryGroupService);
  });

  it('should create ', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll()', () => {
    it('should get all country groups from the geography contract', done => {
      service.getAll().subscribe(countries => {
        expect(countries).toEqual(countryGroupsMock.countryGroups);
        done();
      });
    });
  });

  describe('get()', () => {
    it('should get a specific country group from the geography contract ', done => {
      service.get('2').subscribe(country => {
        expect(country).toEqual(countryGroupsMock.countryGroups[1]);
        done();
      });
    });
  });

  describe('create()', () => {
    it('should create country group from the geography contract', done => {
      service.create(countryGroupsMock.countryGroups[0]).subscribe(result => {
        expect(result.status).toEqual('CREATED');
        done();
      });
    });
  });

  describe('delete()', () => {
    it('should delete country groups from the geography contract', done => {
      service.delete('3').subscribe(result => {
        expect(result.status).toEqual('DELETED');
        done();
      });
    });
  });

  describe('update()', () => {
    it('should update country group from the geography contract', done => {
      service.update('1', getMasterCountryGroupsMock[0]).subscribe(result => {
        expect(result.status).toEqual('UPDATED');
        done();
      });
    });
  });
});
