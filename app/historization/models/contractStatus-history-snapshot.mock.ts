import { LegalContractStatus, SnapshotChanges } from './outlet-history-snapshot.model';

export const currentContractStatusHistorySnapshotMock: LegalContractStatus[] = [
  {
    id: 'ID1',
    brandId: 'MB',
    companyRelationshipId:'MBAG',
    isDeleted: false,
    contractStatusKey:'CS1',
    required: false
  },
  {
    id: 'ID2',
    brandId: 'SETRA',
    languageId:'ar',
    isDeleted: false,
    contractStatusKey:'CS2',
    required: true
  },
  {
    id: 'ID3',
    brandId: 'FUSO',
    companyRelationshipId:'MBAG',
    isDeleted: false,
    contractStatusKey:'CS3',
    required: false
  }
];

export const comparingContractStatusHistorySnapshotMock: LegalContractStatus[] = [
  {
    id: 'ID1',
    brandId: 'MB',
    isDeleted: false,
    contractStatusKey:'CS1',
    required: false
  },
  {
    id: 'ID3',
    brandId: 'FUSO',
    companyRelationshipId:'MBAG',
    isDeleted: false,
    contractStatusKey:'CS3',
    required: false
  }
];

export const contractStatusChangedFields:SnapshotChanges[]=[
  {
    userId:'USER',
    changedField:'contractStatus.CS1'
  },
  {
    userId:'USER',
    changedField:'contractStatus.CS2'
  }
]
