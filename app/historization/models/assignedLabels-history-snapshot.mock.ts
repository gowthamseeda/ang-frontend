import { AssignedLabels } from './outlet-history-snapshot.model';

export const currentAssignedLabelSnapshotEntriesMock: AssignedLabels = {
  brandLabels: [
    {
      labelId: '36',
      brandId: 'MB'
    },
    {
      labelId: '35',
      brandId: 'WST'
    },
    {
      labelId: '34',
      brandId: 'MYB'
    }
  ],
  isDeleted: false
};

export const comparingAssignedLabelSnapshotEntriesMock: AssignedLabels = {
  brandLabels: [
    {
      labelId: '36',
      brandId: 'MB'
    },
    {
      labelId: '33',
      brandId: 'MYB'
    }
  ],
  isDeleted: false
};
