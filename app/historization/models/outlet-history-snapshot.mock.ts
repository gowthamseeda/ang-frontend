import { Outlet, SnapshotChanges, SnapshotEntry } from './outlet-history-snapshot.model';

export const outletSnapshotEntriesMock: SnapshotEntry[] = [
  { group: '2022-02-02', snapshot: { id: 'GS1', legalName: 'Legal Name 5' } as Outlet },
  { group: '2022-02-01', snapshot: { id: 'GS1', legalName: 'Legal Name 4' } as Outlet },
  { group: '2022-01-02', snapshot: { id: 'GS1', legalName: 'Legal Name 3' } as Outlet },
  { group: '2022-01-01', snapshot: { id: 'GS1', legalName: 'Legal Name 2' } as Outlet },
  { group: '2021-12-31', snapshot: { id: 'GS1', legalName: 'Legal Name 1' } as Outlet }
];

export const outletSnapshotMock: Outlet = {
  id: 'GS00000001',
  companyId: 'GC00000001',
  active: true,
  countryId: 'DE',
  permitted: false,
  deleted: false
};

export const outletChangesMock: SnapshotChanges[] = [
  {
    changedField: 'nameAddition',
    userId: 'USER'
  },
  {
    changedField: 'moveOutlet',
    userId: 'TESTER'
  }
];
