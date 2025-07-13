import { EntityMetadataMap } from '@ngrx/data';

export const taskEntityMetadata: EntityMetadataMap = {
  Tasks: {
    selectId: task => task.taskId
  }
};
