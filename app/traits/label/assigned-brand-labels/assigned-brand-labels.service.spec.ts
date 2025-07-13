import { TestBed } from '@angular/core/testing';
import { of, combineLatest } from 'rxjs';

import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { TestingModule } from '../../../testing/testing.module';

import { AssignedBrandLabel } from './assigned-brand-label';
import { AssignedBrandLabelsService } from './assigned-brand-labels.service';

describe('AssignedBrandLabelsService', () => {
  let service: AssignedBrandLabelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [AssignedBrandLabelsService, ApiService, LoggingService]
    });

    service = TestBed.inject(AssignedBrandLabelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBrandLabelAssignments()', () => {
    it('should get assigned brand labels for a specific outlet from the label contract', () => {
      service
        .getBrandLabelAssignments('GS00000002')
        .subscribe((assignments: AssignedBrandLabel[]) => {
          expect(assignments).toEqual([{ labelId: 1, brandId: 'MB', name: 'Authorized Dealer' }]);
        });
    });
  });

  describe('save() - create', () => {
    it('should save brand labels for a specific outlet', () => {
      const post = jest.spyOn(TestBed.inject(ApiService), 'post').mockReturnValue(of());

      service.save('GS00000003', [{ brandId: 'SMT', labelId: 1 }], []).subscribe(() => {});

      expect(post).toHaveBeenCalled();
    });
  });

  describe('save() - delete', () => {
    it('should save brand labels for a specific outlet', () => {
      const deleteCall = jest.spyOn(TestBed.inject(ApiService), 'delete').mockReturnValue(of());

      service.save('GS00000002', [], [{ brandId: 'MB', labelId: 1 }]).subscribe(() => {});

      expect(deleteCall).toHaveBeenCalled();
    });
  });

  it('should not load from contract when brand codes are cached', done => {
    const apiService = TestBed.inject(ApiService);
    const apiServiceSpy = jest.spyOn(apiService, 'get');

    combineLatest([
      service.getBrandLabelAssignments('GS00000002'),
      service.getBrandLabelAssignments('GS00000002')
    ]).subscribe(() => {
      done();
    });

    expect(apiServiceSpy).toHaveBeenCalledTimes(1);
  });
});
