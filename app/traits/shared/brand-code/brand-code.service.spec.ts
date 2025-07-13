import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, combineLatest } from 'rxjs';

import { LegalStructureRoutingService } from '../../../legal-structure/legal-structure-routing.service';
import { ApiService } from '../../../shared/services/api/api.service';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { TestingModule } from '../../../testing/testing.module';

import { BrandCode } from './brand-code.model';
import {
  BrandCodeService,
  DuplicateAdamIdsResource,
  DuplicateBrandCodesResource
} from './brand-code.service';

class LegalStructureRoutingServiceStub {
  outletIdChanges = new BehaviorSubject<string>('');
}

describe('BrandCodeService', () => {
  let service: BrandCodeService;
  const legalStructureRoutingServiceStub = new LegalStructureRoutingServiceStub();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        BrandCodeService,
        ApiService,
        LoggingService,
        { provide: LegalStructureRoutingService, useValue: legalStructureRoutingServiceStub }
      ]
    });

    service = TestBed.inject(BrandCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get()', () => {
    it('should get brand codes for a specific outlet from the traits contract', () => {
      service.get('GS00000003').subscribe((brandCodes: BrandCode[]) => {
        expect(brandCodes).toEqual([
          { brandCode: '12346', brandId: 'FUSO' },
          { brandCode: '12345', brandId: 'MB' }
        ]);
      });
    });

    it('should not load from contract when brand codes are cached', done => {
      const apiService = TestBed.inject(ApiService);
      const apiServiceSpy = jest.spyOn(apiService, 'get');

      combineLatest([service.get('GS00000003'), service.get('GS00000003')]).subscribe(() => {
        done();
      });

      expect(apiServiceSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getDuplicateBrandCodesBy()', () => {
    it('should get duplicate brand codes', () => {
      service
        .getDuplicateBrandCodesBy('GS00000017')
        .subscribe((duplicate: DuplicateBrandCodesResource) => {
          expect(duplicate).toEqual({
            duplicateBrandCodes: [
              {
                businessSiteId: 'GS00000018',
                brandId: 'FUSO',
                brandCode: 'DUPLICATE'
              }
            ]
          });
        });
    });
  });

  describe('getDuplicateAdamIdsBy()', () => {
    it('should get duplicate adam IDs', () => {
      service
        .getDuplicateAdamIdsBy('GS00000019')
        .subscribe((duplicate: DuplicateAdamIdsResource) => {
          expect(duplicate).toEqual({
            duplicateAdamIds: [
              {
                businessSiteId: 'GS00000020',
                brandId: 'FUSO',
                adamId: 'DUPLICATE'
              }
            ]
          });
        });
    });
  });

  describe('update()', () => {
    it('should update brand codes for a specific outlet from the traits contract', () => {
      let updated = false;
      service.update('GS00000003', { brandCode: 'new01234', brandId: 'FUSO' }).subscribe(() => {
        updated = true;
      });

      expect(updated).toBeTruthy();
    });
  });

  describe('create()', () => {
    it('should create a brand code for a specific outlet from the traits contract', () => {
      let created = false;

      service.create('GS00000003', { brandCode: '12347', brandId: 'SMT' }).subscribe(() => {
        created = true;
      });

      expect(created).toBeTruthy();
    });
  });

  describe('delete()', () => {
    it('should delete a brand code for a specific outlet from the traits contract', () => {
      let deleted = false;

      service.delete('GS00000003', 'FUSO').subscribe(() => {
        deleted = true;
      });

      expect(deleted).toBeTruthy();
    });
  });
});
