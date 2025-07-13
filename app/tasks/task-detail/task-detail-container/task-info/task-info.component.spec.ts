import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { Observable, of } from 'rxjs';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { getUserMock } from '../../../../iam/user/user.mock';
import { User } from '../../../../iam/user/user.model';
import { UserService } from '../../../../iam/user/user.service';
import { BusinessSiteTaskService } from '../../../shared/business-site-task.service';
import { TaskMock } from '../../../task.mock';
import { DataCluster, Task, Type } from '../../../task.model';
import { DataClusterLinkOutService } from '../../services/data-cluster-link-out.service';

import { TaskInfoComponent } from './task-info.component';
import { FeatureToggleService } from '../../../../shared/directives/feature-toggle/feature-toggle.service';

class ActivatedRouteStub {
  params = of({
    id: 'GS0000001'
  });
}

class MockUserAuthorizationService {
  get isAuthorizedFor(): MockUserAuthorizationService {
    return this;
  }

  permissions(permissions: string[]): MockUserAuthorizationService {
    return this;
  }

  verify(): Observable<boolean> {
    return of(true);
  }
}

const url = `../outlet/GS0000001/edit`;
const user = getUserMock();

describe('TaskInfoComponent', () => {
  let component: TaskInfoComponent;
  let fixture: ComponentFixture<TaskInfoComponent>;
  let dataClusterLinkOutServiceSpy: Spy<DataClusterLinkOutService>;
  let routerSpy: Spy<Router>;
  let userServiceSpy: Spy<UserService>;
  let businessSiteTaskService: Spy<BusinessSiteTaskService>;
  let featureToggleServiceSpy: Spy<FeatureToggleService>;

  beforeEach(
    waitForAsync(() => {
      dataClusterLinkOutServiceSpy = createSpyFromClass(DataClusterLinkOutService);
      dataClusterLinkOutServiceSpy.getRouterLink.mockReturnValue(url);
      routerSpy = createSpyFromClass(Router);
      userServiceSpy = createSpyFromClass(UserService);
      userServiceSpy.getCurrent.nextWith(user);
      businessSiteTaskService = createSpyFromClass(BusinessSiteTaskService);
      businessSiteTaskService.updateStatus.nextWith(null);
      featureToggleServiceSpy = createSpyFromClass(FeatureToggleService);
      featureToggleServiceSpy.isFeatureEnabled.nextWith(false);

      TestBed.configureTestingModule({
        declarations: [TaskInfoComponent],
        providers: [
          { provide: DataClusterLinkOutService, useValue: dataClusterLinkOutServiceSpy },
          { provide: Router, useValue: routerSpy },
          { provide: ActivatedRoute, useValue: ActivatedRouteStub },
          { provide: UserService, useValue: userServiceSpy },
          { provide: BusinessSiteTaskService, useValue: businessSiteTaskService },
          { provide: UserAuthorizationService, useClass: MockUserAuthorizationService },
          { provide: FeatureToggleService, useValue: featureToggleServiceSpy }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(TaskInfoComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to data cluster page for DATA_VERIFICATION', () => {
    const task: Task = {
      ...TaskMock.asList()[0],
      dataCluster: DataCluster.BASE_DATA_ADDRESS
    };

    component.openLink(task);
    expect(routerSpy.navigate).toHaveBeenCalledWith([url], { relativeTo: ActivatedRouteStub });
  });

  it('should navigate to task page for DATA_CHANGE', () => {
    const task: Task = {
      ...TaskMock.asList()[1],
      dataCluster: DataCluster.BASE_DATA_ADDRESS,
      type: Type.DATA_CHANGE
    };

    component.openLink(task);
    expect(routerSpy.navigate).toHaveBeenCalledWith([task.taskId], {
      relativeTo: ActivatedRouteStub
    });
  });

  it('should return true if user is business site responsible for data change task', () => {
    const task: Task = {
      ...TaskMock.asList()[1]
    };
    const BSR: User = {
      ...getUserMock(),
      roles: ['GSSNPLUS.BusinessSiteResponsible']
    };
    component.tasks = [task];
    component.currentUser = BSR;
    const isInitiator = component.isResponsibleUser(task);

    expect(isInitiator).toBeTruthy();
  });

  it('should return false if user is not business site responsible for data change task', () => {
    const task: Task = {
      ...TaskMock.asList()[1]
    };
    component.tasks = [task];
    const isInitiator = component.isResponsibleUser(task);

    expect(isInitiator).toBeFalsy();
  });

  it('should return true if user is Task Responsible or Product Responsible for verification task', () => {
    const task: Task = {
      ...TaskMock.asList()[0]
    };
    const MTR: User = {
      ...getUserMock(),
      roles: ['GSSNPLUS.MarketTaskResponsible']
    };
    component.tasks = [task];
    component.currentUser = MTR;
    const isInitiator = component.isResponsibleUser(task);

    expect(isInitiator).toBeTruthy();
  });

  it('should return false if user is not Task Responsible or Product Responsible for verification task', () => {
    const task: Task = {
      ...TaskMock.asList()[0]
    };
    const normalUser: User = {
      ...getUserMock(),
      roles: ['']
    };
    component.tasks = [task];
    component.currentUser = normalUser;
    const isInitiator = component.isResponsibleUser(task);

    expect(isInitiator).toBeFalsy();
  });
});
