import { OfferedServiceMock } from '../../offered-service.mock';
import { OfferedService } from '../../offered-service.model';
import { offeredServiceSelectors } from './offered-service.selectors';

describe('Offered Service Selectors', () => {
  const offeredServices = OfferedServiceMock.asList();

  describe('selectAllForServiceWith()', () => {
    const offeredServicesProjection = [
      { serviceId: 1, productCategoryId: 1, brandId: 'MB', productGroupId: 'PC' },
      { serviceId: 1, productCategoryId: 1, brandId: 'MYB', productGroupId: 'PC' }
    ];
    it('should return offered services with matching serviceId', () => {
      const serviceId = 1;
      const selection = (offeredServiceSelectors
        .selectAllForServiceWith(serviceId)
        .projector as any)(offeredServicesProjection);
      expect(selection).toEqual([
        { serviceId: 1, productCategoryId: 1, brandId: 'MB', productGroupId: 'PC' },
        { serviceId: 1, productCategoryId: 1, brandId: 'MYB', productGroupId: 'PC' }
      ]);
    });

    it('should return empty list when serviceId does not match', () => {
      const serviceId = 99;
      const selection = (offeredServiceSelectors
        .selectAllForServiceWith(serviceId)
        .projector as any)(offeredServicesProjection);
      expect(selection).toEqual([]);
    });
  });

  describe('selectById', () => {
    it('should return the offered service for the given ID', () => {
      const offeredService: OfferedService = {
        id: 'GS0000001-1',
        serviceId: 1,
        productCategoryId: 1,
        brandId: 'MB',
        productGroupId: 'PC'
      };
      const selection = offeredServiceSelectors
        .selectById(offeredService.id)
        .projector({ [offeredService.id]: offeredService });
      expect(selection).toEqual(offeredService);
    });
  });

  describe('selectMatchingId', () => {
    it('should return id if offeredService does match', () => {
      const id = (offeredServiceSelectors
        .selectMatchingId(1, 'MB', 'PC')
        .projector as any)(offeredServices, 1);
      expect(id).toEqual('GS0000001-1');
    });
    it('should return undefined when no offeredService was found', () => {
      const id = (offeredServiceSelectors
        .selectMatchingId(199, 'MB', 'PC')
        .projector as any)(offeredServices, 1);
      expect(id).toEqual(undefined);
    });
  });

  describe('extractOfferedServiceUniqueBrandProductGroups()', () => {
    it('should extract all offeredService brandProductGroups from the given projection', () => {
      const offeredServicesProjection = [
        { serviceId: 1, productCategoryId: 1, brandId: 'MB', productGroupId: 'PC' },
        { serviceId: 1, productCategoryId: 1, brandId: 'MB', productGroupId: 'PC' }
      ];
      const selection = (offeredServiceSelectors.extractOfferedServiceUniqueBrandProductGroups.projector as any)(
        offeredServicesProjection
      );
      expect(selection).toEqual([{ brandId: 'MB', productGroupId: 'PC' }]);
    });
  });

  describe('selectCompanySisterOutletsFullResponse', () => {
  it('should return both sisterOutlets and offeredServices from the state', () => {
    const state = {
      sisterOutlets: {
        sisterOutlets: [{ id: 'GS01' }],
        offeredServices: [{ id: 'OS1', brandId: 'MB', productCategoryId: 1, productGroupId: 'PC', serviceId: 1 }]
      }
    };

    const result = offeredServiceSelectors.selectCompanySisterOutletsFullResponse.projector(state.sisterOutlets);
    expect(result).toEqual({
      sisterOutlets: [{ id: 'GS01' }],
      offeredServices: [{ id: 'OS1', brandId: 'MB', productCategoryId: 1, productGroupId: 'PC', serviceId: 1 }]
    });
  });
})
});
