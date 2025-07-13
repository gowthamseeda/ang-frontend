import { CloseDownReason } from './close-down-reason.model';

export function getAllCloseDownReasonsMock(): CloseDownReason[] {
  return [
    {
      id: 1,
      name: 'company closed',
      translations: {
        'de-DE': 'Geschlossen durch Company'
      },
      validity: ['BUSINESS_SITE']
    },
    {
      id: 2,
      name: 'Going-out-of-business',
      translations: {
        'de-DE': 'Geschäftsaufgabe'
      },
      validity: ['BUSINESS_SITE']
    },
    {
      id: 3,
      name: 'Just closed',
      translations: {
        'de-DE': 'Einfach mal zu'
      },
      validity: ['COMPANY', 'BUSINESS_SITE']
    },
    {
      id: 4,
      name: 'Insolvency',
      translations: {
        'de-DE': 'Insolvenz'
      },
      validity: ['COMPANY']
    }
  ];
}
export function getAllCloseDownReasonsForBusinessSiteMock(): CloseDownReason[] {
  return [
    {
      id: 1,
      name: 'company closed',
      translations: {
        'de-DE': 'Geschlossen durch Company'
      },
      validity: ['BUSINESS_SITE']
    },
    {
      id: 2,
      name: 'Going-out-of-business',
      translations: {
        'de-DE': 'Geschäftsaufgabe'
      },
      validity: ['BUSINESS_SITE']
    },
    {
      id: 3,
      name: 'Just closed',
      translations: {
        'de-DE': 'Einfach mal zu'
      },
      validity: ['COMPANY', 'BUSINESS_SITE']
    }
  ];
}
export function getAllCloseDownReasonsForCompanyMock(): CloseDownReason[] {
  return [
    {
      id: 3,
      name: 'Just closed',
      translations: {
        'de-DE': 'Einfach mal zu'
      },
      validity: ['COMPANY', 'BUSINESS_SITE']
    },
    {
      id: 4,
      name: 'Insolvency',
      translations: {
        'de-DE': 'Insolvenz'
      },
      validity: ['COMPANY']
    }
  ];
}
