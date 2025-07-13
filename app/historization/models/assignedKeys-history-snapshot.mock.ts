import { AssignedKey } from './outlet-history-snapshot.model';

export const currentAssignedKeySnapshotEntriesMock: AssignedKey = {
  alias: 'KEPCI_AUTO',
  brandCodes: [
    {
      brandId: 'SMT',
      brandCode: '40011'
    },
    {
      brandId: 'MB',
      brandCode: '40011'
    },
    {
      brandId: 'STR',
      brandCode: '40013'
    },
    {
      brandId: 'MYB',
      brandCode: '40015'
    }
  ],
  externalKeys: [
    {
      keyType: 'BUSINESS_CODE',
      value: '2001'
    },
    {
      keyType: 'BUSINESS_CODE',
      value: '2001',
      brandId: 'MB',
      productGroupId: 'PC'
    },
    {
      keyType: 'BUSINESS_CODE',
      value: '2002',
      brandId: 'MYB',
      productGroupId: 'PC'
    }
  ],
  federalId: 'KEP0001',
  gssnClassicId: 'GS0909',
  isDeleted: false
};

export const comparingAssignedKeySnapshotEntriesMock: AssignedKey = {
  alias: 'KEPCI_AUTO',
  brandCodes: [
    {
      brandId: 'SMT',
      brandCode: '40010'
    },
    {
      brandId: 'MYB',
      brandCode: '40015'
    }
  ],
  externalKeys: [
    {
      keyType: 'BUSINESS_CODE',
      value: '2001'
    },
    {
      keyType: 'BUSINESS_CODE',
      value: '2002',
      brandId: 'SMT',
      productGroupId: 'PC'
    }
  ],
  federalId: 'KEP0001',
  gssnClassicId: 'GS0909',
  isDeleted: false
};
