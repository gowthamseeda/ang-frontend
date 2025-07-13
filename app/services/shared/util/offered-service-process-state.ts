import { OfferedService } from '../../offered-service/offered-service.model';

export enum Status {
  NOT_ASSIGNABLE = 'not_assignable',
  NOT_OFFERED = 'not_offered',
  OFFERED = 'offered',
  APPLICANT = 'applicant',
  OFFERED_AND_VALID = 'offered_and_valid'
}

export interface ProcessState {
  status: Status;
  icon: string;
  action?: Function;
}

const isOffered = (offeredService: OfferedService | undefined): boolean => !!offeredService;

const isApplicant = (offeredService: OfferedService | undefined): boolean =>
  (offeredService && offeredService.validity && offeredService.validity.application) || false;

const isOfferedAndValid = (offeredService: OfferedService | undefined): boolean =>
  !!(offeredService && offeredService.validity && offeredService.validity.valid);

const processStates = (status: string, productGroup?: string) => {
  switch (status) {
    case Status.OFFERED:
      return {
        status: Status.OFFERED,
        icon: productGroup
          ? 'os-planned'.concat('-pg-', productGroup?.toLowerCase() ?? '')
          : 'os-planned'
      };
    case Status.APPLICANT:
      return {
        status: Status.APPLICANT,
        icon: 'os-applicant'
      };
    case Status.OFFERED_AND_VALID:
      return {
        status: Status.OFFERED_AND_VALID,
        icon: 'os-offered-and-valid'
      };

    case Status.NOT_OFFERED:
      return {
        status: Status.NOT_OFFERED,
        icon: 'plus'
      };
  }
};

export const getProcessState = (status: Status, productGroup?: string) =>
  processStates(status, productGroup);

export const getCurrentProcessState = (
  offeredService: OfferedService | undefined,
  isAssignable = true,
  isActive = true
): ProcessState | undefined => {
  let status = Status.NOT_ASSIGNABLE;
  if (isAssignable && !isOffered(offeredService)) {
    status = Status.NOT_OFFERED;
  }

  if (isAssignable || !isActive) {
    if (isOffered(offeredService)) {
      status = Status.OFFERED;
    }

    if (isApplicant(offeredService)) {
      status = Status.APPLICANT;
    }

    if (isOfferedAndValid(offeredService)) {
      status = Status.OFFERED_AND_VALID;
    }
  }

  return processStates(status, offeredService?.productGroupId);
};
