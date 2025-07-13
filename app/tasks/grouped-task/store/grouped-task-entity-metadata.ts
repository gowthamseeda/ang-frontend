import { EntityMetadataMap } from '@ngrx/data';

export const groupedTaskEntityMetadata: EntityMetadataMap = {
  GroupedTasks: {
    selectId: groupedTask => groupedTask.businessSite.businessSiteId
  }
};
