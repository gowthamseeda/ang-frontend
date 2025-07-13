import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { AppStateService } from '../../shared/services/state/app-state-service';
import { GroupedTask } from '../grouped-task.model';
import { GroupedTaskService } from '../grouped-task/groupedTask.service';
import { CustomEventBusService } from '../../shared/services/custom-event-bus/custom-event-bus.service';
import { TaskWebSocketService } from '../service/task-websocket.service';

const path = 'tasks/ws';
const protocol = 'wss';
const host = location.host;

@Component({
  selector: 'gp-tasks-container',
  templateUrl: './tasks-container.component.html',
  styleUrls: ['./tasks-container.component.scss']
})
export class TasksContainerComponent implements OnInit, OnDestroy {
  //everytime initTaskList init the latest data, getAllGroupedTask will go and get the data and assign to tasks
  tasks: Observable<GroupedTask[]> = this.groupedTaskService.getAllGroupedTasks();

  private unsubscribe = new Subject<void>();

  constructor(
    private groupedTaskService: GroupedTaskService,
    private customEventBus: CustomEventBusService,
    private appStateService: AppStateService,
    private taskWebSocketService: TaskWebSocketService
  ) {}

  ngOnInit(): void {
    this.subscribeToWebSocketPromptRefresh();
    this.initTaskList();

    //reload the task list if receive updateTaskList event
    this.customEventBus
      .data('updateTaskList')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.subscribeToWebSocketPromptRefresh();
        this.initTaskList();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  subscribeToWebSocketPromptRefresh() {
    this.taskWebSocketService
      .getPromptRefresh()
      .pipe(
        filter(isUpdated => isUpdated === true),
        take(1)
      )
      .toPromise()
      .then(() => {
        this.customEventBus.dispatchEvent('updateTaskList');
      });
  }

  getUrl() {
    const websocketUrl = `${protocol}://${host}/${path}`;
    return websocketUrl;
  }

  initTaskList(): void {
    this.groupedTaskService.fetchAllGroupedTasks();
  }

  saveExpandedStatus(event: any): void {
    const expandedTaskBusinessIds = this.appStateService.get('expandedTaskBusinessSiteIds') || [];

    if (event.show) {
      expandedTaskBusinessIds.push(event.row.businessSite.businessSiteId);
      this.appStateService.save('expandedTaskBusinessSiteIds', expandedTaskBusinessIds);
      return;
    }

    this.appStateService.save(
      'expandedTaskBusinessSiteIds',
      expandedTaskBusinessIds.filter(
        (businessSiteId: string) => businessSiteId !== event.row.businessSite.businessSiteId
      )
    );
  }
}
