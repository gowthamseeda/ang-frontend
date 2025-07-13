import {Relationship, SnapshotChanges} from './outlet-history-snapshot.model';

export const currentOutletRelationshipSnapshotEntryMock: Relationship = {
  outletRelationships: [
    {
      id: 'ID1',
      relationshipKey: 'OR1',
      relatedBusinessSiteId: 'GS01',
      relationshipDefCode: 'related_to_logistic_center',
      isDeleted: true
    },
    {
      id: 'ID2',
      relationshipKey: 'OR2',
      relatedBusinessSiteId: 'GS01',
      relationshipDefCode: 'related_to_MPC_branch_TRUCK',
      isDeleted: false
    },
    {
      id: 'ID3',
      relationshipKey: 'OR3',
      relatedBusinessSiteId: 'GS01',
      relationshipDefCode: 'related_to_MPC_branch_VAN',
      isDeleted: false
    }
  ]
};

export const comparingOutletRelationshipSnapshotEntryMock: Relationship = {
  outletRelationships: [
    {
      id: 'ID1',
      relationshipKey: 'OR1',
      relatedBusinessSiteId: 'GS01',
      relationshipDefCode: 'related_to_logistic_center',
      isDeleted: false
    },
    {
      id: 'ID3',
      relationshipKey: 'OR3',
      relatedBusinessSiteId: 'GS01',
      relationshipDefCode: 'related_to_MPC_branch_VAN',
      isDeleted: false
    }
  ]
};

export const outletRelationshipChangedFields: SnapshotChanges[] = [
  {
    userId: 'USER',
    changedField: 'outletRelationship.OR1'
  },
  {
    userId: 'USER',
    changedField: 'outletRelationship.OR2'
  }
]
