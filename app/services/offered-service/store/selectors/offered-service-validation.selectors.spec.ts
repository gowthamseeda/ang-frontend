import { OfferedServiceMock } from '../../offered-service.mock';
import { offeredServiceValidationSelectors } from './offered-service-validation.selectors';

describe('Offered Service Validation Selectors', () => {
  const offeredServices = OfferedServiceMock.asList();
  const offeredServiceEntities = OfferedServiceMock.asMap();

  describe('isEmpty()', () => {
    it('should return true when no offered service is offered', () => {
      const result = offeredServiceValidationSelectors.isEmpty.projector({});
      expect(result).toBeTruthy();
    });

    it('should return false when no offered services are offered', () => {
      const result = offeredServiceValidationSelectors.isEmpty.projector(offeredServiceEntities);
      expect(result).toBeFalsy();
    });
  });

  describe('isAtLeastOneOfferedForServiceWith()', () => {
    it('should return true when there is at least one offered service offered for the given service and product category id', () => {
      const serviceId = 1;
      const result = offeredServiceValidationSelectors
        .isAtLeastOneOfferedForServiceWith(serviceId)
        .projector(offeredServices);
      expect(result).toBeTruthy();
    });

    it('should return false when the is no offered service offered for the given service and product category id', () => {
      const serviceId = 1;
      const result = offeredServiceValidationSelectors
        .isAtLeastOneOfferedForServiceWith(serviceId)
        .projector([]);
      expect(result).toBeFalsy();
    });
  });

  describe('isOfferedServiceValidityMaintainedForServiceWith()', () => {
    it('should return true when offeredServiceValidity is maintained for every offered service in current service', () => {
      const serviceId = 1;
      const offeredServicesProjection = [
        offeredServiceEntities['GS0000001-3'],
        {
          ...offeredServiceEntities['GS0000001-4'],
          validity: {
            ...offeredServiceEntities['GS0000001-3'].validity
          }
        }
      ];
      const result = offeredServiceValidationSelectors
        .isOfferedServiceValidityMaintainedForServiceWith(serviceId)
        .projector(offeredServicesProjection);

      expect(result).toBeTruthy();
    });

    it('should return false when validity is not maintained for every offered service in the current service', () => {
      const serviceId = 1;
      const result = offeredServiceValidationSelectors
        .isOfferedServiceValidityMaintainedForServiceWith(serviceId)
        .projector(offeredServices);
      expect(result).toBeFalsy();
    });
  });
});
