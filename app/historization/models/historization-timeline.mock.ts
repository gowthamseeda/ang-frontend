import { Outlet, SnapshotEntry } from './outlet-history-snapshot.model';

export const snapshotEntriesMock: SnapshotEntry[] = [
  { group: '2022-02-02', snapshot: {} as Outlet },
  { group: '2022-02-01', snapshot: {} as Outlet },
  { group: '2022-01-02', snapshot: {} as Outlet },
  { group: '2022-01-01', snapshot: {} as Outlet },
  { group: '2021-12-31', snapshot: {} as Outlet }
];

export const defaultGroupedNodesMock = [
  {
    id: '2022',
    label: '2022',
    selected: true,
    children: [
      {
        id: '2022-02',
        label: 'February',
        selected: true,
        children: [
          {
            id: '2022-02-02',
            label: '2nd, Wednesday',
            selected: true
          },
          {
            id: '2022-02-01',
            label: '1st, Tuesday',
            selected: false
          }
        ]
      },
      {
        id: '2022-01',
        label: 'January',
        selected: false,
        children: [
          {
            id: '2022-01-02',
            label: '2nd, Sunday',
            selected: false
          },
          {
            id: '2022-01-01',
            label: '1st, Saturday',
            selected: false
          }
        ]
      }
    ]
  },
  {
    id: '2021',
    label: '2021',
    selected: false,
    children: [
      {
        id: '2021-12',
        label: 'December',
        selected: false,
        children: [
          {
            id: '2021-12-31',
            label: '31st, Friday',
            selected: false
          }
        ]
      }
    ]
  }
];

export const newSelectedGroupedNodesMock = [
  {
    id: '2022',
    label: '2022',
    selected: false,
    children: [
      {
        id: '2022-02',
        label: 'February',
        selected: false,
        children: [
          {
            id: '2022-02-02',
            label: '2nd, Wednesday',
            selected: false
          },
          {
            id: '2022-02-01',
            label: '1st, Tuesday',
            selected: false
          }
        ]
      },
      {
        id: '2022-01',
        label: 'January',
        selected: false,
        children: [
          {
            id: '2022-01-02',
            label: '2nd, Sunday',
            selected: false
          },
          {
            id: '2022-01-01',
            label: '1st, Saturday',
            selected: false
          }
        ]
      }
    ]
  },
  {
    id: '2021',
    label: '2021',
    selected: true,
    children: [
      {
        id: '2021-12',
        label: 'December',
        selected: true,
        children: [
          {
            id: '2021-12-31',
            label: '31st, Friday',
            selected: true
          }
        ]
      }
    ]
  }
];
