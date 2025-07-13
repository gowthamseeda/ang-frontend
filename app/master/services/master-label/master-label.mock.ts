import { MasterLabel } from './master-label.model';

export function getMasterLabelsMock(): { [index: string]: any[] } {
  return {
    labels: [
      {
        name: 'Authorized Dealer',
        id: 1,
        assignableTo: ['BRAND'],
        restrictedToCountryIds: ['CH'],
        restrictedToBrandIds: ['MB', 'SMT']
      },
      {
        name: 'Daimler Dealer',
        id: 2,
        assignableTo: ['BRAND'],
        restrictedToCountryIds: ['GB'],
        restrictedToBrandIds: ['SMT']
      }
    ]
  };
}

export function getMasterNewLabelMock(): MasterLabel {
  return {
    name: 'My Brand-New Label',
    id: 3,
    assignableTo: ['BRAND']
  };
}

export function getMasterUpateLabelMock(): MasterLabel {
  return {
    name: 'My new Label',
    id: 1,
    assignableTo: ['BRAND']
  };
}
