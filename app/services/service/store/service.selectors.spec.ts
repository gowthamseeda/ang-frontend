import { ServiceMock } from '../models/service.mock';

import { serviceSelectors } from './service.selectors';

describe('Service Selectors', () => {
  const serviceEntities = ServiceMock.asList();

  describe('selectBy()', () => {
    it('should return valid service', () => {
      const serviceId = 1;
      const service = (serviceSelectors.selectBy(serviceId).projector as any)(serviceEntities);
      expect(service).toEqual(serviceEntities[serviceId]);
    });

    it('should return undefined value', () => {
      const serviceId = 999;
      const service = (serviceSelectors.selectBy(serviceId).projector as any)(serviceEntities);
      expect(service).toEqual(undefined);
    });
  });

  describe('selectValidServices', () => {
    it('should return services with matching service variants and offered services', () => {
      const servicesWithServiceVariants = [serviceEntities[1]];
      const servicesWithOfferedServices = [serviceEntities[2]];
      const result = serviceSelectors.selectValidServices.projector(
        servicesWithServiceVariants,
        servicesWithOfferedServices
      );
      expect(result).toEqual(
        expect.arrayContaining([
          expect.objectContaining(serviceEntities[1]),
          expect.objectContaining(serviceEntities[2])
        ])
      );
    });

    it('should return empty list when no service variants and offered services were found', () => {
      const servicesWithServiceVariants = [];
      const servicesWithOfferedServices = [];
      const result = serviceSelectors.selectValidServices.projector(
        servicesWithServiceVariants,
        servicesWithOfferedServices
      );
      expect(result).toEqual([]);
    });
  });
});
