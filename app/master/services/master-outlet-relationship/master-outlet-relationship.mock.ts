import {MasterOutletRelationship} from "./master-outlet-relationship.model";

export function getMasterOutletRelationshipMock(): { [index: string]: any[] } {
  return {
    outletRelationships: [
      {
        id: 'is_Branch_of',
        name: 'Is Branch of',
        description: 'Description For Is branch of'
      },
      {
        id: 'related_to_MPC_branch_PC',
        name: 'Related to MPC branch PC',
        description: 'Description For Related to MPC branch PC'
      }
    ]
  };
}

export function getNewMasterOutletRelationshipMock(): MasterOutletRelationship {
  return {
    id: 'new related_to_logistic_center',
    name: 'New Related to logistic center',
    description: 'Testing Description For Related to logistic center'
  };
}

export function getUpdateMasterOutletRelationshipMock(): MasterOutletRelationship {
  return {
    id: 'is_Branch_of',
    name: 'Is branch of a company'
  };
}
