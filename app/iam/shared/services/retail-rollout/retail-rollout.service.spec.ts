import { TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { getOutletMock } from '../../../../legal-structure/shared/models/outlet.mock';
import { OutletService } from '../../../../legal-structure/shared/services/outlet.service';
import { TestingModule } from '../../../../testing/testing.module';
import { RetailRolloutService } from './retail-rollout.service';
import { RetailCountryService } from '../../../../geography/retail-county/retail-country.service';

describe('RetailRolloutService', () => {
  let service: RetailRolloutService;
  let outletServiceSpy: Spy<OutletService>;
  let retailCountryServiceSpy: Spy<RetailCountryService>

  beforeEach(() => {
    outletServiceSpy = createSpyFromClass(OutletService);
    retailCountryServiceSpy = createSpyFromClass(RetailCountryService)

    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        RetailRolloutService,
        {
          provide: OutletService,
          useValue: outletServiceSpy
        },
        {
          provide: RetailCountryService,
          useValue: retailCountryServiceSpy
        }
      ]
    });
    service = TestBed.inject(RetailRolloutService);
  });

  describe('isRolledOutFor()', () => {
    it('should return true if retail has been rolled out for the country of the given business site ID', done => {
      outletServiceSpy.getOrLoadBusinessSite.nextWith({ ...getOutletMock(), countryId: 'PT' });
      retailCountryServiceSpy.getAllIds.nextWith(['PT'])

      service.isRolledOutFor('GS001').subscribe(isRolledOut => {
        expect(isRolledOut).toBeTruthy();
        done();
      });
    });

    it('should return false if retail has not been rolled out for the country of the given business site ID', done => {
      outletServiceSpy.getOrLoadBusinessSite.nextWith({ ...getOutletMock(), countryId: 'XX' });
      retailCountryServiceSpy.getAllIds.nextWith(['PT'])

      service.isRolledOutFor('GS001').subscribe(isRolledOut => {
        expect(isRolledOut).toBeFalsy();
        done();
      });
    });
  });
});
