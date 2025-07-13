import {BusinessSite, Task} from './task.model';

export class GroupedTask {
  lastChanged: string;
  businessSite: BusinessSite;
  tasks: Task[];
}

export class GroupedTaskPresentation {
  groupedTask: GroupedTask;
  show = false;
}

export interface GroupedTaskResponse {
  groupedTasks: GroupedTask[];
}
