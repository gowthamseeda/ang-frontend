import { of } from 'rxjs';

import { BrandProductGroup } from '../brand-product-group/brand-product-group.model';
import { OfferedServiceValidity } from '../validity/validity.model';

import { OfferedServiceMock } from './offered-service.mock';
import { OfferedService } from './offered-service.model';

describe('Offered Service', () => {
  describe('mapToProductGroups', () => {
    it('should map stream of offered services to product groups', done => {
      const offeredServices = of([OfferedServiceMock.asList()[0]]);
      const expected = [{ brandId: 'MB', productGroupId: 'PC' } as BrandProductGroup];

      offeredServices.pipe(OfferedService.mapToProductGroups()).subscribe(productGroups => {
        expect(productGroups).toEqual(expected);
        done();
      });
    });
  });

  describe('mapToValidities', () => {
    it('should map stream of offered services to validities', done => {
      const offeredServices = of([OfferedServiceMock.asList()[2]]);
      const expected = [
        {
          id: 'GS0000001-3',
          validity: {
            application: true,
            applicationValidUntil: '2019-01-01',
            valid: true,
            validFrom: '2019-01-02',
            validUntil: '2019-01-31'
          }
        } as OfferedServiceValidity
      ];

      offeredServices
        .pipe(OfferedService.mapToValidities())
        .subscribe((validities: OfferedServiceValidity[]) => {
          expect(validities).toEqual(expected);
          done();
        });
    });
  });

  describe('mapToValiditiesWithBrandProductGroup', () => {
    it('should map stream of offered services to validities with product group', done => {
      const offeredServices = of([OfferedServiceMock.asList()[2]]);
      const expected = [
        {
          id: 'GS0000001-3',
          brandId: 'MB',
          productCategoryId: 2,
          productGroupId: 'PC',
          serviceId: 2,
          validity: {
            application: true,
            applicationValidUntil: '2019-01-01',
            validFrom: '2019-01-02',
            validUntil: '2019-01-31',
            valid: true
          }
        } as OfferedServiceValidity & BrandProductGroup
      ];

      offeredServices
        .pipe(OfferedService.mapToValiditiesWithBrandProductGroup())
        .subscribe(
          (validitiesWithBrandProductGroup: (OfferedServiceValidity & BrandProductGroup)[]) => {
            expect(validitiesWithBrandProductGroup).toEqual(expected);
            done();
          }
        );
    });
  });

   describe('BusinessSite fields', () => {
    it('should support countryId and distributionLevels in BusinessSite', () => {
      const offeredService: OfferedService = {
        id: 'GS0000001-1',
        brandId: 'MB',
        productCategoryId: 1,
        productGroupId: 'PC',
        serviceId: 1,
        businessSite: {
          id: 'GS0000001',
          countryId: 'CH',
          distributionLevels: ['RETAILER', 'APPLICANT']
        }
      };

      expect(offeredService.businessSite?.id).toBe('GS0000001');
      expect(offeredService.businessSite?.countryId).toBe('CH');
      expect(offeredService.businessSite?.distributionLevels).toEqual(['RETAILER', 'APPLICANT']);
    });
  });
});
