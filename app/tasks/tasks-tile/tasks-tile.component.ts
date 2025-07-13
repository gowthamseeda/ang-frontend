import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { finalize, take, takeUntil } from "rxjs/operators";
import { UserService } from "../../iam/user/user.service";
import { BusinessSiteTaskService } from "../shared/business-site-task.service";
import { Task } from '../../tasks/task.model';
import { DataClusterLinkOutService } from "../task-detail/services/data-cluster-link-out.service";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { ObservableInput } from "ngx-observable-input";

@Component({
  selector: 'gp-tasks-tile',
  templateUrl: './tasks-tile.component.html',
  styleUrls: ['./tasks-tile.component.scss']
})
export class TasksTileComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  detailsLinkText = '';

  columnsToDisplay: string[] = [
    'cluster',
    'taskId',
    'comment'
  ];

  @Input()
  @ObservableInput()
  businessSiteId: Observable<string>;
  private localUserRole: string[];
  public isMarketTaskResponsible: boolean = false;
  public isBusinessSiteResponsible: boolean = false;
  public isProductResponsible: boolean = false;
  public localTasks: Task[] = [];
  private unsubscribe = new Subject<void>();

  constructor(
    private userService: UserService,
    private dataClusterLinkOut: DataClusterLinkOutService,
    private router: Router,
    private businessSiteTaskService: BusinessSiteTaskService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initUserRole()
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initTasks(outletId: string): void {
    this.isLoading = true;
    this.businessSiteTaskService.getByOutletId(outletId)
      .pipe(
        take(1),
        finalize(() => (this.isLoading = false))
      ).subscribe((tasks: Task[]) => {
        this.updateLocalTasks(tasks);
    });
    this.isLoading = false;
  }

  initUserRole():void {
    this.userService
      .getRoles()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((roles: string[]) => (this.localUserRole = roles));
    if(this.localUserRole.includes('GSSNPLUS.ProductResponsible')) {
      this.isProductResponsible = true;
    } else if (this.localUserRole.includes('GSSNPLUS.MarketTaskResponsible')) {
      this.isMarketTaskResponsible = true;
    } else if (this.localUserRole.includes('GSSNPLUS.BusinessSiteResponsible')){
      this.isBusinessSiteResponsible = true;
    }
    if (this.localUserRole) {
      this.businessSiteId.subscribe((outletId: string) => {
        this.initTasks(outletId)
      });
    }
  }

  updateLocalTasks(tasks: Task[]): void {
    const filterFunction = (task) => {
      if (this.isProductResponsible) return true;
      if (this.isMarketTaskResponsible) return task.type === 'DATA_CHANGE';
      if (this.isBusinessSiteResponsible) return task.type === 'DATA_VERIFICATION';
      return false;
    };

    this.localTasks = tasks.filter(filterFunction);
  }

  openLink(task: Task): void {
    const routerLink = this.dataClusterLinkOut.getRouterLink(task);
    const fragment = this.dataClusterLinkOut.getRouterFragment(task.dataCluster, task.aggregateField);
    const parts = routerLink.split('/');
    const page = parts[parts.length - 1];
    this.navigateBy(page, fragment);
    return;
  }

  private navigateBy(param: string, fragment: string): void {
    let options: NavigationExtras = { relativeTo: this.activatedRoute };
    if (fragment) {
      options = { ...options, fragment };
    }
    this.router.navigate([param], options);
  }

  @HostListener('wheel', ['$event'])
  avoidPageScroll(wheelEvent: WheelEvent): void {
    wheelEvent.stopPropagation();
  }

  isBlank(value: string): boolean {
    return !value || value.trim().length == 0;
  }
}
