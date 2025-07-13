import { Injectable } from '@angular/core';
import { Task } from '../../../tasks/task.model';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  // only use for tasks within one outlet
  private outletDataChangeTasks: Subject<Task[]> = new BehaviorSubject<Task[]>([]);

  constructor() {
  }

  nextOpenDataChangeTask(tasks: Task[]) {
    this.outletDataChangeTasks.next(tasks)
  }

  getDataChangeTasks() {
    return this.outletDataChangeTasks.asObservable();
  }

  resetDataChangeTasks() {
    this.outletDataChangeTasks.next([]);
  }
}
