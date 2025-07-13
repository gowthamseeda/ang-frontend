export class Histories {
  snapshots: History[];
}

export class History {
  userId: string;
  modifyUserId: string;
  groupType: string;
  ignoreFocusProductGroup: boolean;
  assignedDataRestrictions: { [dataRestrictionId: string]: string[] };
  createTimestamp: Date;
}
