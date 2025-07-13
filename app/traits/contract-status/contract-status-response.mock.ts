import { ContractStatusResponse } from './contract-status.model';

export function getContractStatusResponse(): ContractStatusResponse {
  return {
    items: [
      {
        brandId: 'MB',
        disclosures: 'mein geheimnis',
        languageId: 'de',
        required: true,
        status: 'aktualisiert'
      },
      {
        brandId: 'MB',
        disclosures: 'my secret',
        languageId: 'en',
        required: true,
        status: 'updated'
      }
    ]
  };
}
