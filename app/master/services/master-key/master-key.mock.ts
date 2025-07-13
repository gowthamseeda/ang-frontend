import { MasterKeyType } from './master-key.model';

export function getMasterKeyTypesMock(): { [index: string]: any[] } {
  return {
    keyTypes: [
      {
        id: 'COFICO01',
        name: 'Cofico System ID 1',
        description: 'Description For COFICO01',
        maxValueLength: 256,
        countryRestrictions: ['DE'],
        brandRestrictions: ['SMT'],
        productGroupRestrictions: ['VAN']
      },
      {
        id: 'COFICO02',
        name: 'Cofico System ID 2',
        description: 'Description For COFICO02',
        translations: {
          'de-DE': {
            description: 'Description For COFICO02 in Germany'
          }
        },
        maxValueLength: 256
      },
      {
        id: 'COFICO03',
        name: 'Cofico System ID 3',
        description: 'Description For COFICO03',
        translations: {
          'de-DE': {
            description: 'Description For COFICO03 in Germany'
          }
        },
        maxValueLength: 40
      },
      {
        id: 'COFICOGB',
        name: 'Cofico System ID GB',
        description: 'Description For COFICOGB',
        translations: {
          'de-DE': {
            description: 'Description For COFICOGB in Germany'
          }
        },
        maxValueLength: 256,
        countryRestrictions: ['GB'],
        brandRestrictions: ['SMT'],
        productGroupRestrictions: ['VAN']
      },
      {
        id: 'GENESIS_ID',
        name: 'GENESIS ID (E-Location)',
        description: 'Description For GENESIS_ID',
        translations: {
          'de-DE': {
            description: 'Description For GENESIS_ID in Germany'
          }
        },
        maxValueLength: 40
      }
    ]
  };
}

export function getNewMasterKeyTypeMock(): MasterKeyType {
  return {
    id: 'My Brand-New Key Type',
    name: 'My Brand-New Key Type',
    maxValueLength: 256,
    description: 'My Brand-New Key Type Description'
  };
}

export function getUpdateMasterKeyTypeMock(): MasterKeyType {
  return {
    id: 'COFICO01',
    name: 'Cofico System ID 1 new',
    maxValueLength: 256,
    description: 'Description For COFICO01'
  };
}
