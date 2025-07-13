export enum RelationshipDefCode {
  LOGISTIC_CENTER = 'related_to_logistic_center',
  AUTH_DEALER = 'related_to_MPC_branch_PC',
  MPC_BRANCH_VAN = 'related_to_MPC_branch_VAN',
  MPC_BRANCH_TRUCK = 'related_to_MPC_branch_TRUCK',
  MPC_BRANCH_FUSO = 'related_to_MPC_branch_FUSO',
  COMPANY_GROUP_MEMBER = 'member_of_company_group',
  STOCKHOLDER = 'stockholder_of',
  CLOSER_OUTLET_USED_CAR_MB_PC = 'closer_outlet_used_car_MB_PC',
  DEALER = 'related_to_dealer',
  REGIONAL_CENTER_INTERNATIONAL = 'related_to_regional_center_international',
  HOLDING = 'related_to_Holding',
  SALES_JOINT_VENTURE = 'related_to_sales_joint_venture',
  RECEIVES_DROP_OFF_VEHICLES_FROM = 'receives_drop_off_vehicles_from'
}

export class OutletRelationships {
  outletRelationships: OutletRelationship[];
}

export class OutletRelationship {
  relatedBusinessSiteId: string;
  relationshipDefCode: string;
}
