import {Component, NgZone, NO_ERRORS_SCHEMA, ViewChild} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';

import { TasksTileComponent } from './tasks-tile.component';
import {createSpyFromClass, Spy} from "jest-auto-spies";
import {UserService} from "../../iam/user/user.service";
import {BusinessSiteTaskService} from "../shared/business-site-task.service";
import {DataCluster, Task} from "../task.model";
import {TaskMock} from "../task.mock";
import {ActivatedRoute, Router} from "@angular/router";
import {DataClusterLinkOutService} from "../task-detail/services/data-cluster-link-out.service";
import {of} from "rxjs";

class ActivatedRouteStub {
  params = of({
    id: 'GS0000001'
  });
}
const taskMock: Task[] = TaskMock.asList();
@Component({
  template: '<gp-tasks-tile [outletId]="outletId"></gp-tasks-tile>'
})
class TestComponent {
  @ViewChild(TasksTileComponent)
  tasksTileComponent: TasksTileComponent;
  outletId = 'GS0000001';
}
const url = `../outlet/GS0000001/edit`;

describe('TasksTileComponent', () => {
  let component: TestComponent;
  let userServiceSpy: Spy<UserService>;
  let fixture: ComponentFixture<TestComponent>;
  let routerSpy: Spy<Router>;
  let dataClusterLinkOutServiceSpy: Spy<DataClusterLinkOutService>;
  let businessSiteTaskServiceSpy: Spy<BusinessSiteTaskService>;

  beforeEach(
    waitForAsync(() => {
      userServiceSpy = createSpyFromClass(UserService);
      dataClusterLinkOutServiceSpy = createSpyFromClass(DataClusterLinkOutService);
      dataClusterLinkOutServiceSpy.getRouterLink.mockReturnValue(url);
      businessSiteTaskServiceSpy = createSpyFromClass(BusinessSiteTaskService);
      businessSiteTaskServiceSpy.getByOutletId.nextWith(taskMock);
      userServiceSpy.getRoles.nextWith(['GSSNPLUS.ProductResponsible']);
      routerSpy = createSpyFromClass(Router);

      TestBed.configureTestingModule({
        declarations: [TasksTileComponent, TestComponent],
        imports: [
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateFakeLoader
            }
          })
        ],
        providers: [
          TranslateService,
          { provide: UserService, useValue: userServiceSpy },
          { provide: Router, useValue: routerSpy },
          { provide: ActivatedRoute, useValue: ActivatedRouteStub },
          { provide: BusinessSiteTaskService, useValue: businessSiteTaskServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initUserRole', () => {
    test('should let isProductResponsible return true', () => {
      userServiceSpy.getRoles.nextWith(['GSSNPLUS.ProductResponsible']);
      fixture.detectChanges();
      expect(component.tasksTileComponent.isProductResponsible).toBeTruthy();
      expect(component.tasksTileComponent.isMarketTaskResponsible).toBeFalsy();
      expect(component.tasksTileComponent.isBusinessSiteResponsible).toBeFalsy();
    });
    test('should let isMarketTaskResponsible return true', () => {
      userServiceSpy.getRoles.nextWith(['GSSNPLUS.MarketTaskResponsible']);
      fixture.detectChanges();
      expect(component.tasksTileComponent.isMarketTaskResponsible).toBeTruthy();
      expect(component.tasksTileComponent.isBusinessSiteResponsible).toBeFalsy();
      expect(component.tasksTileComponent.isProductResponsible).toBeFalsy();
    });
    test('should let isBusinessSiteResponsible return true', () => {
      userServiceSpy.getRoles.nextWith(['GSSNPLUS.BusinessSiteResponsible']);
      fixture.detectChanges();
      expect(component.tasksTileComponent.isBusinessSiteResponsible).toBeTruthy();
      expect(component.tasksTileComponent.isMarketTaskResponsible).toBeFalsy();
      expect(component.tasksTileComponent.isProductResponsible).toBeFalsy();
    });
  });

  describe('initTasks and updateLocalTasks', () => {
    test('should not filter any task when is Product Responsible', () => {
      fixture.detectChanges();
      expect(component.tasksTileComponent.localTasks).toEqual(taskMock);
    });
    test('should filter data change task when is BusinessSiteResponsible', () => {
      userServiceSpy.getRoles.nextWith(['GSSNPLUS.BusinessSiteResponsible']);
      const expectedResult = [taskMock[0],taskMock[2],taskMock[3], taskMock[5]];
      fixture.detectChanges();
      component.tasksTileComponent.initTasks("GS00000001");
      expect(component.tasksTileComponent.localTasks).toEqual(expectedResult);
    });

    test('should filter data change task when is MarketTaskResponsible', () => {
      userServiceSpy.getRoles.nextWith(['GSSNPLUS.MarketTaskResponsible']);
      const expectedResult = [taskMock[1],taskMock[4]];
      fixture.detectChanges();
      component.tasksTileComponent.initTasks("GS00000001");
      expect(component.tasksTileComponent.localTasks).toEqual(expectedResult);
    });
  });

  describe('openLink', () => {
    it('should navigate to data cluster page', () => {
      const task: Task = {
        ...TaskMock.asList()[0],
        dataCluster: DataCluster.BASE_DATA_ADDRESS
      };
      fixture.detectChanges();
      const ngZone = TestBed.inject(NgZone);

      ngZone.run(() => {
        component.tasksTileComponent.openLink(task);
      });
      expect(routerSpy.navigate).toHaveBeenCalledWith(
        ['edit'],
        { fragment: "address", relativeTo: ActivatedRouteStub });
    });
  });
});
