import { of } from 'rxjs';

import { contractMock } from './contract.mock';
import { Contract } from './contract.model';

describe('Contract', () => {
  describe('filterBy', () => {
    it('should filter by given params', done => {
      const offeredService = contractMock[0].offeredService;

      of(contractMock)
        .pipe(
          Contract.filterBy(offeredService.productCategoryId, offeredService.serviceId, undefined)
        )
        .subscribe(contracts => {
          expect(contracts).toEqual([contractMock[0]]);
          done();
        });
    });
  });

  describe('mapToBrandProductGroupIds', () => {
    it('should map contracts to product group IDs', () => {
      const expected = [
        { brandId: 'MB', productGroupId: 'PC' },
        { brandId: 'MB', productGroupId: 'PC' }
      ];

      expect(Contract.mapToBrandProductGroupIds(contractMock)).toEqual(expected);
    });
  });

  describe('mapToBrandProductGroupsContractees', () => {
    it('should map contracts to contractees of type BrandProductGroupsData', () => {
      const offeredService = contractMock[0].offeredService;
      const expected = [
        {
          brandProductGroupIds: [
            { brandId: offeredService.brandId, productGroupId: offeredService.productGroupId },
            { brandId: offeredService.brandId, productGroupId: offeredService.productGroupId }
          ],
          data: contractMock[0].contractee
        }
      ];

      expect(Contract.mapToBrandProductGroupsContractees(contractMock)).toEqual(expected);
    });
  });
});
