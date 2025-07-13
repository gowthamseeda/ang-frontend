import { OfferedService } from '../../offered-service/offered-service.model';

export enum MultiEditOfferedServiceStatus {
  NOT_ASSIGNABLE = 'not_assignable',
  NOT_OFFERED = 'not_offered',
  OFFERED = 'offered',
  APPLICANT = 'applicant',
  OFFERED_AND_VALID = 'offered_and_valid'
}

export interface MultiEditOfferedServiceProcessState {
  status: MultiEditOfferedServiceStatus;
  defaultIcon: string;
  hoverIcon?: string;
  selectedIcon?: string;
}

const isOffered = (offeredService: OfferedService | undefined): boolean => !!offeredService;

const isApplicant = (offeredService: OfferedService | undefined): boolean =>
  (offeredService && offeredService.validity && offeredService.validity.application) || false;

const isOfferedAndValid = (offeredService: OfferedService | undefined): boolean =>
  !!(offeredService && offeredService.validity && offeredService.validity.valid);

const multiEditOfferedServiceProcessState = (
  status: string
): MultiEditOfferedServiceProcessState | undefined => {
  switch (status) {
    case MultiEditOfferedServiceStatus.OFFERED:
      return {
        status: MultiEditOfferedServiceStatus.OFFERED,
        defaultIcon: 'os-offered',
        hoverIcon: 'ms-os-planned-hover',
        selectedIcon: 'ms-os-planned-selected'
      };
    case MultiEditOfferedServiceStatus.APPLICANT:
      return {
        status: MultiEditOfferedServiceStatus.APPLICANT,
        defaultIcon: 'os-applicant',
        hoverIcon: 'ms-os-applicant-hover',
        selectedIcon: 'ms-os-applicant-selected'
      };
    case MultiEditOfferedServiceStatus.OFFERED_AND_VALID:
      return {
        status: MultiEditOfferedServiceStatus.OFFERED_AND_VALID,
        defaultIcon: 'os-offered-and-valid',
        hoverIcon: 'ms-os-offered-hover',
        selectedIcon: 'ms-os-offered-selected'
      };
  }
};

export const getMultiEditOfferedServiceProcessState = (status: string) =>
  multiEditOfferedServiceProcessState(status);

export const getMultiEditOfferedServiceCurrentProcessState = (
  offeredService: OfferedService | undefined,
  isAssignable = true,
  isActive = true
): MultiEditOfferedServiceProcessState | undefined => {
  let status = MultiEditOfferedServiceStatus.NOT_ASSIGNABLE;
  if (isAssignable && !isOffered(offeredService)) {
    status = MultiEditOfferedServiceStatus.NOT_OFFERED;
  }

  if (isAssignable || !isActive) {
    if (isOffered(offeredService)) {
      status = MultiEditOfferedServiceStatus.OFFERED;
    }

    if (isApplicant(offeredService)) {
      status = MultiEditOfferedServiceStatus.APPLICANT;
    }

    if (isOfferedAndValid(offeredService)) {
      status = MultiEditOfferedServiceStatus.OFFERED_AND_VALID;
    }
  }

  return multiEditOfferedServiceProcessState(status);
};
