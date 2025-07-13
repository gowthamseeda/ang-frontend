export enum CompanyRelation {
  MBAG = 'MBAG',
  DTAG = 'DTAG'
}

export const companyRelationMap = {
  [CompanyRelation.MBAG]: ['PC', 'VAN'],
  [CompanyRelation.DTAG]: ['TRUCK', 'BUS', 'UNIMOG']
};
