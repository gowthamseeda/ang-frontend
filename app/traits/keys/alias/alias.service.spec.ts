import { TestBed } from '@angular/core/testing';
import { combineLatest } from 'rxjs';

import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { TestingModule } from '../../../testing/testing.module';

import { AliasService } from './alias.service';

describe('AliasService', () => {
  let service: AliasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [AliasService, ApiService, LoggingService]
    });

    service = TestBed.inject(AliasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get()', () => {
    it('should get alias for a specific business site from the traits contract', () => {
      service.get('GS00000016').subscribe(alias => {
        expect(alias).toEqual({ alias: 'Schröder' });
      });
    });

    it('should not load from contract when alias is cached', done => {
      const apiService = TestBed.inject(ApiService);
      const apiServiceSpy = jest.spyOn(apiService, 'get');

      combineLatest([service.get('GS00000016'), service.get('GS00000016')]).subscribe(() => {
        done();
      });

      expect(apiServiceSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('update()', () => {
    it('should update alias for a specific business site from the traits contract', () => {
      let updated = false;
      service.update('GS00000015', { alias: 'Mercedes-Benz Berlin' }).subscribe(() => {
        updated = true;
      });

      expect(updated).toBeTruthy();
    });
  });

  describe('delete()', () => {
    it('should delete a alias for a specific business site from the traits contract', () => {
      let deleted = false;

      service.delete('GS00000015').subscribe(() => {
        deleted = true;
      });

      expect(deleted).toBeTruthy();
    });
  });
});
