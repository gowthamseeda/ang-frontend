import { serviceVariantSelectors } from './service-variant.selectors';
import { ServiceVariantMock } from '../service-variant.mock';

describe('Service Variants Selectors', () => {
  const serviceVariants = ServiceVariantMock.asList();
  const serviceVariantEntities = ServiceVariantMock.asMap();

  describe('selectAllForServiceWith()', () => {
    const serviceVariantsProjection = [
      serviceVariantEntities[1],
      serviceVariantEntities[2],
      serviceVariantEntities[3]
    ];

    it('should return service variants with matching serviceId', () => {
      const serviceId = 120;
      const selection = serviceVariantSelectors
        .selectAllForServiceWith(serviceId)
        .projector(serviceVariantsProjection);
      expect(selection).toEqual([serviceVariantEntities[1], serviceVariantEntities[2]]);
    });

    it('should return empty list', () => {
      const serviceId = 18;
      const selection = serviceVariantSelectors
        .selectAllForServiceWith(serviceId)
        .projector(serviceVariantsProjection);
      expect(selection).toEqual([]);
    });
  });

  describe('extractUniqueBrandProductGroups()', () => {
    it('should extract all brandProductGroups from the given projection', () => {
      const serviceVariantsProjection = [
        serviceVariantEntities[1],
        serviceVariantEntities[2],
        serviceVariantEntities[3]
      ];
      const selection =
        serviceVariantSelectors.extractUniqueBrandProductGroups.projector(
          serviceVariantsProjection
        );
      expect(selection).toEqual([{ brandId: 'MB', productGroupId: 'PC' }]);
    });
  });

  describe('selectBy()', () => {
    it('should select the correct ID for a service variant', () => {
      const serviceId = 120;
      const brandId = 'MB';
      const productGroupId = 'PC';

      const selection = serviceVariantSelectors
        .selectBy(serviceId, brandId, productGroupId)
        .projector(serviceVariants);
      expect(selection).toEqual(serviceVariants[0]);
    });

    it('should select undefined when the given parameters match no variant', () => {
      const serviceId = 1;
      const brandId = 'MB';
      const productGroupId = 'VAN';

      const selection = serviceVariantSelectors
        .selectBy(serviceId, brandId, productGroupId)
        .projector(serviceVariants);
      expect(selection).toEqual(undefined);
    });
  });

  describe('isEmpty()', () => {
    it('should return true when no service variant', () => {
      const result = (serviceVariantSelectors.isEmpty.projector as any)({});
      expect(result).toBeTruthy();
    });

    it('should return false when no service service', () => {
      const result = (serviceVariantSelectors.isEmpty.projector as any)(serviceVariantEntities);
      expect(result).toBeFalsy();
    });
  });
});
