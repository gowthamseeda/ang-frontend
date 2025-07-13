import { TestBed } from '@angular/core/testing';
import { combineLatest, of, throwError } from 'rxjs';

import { TestingModule } from '../../testing/testing.module';
import { ApiService } from '../services/api/api.service';
import { LoggingService } from '../services/logging/logging.service';

import { Cache } from './cache';

interface CachedValue {
  content: string;
}

describe('Cache', () => {
  let cache: Cache<CachedValue>;
  let apiService: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [ApiService, LoggingService]
    }).compileComponents();

    apiService = TestBed.inject(ApiService);
    cache = new Cache<CachedValue>(apiService, url => url + 'X');
  });

  describe('getOrLoad', () => {
    it('should get the value for the given key', done => {
      const expectedValue: CachedValue = { content: 'something' };
      jest.spyOn(apiService, 'get').mockReturnValue(of(expectedValue));

      cache.getOrLoad('GS001').subscribe(value => {
        expect(value).toBe(expectedValue);
        done();
      });
    });

    it('should propagate thrown errors', done => {
      jest.spyOn(apiService, 'get').mockReturnValue(throwError('ERROR'));

      cache.getOrLoad('GS001').subscribe(
        () => {},
        error => {
          expect(error).toBe('ERROR');
          done();
        }
      );
    });

    it('should use the provided URL builder', done => {
      const apiServiceSpy = jest.spyOn(apiService, 'get').mockReturnValue(of({}));

      cache.getOrLoad('GS001').subscribe(() => {
        expect(apiServiceSpy).toHaveBeenCalledWith('GS001X');
        done();
      });
    });

    it('should only make one API call when getting the same key twice', done => {
      const apiServiceSpy = jest.spyOn(apiService, 'get').mockReturnValue(of({}));

      combineLatest([cache.getOrLoad('GS001'), cache.getOrLoad('GS001')]);
      cache.getOrLoad('GS001').subscribe(() => {
        expect(apiServiceSpy).toBeCalledTimes(1);
        done();
      });
    });

    it('should make multiple API calls when getting different keys', done => {
      const apiServiceSpy = jest.spyOn(apiService, 'get').mockReturnValue(of({}));

      combineLatest([cache.getOrLoad('GS001'), cache.getOrLoad('GS002')]);
      cache.getOrLoad('GS001').subscribe(() => {
        expect(apiServiceSpy).toBeCalledTimes(2);
        done();
      });
    });
  });
});
