import { selectDistributionLevelTags } from './distribution-level.selectors';

describe('Distribution Level Selectors Test Suite', () => {
  describe('selectDistributionLevelTags should', () => {
    test('return distribution levels as named tags', () => {
      const state: string[] = ['RETAILER', 'WHOLESALER'];
      const selection = selectDistributionLevelTags.projector(state);
      const expected: string[] = ['DISTRIBUTION_LEVELS_RETAILER', 'DISTRIBUTION_LEVELS_WHOLESALER'];
      expect(selection).toStrictEqual(expected);
    });

    test('return empty array if no distribution levels exists', () => {
      const state: string[] = [];
      const selection = selectDistributionLevelTags.projector(state);
      const expected: string[] = [];
      expect(selection).toStrictEqual(expected);
    });
  });
});
