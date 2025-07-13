import { Service } from '../reducers';
import { initialState as initialStateOpeningHoursService } from '../reducers/service.reducers';

import {
  selectOpeningHoursServiceCharacteristic,
  selectOpeningHoursServiceState
} from './service-selectors';

describe('ServiceSelectors ', () => {
  describe('selectOpeningHoursServiceState', () => {
    test('returns opening hours service from store', () => {
      const state = {
        service: initialStateOpeningHoursService
      };
      const selection = (selectOpeningHoursServiceState.projector as any)(state);
      expect(selection).toStrictEqual(state.service);
    });
  });

  describe('selectOpeningHoursServiceState', () => {
    test('should return service name', () => {
      const serviceName = 'New Vehicle Sales';
      const serviceState = {
        service: {
          ...initialStateOpeningHoursService,
          serviceName: serviceName
        }
      };
      const selection = (selectOpeningHoursServiceState.projector as any)(serviceState);
      expect(selection.serviceName).toBe(serviceName);
    });
  });

  describe('selectOpeningHoursServiceCharacteristic', () => {
    test('should return service characteristic', () => {
      const serviceCharacteristicName = 'Mercedes ServiceCard';
      const serviceState: Service = {
        ...initialStateOpeningHoursService,
        serviceCharacteristicName: serviceCharacteristicName
      };
      const selection = selectOpeningHoursServiceCharacteristic.projector(serviceState);
      expect(selection).toBe(serviceCharacteristicName);
    });
  });
});
