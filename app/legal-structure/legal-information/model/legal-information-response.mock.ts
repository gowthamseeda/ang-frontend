import { LegalInformationResponse } from './legal-information-response';

export function getLegalInformationResponse(
  companyId?: string,
  outletId?: string
): LegalInformationResponse {
  return {
    businessSiteId: outletId ? outletId : 'GS0000002',
    companyId: companyId ? companyId : 'GC0000001',
    legalFooter: 'The footer',
    legalFooterTranslations: {
      'de-DE': 'Der Footer'
    },
    taxNo: '123456789012',
    vatNo: 'DE123456789'
  };
}
