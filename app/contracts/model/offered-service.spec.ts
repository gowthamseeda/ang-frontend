import { of } from 'rxjs';

import { offeredServiceMock } from './offered-service.mock';
import { OfferedService } from './offered-service.model';

describe('OfferedService', () => {
  describe('filterBy', () => {
    it('should filter by given params', done => {
      of(offeredServiceMock)
        .pipe(
          OfferedService.filterBy(
            offeredServiceMock[0].productCategoryId,
            offeredServiceMock[0].serviceId,
            undefined
          )
        )
        .subscribe(offeredService => {
          expect(offeredService).toEqual([offeredServiceMock[0]]);
          done();
        });
    });
  });

  describe('mapToBrandProductGroupIds', () => {
    it('should map offered services to product group IDs', () => {
      const expected = [
        { brandId: 'MB', productGroupId: 'PC' },
        { brandId: 'MB', productGroupId: 'PC' },
        { brandId: 'MB', productGroupId: 'PC' }
      ];

      expect(OfferedService.mapToBrandProductGroupIds(offeredServiceMock)).toEqual(expected);
    });
  });

  describe('compareBy', () => {
    it('should compare by given params', () => {
      const {
        productCategoryId,
        brandId,
        productGroupId,
        serviceId,
        serviceCharacteristicId
      } = offeredServiceMock[0];
      const compareOfferedService = OfferedService.compareBy(
        productCategoryId,
        brandId,
        productGroupId,
        serviceId,
        serviceCharacteristicId
      );

      expect([offeredServiceMock[0]].find(compareOfferedService)).toBeTruthy();
    });
  });
});
