import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { TestingModule } from '../../../testing/testing.module';
import { outletRelationshipsMock } from '../models/outlet-relationships.mock';

import { OutletRelationshipsService } from './outlet-relationships.service';

const businessSiteId = 'GS0000001';

describe('OutletRelationshipsService', () => {
  let outletRelationshipsService: OutletRelationshipsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [OutletRelationshipsService, ApiService, LoggingService]
    });
    outletRelationshipsService = TestBed.inject(OutletRelationshipsService);
  });

  it('should be created', () => {
    expect(outletRelationshipsService).toBeTruthy();
  });

  describe('get outlet relationships', () => {
    it('should get outlet relationships', () => {
      jest.spyOn(outletRelationshipsService, 'get').mockReturnValue(
        of(outletRelationshipsMock.outletRelationships)
      );
      outletRelationshipsService.get(businessSiteId).subscribe(outletRelationships => {
        expect(outletRelationships).toMatchObject(outletRelationshipsMock.outletRelationships);
      });
    });

    it('should return empty array if outlet relationships do not exist', () => {
      jest.spyOn(outletRelationshipsService, 'get').mockReturnValue(throwError({ status: 404 }));
      outletRelationshipsService.get(businessSiteId).subscribe(outletRelationships => {
        expect(outletRelationships).toMatchObject([]);
      });
    });
  });

  it('should update outlet relationships', () => {
    jest.spyOn(outletRelationshipsService, 'update').mockReturnValue(of({ status: 'UPDATED' }));
    outletRelationshipsService
      .update(businessSiteId, outletRelationshipsMock)
      .subscribe(response => {
        expect(response).toMatchObject({ status: 'UPDATED' });
      });
  });
});
