
import { getCurrentProcessState, Status } from './offered-service-process-state';
import { OfferedServiceMock } from '../../offered-service/offered-service.mock';

describe('OfferedServiceProcessState', () => {
  describe('getCurrentProcessState()', () => {
    let offeredService: any;

    beforeEach(() => {
      offeredService = OfferedServiceMock.asMap()['GS0000001-1'];
    });

    it('should be undefined when offered service is not assignable', () => {
      const isAssignable = false;
      const state = getCurrentProcessState(offeredService, isAssignable);
      expect(state).toBeUndefined();
    });

    it('should be OFFERED when offered service is present but not assignable and active', () => {
      const isAssignable = false;
      const isActive = false;
      const state = getCurrentProcessState(offeredService, isAssignable, isActive);
      expect(state?.status).toEqual(Status.OFFERED);
    });

    it('should be NOT_OFFERED', () => {
      offeredService = undefined;
      const state = getCurrentProcessState(offeredService);
      expect(state?.status).toEqual(Status.NOT_OFFERED);
    });

    it('should be OFFERED', () => {
      const state = getCurrentProcessState(offeredService);
      expect(state?.status).toEqual(Status.OFFERED);
    });

    it('should be APPLICANT', () => {
      offeredService = {
        ...offeredService,
        validity: {
          application: true
        }
      };
      const state = getCurrentProcessState(offeredService);
      expect(state?.status).toEqual(Status.APPLICANT);
    });

    it('should be OFFERED_AND_VALID', () => {
      offeredService = {
        ...offeredService,
        validity: {
          valid: true
        }
      };
      const state = getCurrentProcessState(offeredService);
      expect(state?.status).toEqual(Status.OFFERED_AND_VALID);
    });
  });
});
