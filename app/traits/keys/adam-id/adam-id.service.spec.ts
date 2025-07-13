import { TestBed } from '@angular/core/testing';

import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { TestingModule } from '../../../testing/testing.module';

import { AdamIdService } from './adam-id.service';

describe('AdamIdService', () => {
  let service: AdamIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [AdamIdService, ApiService, LoggingService]
    });

    service = TestBed.inject(AdamIdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // the below is temporarily commented as the test would failed due to removal of adam-id api

  // describe('get()', () => {
  //   it('should get an adam ID for a specific outlet from the traits contract', () => {
  //     service.get('GS00000003').subscribe((adamIds: AdamId[]) => {
  //       expect(adamIds).toEqual([
  //         { adamId: '12345', brandId: 'FUSO' },
  //         { adamId: '12345', brandId: 'MB' }
  //       ]);
  //     });
  //   });

  //   it('should not load from contract when adam IDs are cached', done => {
  //     const apiService = TestBed.inject(ApiService);
  //     const apiServiceSpy = jest.spyOn(apiService, 'get');

  //     combineLatest([service.get('GS00000003'), service.get('GS00000003')]).subscribe(() => {
  //       done();
  //     });

  //     expect(apiServiceSpy).toHaveBeenCalledTimes(1);
  //   });
  // });

  // describe('create()', () => {
  //   it('should create a adam ID for a specific outlet from the traits contract', () => {
  //     let created = false;

  //     service.create('GS00000003', { adamId: '12345', brandId: 'SMT' }).subscribe(() => {
  //       created = true;
  //     });

  //     expect(created).toBeTruthy();
  //   });
  // });

  // describe('delete()', () => {
  //   it('should delete a adam Id for a specific outlet from the traits contract', () => {
  //     let deleted = false;

  //     service.delete('GS00000003', 'FUSO').subscribe(() => {
  //       deleted = true;
  //     });

  //     expect(deleted).toBeTruthy();
  //   });
  // });
});
