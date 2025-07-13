import { TestBed } from '@angular/core/testing';
import { createSpyFromClass } from 'jest-auto-spies';
import { BehaviorSubject, of } from 'rxjs';

import { LegalStructureRoutingService } from '../../legal-structure/legal-structure-routing.service';

import { DistributionLevelsService } from './distribution-levels.service';
import { DistributionLevelCollectionService } from './store/distribution-level-collection.service';
import { DistributionLevelEntity } from './store/distribution-level-entity.model';

describe('DistributionLevelsService', () => {
  let service: DistributionLevelsService;
  let legalStructureRoutingServiceStub;
  let distributionLevelCollectionServiceSpy;

  beforeEach(() => {
    legalStructureRoutingServiceStub = {
      outletIdChanges: new BehaviorSubject<string>('')
    };

    distributionLevelCollectionServiceSpy = {
      ...createSpyFromClass(DistributionLevelCollectionService),
      loading$: of(false),
      entityMap$: of({
        GS00000001: { distributionLevels: ['RETAILER'] } as DistributionLevelEntity
      })
    };

    distributionLevelCollectionServiceSpy.getByKey.nextWith({});
    distributionLevelCollectionServiceSpy.update.nextWith({});

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        DistributionLevelsService,
        { provide: LegalStructureRoutingService, useValue: legalStructureRoutingServiceStub },
        {
          provide: DistributionLevelCollectionService,
          useValue: distributionLevelCollectionServiceSpy
        }
      ]
    });

    service = TestBed.inject(DistributionLevelsService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should get the distribution levels for a specific outlet from the store', done => {
      service.get('GS00000001').subscribe(distributionLevels => {
        expect(distributionLevels).toEqual(['RETAILER']);
        done();
      });
    });

    it('should not trigger load when distribution levels are already in the store', done => {
      service.get('GS00000001').subscribe(() => {
        expect(distributionLevelCollectionServiceSpy.getByKey).not.toHaveBeenCalled();
        done();
      });
    });

    it('should trigger load when distribution levels are not in the store', done => {
      service.get('XXX').subscribe(() => {
        expect(distributionLevelCollectionServiceSpy.getByKey).toHaveBeenCalledWith('XXX');
        done();
      });
    });
  });

  describe('getDistributionLevelsOfOutlet', () => {
    it('should get the distribution levels of the current outlet from the store', done => {
      legalStructureRoutingServiceStub.outletIdChanges.next('GS00000001');

      service.getDistributionLevelsOfOutlet().subscribe(distributionLevels => {
        expect(distributionLevels).toEqual(['RETAILER']);
        done();
      });
    });
  });

  describe('update', () => {
    it('should update distribution levels for a specific outlet', done => {
      let updated = false;
      service.update('GS00000002', ['WHOLESALER']).subscribe(() => {
        updated = true;
        done();
      });
      expect(updated).toBeTruthy();
    });
  });

  describe('isDistributionLevelEditable', () => {
    it('should return true, RETAILER is editable, because outlet is applicant only', () => {
      const isEditable = service.isDistributionLevelEditable(['APPLICANT'], 'RETAILER');
      expect(isEditable).toBeTruthy();
    });

    it('should return true, APPLICANT is editable, because outlet is APPLICANT', () => {
      const isEditable = service.isDistributionLevelEditable(
        ['APPLICANT', 'WHOLESALER'],
        'APPLICANT'
      );
      expect(isEditable).toBeTruthy();
    });
  });
});
