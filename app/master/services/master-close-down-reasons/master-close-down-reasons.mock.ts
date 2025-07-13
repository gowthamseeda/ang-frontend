import { MasterCloseDownReason } from './master-close-down-reason.model';

export function getMasterCloseDownReasonsMock(): MasterCloseDownReason[] {
  return [
    {
      translations: {
        'de-DE': 'Geschlossen durch Company'
      },
      name: 'company closed',
      id: 1,
      validity: ['BUSINESS_SITE']
    },
    {
      translations: {
        'de-DE': 'Geschäftsaufgabe'
      },
      name: 'Going-out-of-business',
      id: 2,
      validity: ['BUSINESS_SITE']
    },
    {
      translations: {
        'de-DE': 'Einfach mal zu'
      },
      name: 'Just closed',
      id: 3,
      validity: ['COMPANY', 'BUSINESS_SITE']
    },
    {
      translations: {
        'de-DE': 'Insolvenz'
      },
      name: 'Insolvency',
      id: 4,
      validity: ['COMPANY']
    }
  ];
}

export function getMasterCloseDownReasonSingleMock(): MasterCloseDownReason[] {
  return [
    {
      translations: {
        'de-DE': 'Insolvenz'
      },
      name: 'Insolvency',
      id: 2,
      validity: ['COMPANY']
    }
  ];
}
