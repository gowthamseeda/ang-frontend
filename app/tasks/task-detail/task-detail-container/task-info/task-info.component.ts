import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { User } from '../../../../iam/user/user.model';
import { UserService } from '../../../../iam/user/user.service';
import { BusinessSiteTaskService } from '../../../shared/business-site-task.service';
import { MPC_ROLE, RETAILER_ROLE } from '../../../tasks.constants';
import { DataClusterLinkOutService } from '../../services/data-cluster-link-out.service';
import { DataCluster, Status, Task, Type } from '../../../task.model';
import { FeatureToggleService } from '../../../../shared/directives/feature-toggle/feature-toggle.service';

@Component({
  selector: 'gp-task-info',
  templateUrl: './task-info.component.html',
  styleUrls: ['./task-info.component.scss']
})
export class TaskInfoComponent implements OnInit, OnDestroy {
  @Input() set task(task: Task) {
    this.tasks = [task];
  }

  @Input()
  isLinkEnabled = false;
  @Input()
  tasks: Task[];

  @Output() initTaskList = new EventEmitter<null>();

  columnsToDisplay: string[] = [
    'cluster',
    'taskId',
    'comment',
    'editor',
    'created',
    'dueDate',
    'type',
    'status',
    'cancel'
  ];

  taskType = Type;
  cancelDataChangeTaskPermission = 'tasks.task.data.change.delete';
  cancelDataVerificationTaskPermission = 'tasks.task.data.verification.delete';

  currentUser: User;
  currentUserIsDataChangeTaskCancelAuthorized: boolean;
  currentUserIsDataVerificationTaskCancelAuthorized: boolean;
  is4RetailEnabled: boolean;

  private unsubscribe = new Subject<void>();

  constructor(
    private dataClusterLinkOut: DataClusterLinkOutService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private businessSiteTaskService: BusinessSiteTaskService,
    private userAuthorizationService: UserAuthorizationService,
    private featureToggleService: FeatureToggleService
  ) {
  }

  ngOnInit(): void {
    this.userService
      .getCurrent()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(user => {
        this.currentUser = user;
      });

    this.userAuthorizationService.isAuthorizedFor
      .permissions([this.cancelDataChangeTaskPermission])
      .verify()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(authorized => {
        this.currentUserIsDataChangeTaskCancelAuthorized = authorized;
      });

    this.userAuthorizationService.isAuthorizedFor
      .permissions([this.cancelDataVerificationTaskPermission])
      .verify()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(authorized => {
        this.currentUserIsDataVerificationTaskCancelAuthorized = authorized;
      });

    this.featureToggleService.isFeatureEnabled('FOR_RETAIL')
      .subscribe(forRetailEnabled => {
        this.is4RetailEnabled = forRetailEnabled
      })

    if (!this.isLinkEnabled) {
      this.columnsToDisplay = this.columnsToDisplay.filter(
        columnToDisplay => columnToDisplay !== 'cancel'
      );
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  openLink(task: Task): void {
    if (task.type === Type.DATA_VERIFICATION) {
      if (this.is4RetailEnabled && task.dataCluster === DataCluster.OPENING_HOURS) {
        if (task.tags != undefined) {
          const serviceId = task.tags?.['serviceId']?.[0] ?? null;
          if (serviceId != null) {
            const routerLink = this.dataClusterLinkOut.getOpeningHours4RRouter(task);
            const routerQueryParam = { productCategoryId: "1", serviceId: serviceId };
            this.router.navigate([routerLink], { queryParams : routerQueryParam });
            return;
          }
        }
      }
      const routerLink = this.dataClusterLinkOut.getRouterLink(task);
      const fragment = this.dataClusterLinkOut.getRouterFragment(task.dataCluster, task.aggregateField);
      this.navigateBy(routerLink, fragment);
      return;
    }

    if (task.type === Type.DATA_CHANGE) {
      this.navigateToTaskBy(task.taskId);
    }
  }

  isResponsibleUser(task: Task): boolean {
    switch (task.type) {
      case Type.DATA_VERIFICATION:
        return this.currentUser.roles.some(role => MPC_ROLE.includes(role));

      case Type.DATA_CHANGE:
        return this.currentUser.roles.includes(RETAILER_ROLE);
    }
  }

  cancelTask(task: Task, event: any): void {
    event.stopPropagation();
    this.businessSiteTaskService
      .updateStatus(task.taskId, Status.CANCELED)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.clearCancelTask(task));
  }

  private clearCancelTask(removedTask: Task): void {
    const taskCountByRemovedTaskBusinessId = this.tasks.reduce(
      (count, task) => (task.businessSiteId === removedTask.businessSiteId ? ++count : count),
      0
    );

    if (taskCountByRemovedTaskBusinessId === 1) {
      this.initTaskList.emit();
      return;
    }

    this.tasks = this.tasks.filter(task => task.taskId !== removedTask.taskId);
  }

  private navigateBy(param: string, fragment: string): void {
    let options: NavigationExtras = { relativeTo: this.activatedRoute };
    if (fragment) {
      options = { ...options, fragment };
    }
    this.router.navigate([param], options);
  }

  private navigateToTaskBy(taskId: number): void {
    this.router.navigate([taskId], { relativeTo: this.activatedRoute });
  }

  isBlank(value: string): boolean {
    return !value || value.trim().length == 0;
  }
}
