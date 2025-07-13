import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';
import { getCountriesMock } from '../../geography/country/country.mock';
import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { Timezone } from './timezone.model';
import { getTimezoneMock, getTimezoneTxt } from './timezone.mock';
import { TimezoneService } from './timezone.service';

describe('TimezoneService', () => {
  const countriesMock = getCountriesMock().countries;
  const timezoneMock = getTimezoneMock();

  let service: TimezoneService;
  let httpClientSpy: Spy<HttpClient>;

  beforeEach(() => {
    httpClientSpy = createSpyFromClass(HttpClient);
    httpClientSpy.get.mockReturnValue(of(getTimezoneTxt()));

    TestBed.configureTestingModule({
      providers: [
        TimezoneService,
        ApiService,
        LoggingService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });

    service = TestBed.inject(TimezoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTimezones()', () => {
    it('should get the name of the timezone', done => {
      service.getTimezones().subscribe((timezones: Timezone[]) => {
        expect(timezones[0].names).toEqual(timezoneMock[0].names);
        expect(timezones[1].names).toEqual(timezoneMock[1].names);
        done();
      });
    });

    it('should get the time offset of the timezone', done => {
      service.getTimezones().subscribe((timezones: Timezone[]) => {
        expect(timezones[0].utcOffset).toEqual(timezoneMock[0].utcOffset);
        expect(timezones[1].utcOffset).toEqual(timezoneMock[1].utcOffset);
        done();
      });
    });
  });

  describe('convert UTC or number', () => {
    it('should convert UTC to number', done => {
      countriesMock[0].timeZone = 'UTC+12:00';
      expect(service.convertUtcToNumber(countriesMock[0]).timeZone).toEqual('43200');
      done();
    });

    it('should convert number to UTC', done => {
      countriesMock[1].timeZone = '3600';
      expect(service.convertNumberToUtc(countriesMock[1])).toEqual('UTC+01:00');
      done();
    });
  });
});
