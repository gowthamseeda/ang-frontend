import { TestBed } from '@angular/core/testing';
import { combineLatest } from 'rxjs';

import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { TestingModule } from '../../../testing/testing.module';

import { DuplicateFederalIdsResource, FederalIdService } from './federal-id.service';

describe('FederalIdService', () => {
  let service: FederalIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [FederalIdService, ApiService, LoggingService]
    });

    service = TestBed.inject(FederalIdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get()', () => {
    it('should get federal ID for a specific business site from the traits contract', done => {
      service.get('GS00000021').subscribe(federalId => {
        expect(federalId).toEqual({ federalId: '12345-BOSTON' });
        done();
      });
    });
  });

  describe('update()', () => {
    it('should update federal ID for a specific business site from the traits contract', done => {
      let updated = false;
      service.update('GS00000021', { federalId: '12345-BOSTON-changed' }).subscribe(() => {
        updated = true;
        done();
      });

      expect(updated).toBeTruthy();
    });
  });

  describe('delete()', () => {
    it('should delete a federal ID for a specific business site from the traits contract', done => {
      let deleted = false;

      service.delete('GS00000021').subscribe(() => {
        deleted = true;
        done();
      });

      expect(deleted).toBeTruthy();
    });
  });

  describe('getDuplicateFederalIdsBy()', () => {
    it('should get duplicate federal IDs', done => {
      service
        .getDuplicateFederalIdsBy('GS00000021')
        .subscribe((duplicate: DuplicateFederalIdsResource) => {
          expect(duplicate).toEqual({
            duplicateFederalIds: [
              {
                businessSiteId: 'GS00000022',
                federalId: '12345-BOSTON'
              }
            ]
          });
          done();
        });
    });

    it('should not load from contract when federal ID is cached', done => {
      const apiService = TestBed.inject(ApiService);
      const apiServiceSpy = jest.spyOn(apiService, 'get');

      combineLatest([service.get('GS00000021'), service.get('GS00000021')]).subscribe(() => {
        done();
      });

      expect(apiServiceSpy).toHaveBeenCalledTimes(1);
    });
  });
});
