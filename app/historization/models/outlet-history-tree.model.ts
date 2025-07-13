import { OutletHistoryDataClusterSnapshot, SnapshotChanges } from './outlet-history-snapshot.model';

export type OutletHistoryDataClusterFields = {
  [key in OutletHistoryDataCluster]?: DataClusterFields;
};

export enum OutletHistoryDataCluster {
  BASE_DATA = 'BASE_DATA',
  LEGAL_INFO = 'LEGAL_INFO',
  OFFERED_SERVICES = 'SERVICE_OFFERED_SERVICES',
  ASSIGNED_KEYS = 'ASSIGNED_KEYS',
  ASSIGNED_LABELS = 'ASSIGNED_LABELS',
  GENERAL_COMMUNICATIONS = 'GENERAL_COMMUNICATIONS',
  OUTLET_RELATIONSHIP = 'OUTLET_RELATIONSHIP'
}

export interface DataClusterFields {
  fields: Field[];
}

export interface Field {
  fieldName: string;
  fieldLabel?: string;
  isExtendedData: boolean;
  children?: Field[];
}

export interface OutletHistoryNode {
  dataCluster?: OutletHistoryDataCluster;
  currentSnapshot?: OutletHistoryDataClusterSnapshot;
  comparingSnapshot?: OutletHistoryDataClusterSnapshot;
  changes?: SnapshotChanges[];
  children?: OutletHistoryNode[];
}

export interface OutletHistoryFlatNode {
  dataCluster?: OutletHistoryDataCluster;
  currentSnapshot?: OutletHistoryDataClusterSnapshot;
  comparingSnapshot?: OutletHistoryDataClusterSnapshot;
  level: number;
  expandable: boolean;
}
