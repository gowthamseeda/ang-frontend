import { of } from 'rxjs';

import { brandProductGroupIdMock } from './brand-product-group-id.mock';
import { OfferedService } from './offered-service.model';
import { offeredServiceMock } from './offered-service.mock';
import containingAny = OfferedService.containingAny;
import mapToBrandProductGroupIds = OfferedService.mapToBrandProductGroupIds;
import filterBy = OfferedService.filterBy;

describe('OfferedService', () => {
  describe('filterBy', () => {
    it('should filter by given params', done => {
      of([offeredServiceMock[0], offeredServiceMock[1], offeredServiceMock[2]])
        .pipe(
          filterBy(
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
        { brandId: 'MB', productGroupId: 'VAN' }
      ];
      const result = mapToBrandProductGroupIds([
        offeredServiceMock[0],
        offeredServiceMock[1],
        offeredServiceMock[2]
      ]);

      expect(result).toEqual(expected);
    });
  });

  describe('containingAny', () => {
    it('should only return offered services which contain any of the given brandProductGroupIds', () => {
      const result = containingAny([brandProductGroupIdMock[0], brandProductGroupIdMock[2]])([
        offeredServiceMock[0],
        offeredServiceMock[1],
        offeredServiceMock[2]
      ]);
      expect(result).toEqual([offeredServiceMock[0], offeredServiceMock[1]]);
    });
  });
});
