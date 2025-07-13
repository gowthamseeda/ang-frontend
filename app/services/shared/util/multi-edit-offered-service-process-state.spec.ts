
import {
  getMultiEditOfferedServiceCurrentProcessState,
  MultiEditOfferedServiceStatus
} from './multi-edit-offered-service-process-state';
import { OfferedServiceMock } from '../../offered-service/offered-service.mock';

describe('MultiEditOfferedServiceProcessState', () => {
  describe('getCurrentProcessState()', () => {
    let offeredService: any;

    beforeEach(() => {
      offeredService = OfferedServiceMock.asMap()['GS0000001-1'];
    });

    it('should be undefined when offered service is not assignable', () => {
      const isAssignable = false;
      const state = getMultiEditOfferedServiceCurrentProcessState(offeredService, isAssignable);
      expect(state).toBeUndefined();
    });

    it('should be OFFERED when offered service is present but not assignable and active', () => {
      const isAssignable = false;
      const isActive = false;
      const state = getMultiEditOfferedServiceCurrentProcessState(
        offeredService,
        isAssignable,
        isActive
      );
      expect(state?.status).toEqual(MultiEditOfferedServiceStatus.OFFERED);
    });

    it('should be NOT_OFFERED', () => {
      offeredService = undefined;
      const state = getMultiEditOfferedServiceCurrentProcessState(offeredService);
      expect(state).toEqual(undefined);
    });

    it('should be OFFERED', () => {
      const state = getMultiEditOfferedServiceCurrentProcessState(offeredService);
      expect(state?.status).toEqual(MultiEditOfferedServiceStatus.OFFERED);
    });

    it('should be APPLICANT', () => {
      offeredService = {
        ...offeredService,
        validity: {
          application: true
        }
      };
      const state = getMultiEditOfferedServiceCurrentProcessState(offeredService);
      expect(state?.status).toEqual(MultiEditOfferedServiceStatus.APPLICANT);
    });

    it('should be OFFERED_AND_VALID', () => {
      offeredService = {
        ...offeredService,
        validity: {
          valid: true
        }
      };
      const state = getMultiEditOfferedServiceCurrentProcessState(offeredService);
      expect(state?.status).toEqual(MultiEditOfferedServiceStatus.OFFERED_AND_VALID);
    });
  });
});
