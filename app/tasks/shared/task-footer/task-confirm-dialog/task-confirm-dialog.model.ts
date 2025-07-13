import { TaskData } from 'app/tasks/task.model';

class TaskConfirmDialogText {
  title: string;
  confirmButton: string;
}

class TaskConfirmDialogOptions {
  hideDueDate?: boolean;
  mandatoryComment?: boolean;
  multipleVerificationTasks?: boolean;
}

export interface TaskConfirmDialogData extends TaskConfirmDialogText, TaskConfirmDialogOptions {}

export interface TaskConfirmDialogCloseData {
  confirm: boolean;
  payload?: TaskData;
}

export class TaskConfirmDialog {
  text: TaskConfirmDialogText;
  options: TaskConfirmDialogOptions;

  constructor(taskConfirmDialog: TaskConfirmDialog) {
    if (taskConfirmDialog.text) {
      this.text = {
        title: taskConfirmDialog.text.title || '',
        confirmButton: taskConfirmDialog.text.confirmButton || ''
      };
    }

    if (taskConfirmDialog.options) {
      this.options = {
        hideDueDate: taskConfirmDialog.options.hideDueDate || false,
        multipleVerificationTasks: taskConfirmDialog.options.multipleVerificationTasks || false
      };
    }
  }
}
