import { createSelector } from '@ngrx/store';

import { selectDistributionLevelsState } from './business-site.selectors';

export const selectDistributionLevelTags = createSelector(
  selectDistributionLevelsState,
  (distributionLevelsState: string[]) => {
    const tags: string[] = [];
    if (distributionLevelsState.length > 0) {
      tags.push(
        ...distributionLevelsState.map(
          (distributionLevel: string) => 'DISTRIBUTION_LEVELS_' + distributionLevel
        )
      );
    }
    return tags;
  }
);
