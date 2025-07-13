import { GroupedBusinessName } from './business-names.model';

export function getGroupedBusinessNames(): GroupedBusinessName[] {
  return [
    new GroupedBusinessName(
      'Business Name 1',
      [
        { brandId: 'MB', readonly: false },
        { brandId: 'SMT', readonly: false }
      ],
      { 'en-EN': 'My translated name 1' }
    ),
    new GroupedBusinessName(
      'Business Name 2',
      [
        { brandId: 'MYB', readonly: false },
        { brandId: 'BAB', readonly: false }
      ],
      { 'en-EN': 'My translated name 2' }
    )
  ];
}
