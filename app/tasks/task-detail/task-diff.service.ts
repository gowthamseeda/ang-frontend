import { Injectable } from '@angular/core';
import { equals } from 'ramda';

import { TaskDiffData } from '../task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskDiffService {
  constructor() {}

  highlighted(key: string, diffData: TaskDiffData): boolean {
    return Object.keys(diffData).includes(key);
  }

  diff(taskOld: TaskDiffData, taskNew: TaskDiffData): TaskDiffData {
    return Object.keys({ ...taskOld, ...taskNew }).reduce((diff, key) => {
      if (equals(taskOld[key], taskNew[key])) {
        return diff;
      }

      return {
        ...diff,
        [key]: taskNew[key]
      };
    }, {});
  }

  removedDiff(taskOld: TaskDiffData, taskNew: TaskDiffData): TaskDiffData {
    return Object.keys(taskOld).reduce((diff, key) => {
      if (taskNew[key] !== undefined) {
        return diff;
      }
      return {
        ...diff,
        [key]: taskOld[key]
      };
    }, {});
  }
}
