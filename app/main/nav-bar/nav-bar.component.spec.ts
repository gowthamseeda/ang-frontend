import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { NgxPermissionsAllowStubDirective } from 'ngx-permissions';

import { AppConfigProvider, AppConfigService, WindowUrlProvider } from '../../app-config.service';
import { FeatureToggleService } from '../../shared/directives/feature-toggle/feature-toggle.service';
import { ApiService } from '../../shared/services/api/api.service';
import { LoggingService } from '../../shared/services/logging/logging.service';
import { AppStateService } from '../../shared/services/state/app-state-service';
import { TaskWebSocketService } from '../../tasks/service/task-websocket.service';
import { TestingModule } from '../../testing/testing.module';

import { SideNavigationComponent } from './nav-bar.component';
import { CustomEventBusService } from '../../shared/services/custom-event-bus/custom-event-bus.service';
import { UserService } from '../../iam/user/user.service';

describe('SideNavigationComponent', () => {
  let component: SideNavigationComponent;
  let fixture: ComponentFixture<SideNavigationComponent>;
  let router: Router;
  let featureToggleServiceSpy: Spy<FeatureToggleService>;
  let taskWebSocketServiceSpy: Spy<TaskWebSocketService>;
  let userServiceSpy: Spy<UserService>;

  beforeEach(waitForAsync(() => {
    featureToggleServiceSpy = createSpyFromClass(FeatureToggleService);
    featureToggleServiceSpy.isFeatureEnabled.nextWith(true);

    taskWebSocketServiceSpy = createSpyFromClass(TaskWebSocketService);
    taskWebSocketServiceSpy.getPromptRefresh.nextWith(false);

    userServiceSpy = createSpyFromClass(UserService);
    userServiceSpy.getRoles.nextWith(['GSSNPLUS.BusinessSiteResponsible']);

    TestBed.configureTestingModule({
      imports: [
        TestingModule,
        BrowserAnimationsModule,
        MatSidenavModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [SideNavigationComponent, NgxPermissionsAllowStubDirective],
      providers: [
        ApiService,
        LoggingService,
        WindowUrlProvider,
        AppConfigProvider,
        AppStateService,
        AppConfigService,
        CustomEventBusService,
        {
          provide: FeatureToggleService,
          useValue: featureToggleServiceSpy
        },
        {
          provide: TaskWebSocketService,
          useValue: taskWebSocketServiceSpy
        },
        {
          provide: UserService,
          useValue: userServiceSpy
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    router = TestBed.inject(Router);
    //const routerSpy = createSpyFromClass(Router);
    const routerSpy = spyOn(router, 'parseUrl');
    const urlTreeMock = {
      root: {
        children: { primary: { segments: [{ path: '/dashboard' }] } }
      }
    };
    //routerSpy.parseUrl.mockReturnValue(urlTreeMock);
    routerSpy.and.returnValue(urlTreeMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch updateTaskList event', () => {
    const customEventBusSpy = jest.spyOn(TestBed.inject(CustomEventBusService), 'dispatchEvent')
    component.reloadTaskList()
    expect(component.newTaskAvailable).toBeFalsy();
    expect(customEventBusSpy).toHaveBeenCalledWith('updateTaskList')
  });

  describe('toggleNavDetail', () => {
    it('should open the detail view of the navigation item "menu"', () => {
      const appStateSaveSpy = jest
        .spyOn(TestBed.inject(AppStateService), 'save')
        .mockImplementation();
      component.toggleNavDetail('menu');

      expect(appStateSaveSpy).toHaveBeenCalledWith('activeNavItem', 'menu');
      expect(component.navDetail.opened).toBeTruthy();
    });

    it('should close the detail view', () => {
      component.toggleNavDetail('menu');
      component.toggleNavDetail();
      expect(component.navDetail.opened).toBeFalsy();

      component.toggleNavDetail('menu');
      component.toggleNavDetail('menu');
      expect(component.navDetail.opened).toBeFalsy();
    });

    it('should show another navigation item in detail view', () => {
      const appStateSaveSpy = jest
        .spyOn(TestBed.inject(AppStateService), 'save')
        .mockImplementation();
      component.toggleNavDetail('menu');
      component.toggleNavDetail('search');
      expect(appStateSaveSpy).toHaveBeenCalledWith('activeNavItem', 'search');
    });
  });

  describe('isActiveNavItem', () => {
    it('should be the active navigation item', () => {
      jest.spyOn(TestBed.inject(AppStateService), 'get').mockReturnValue('menu');
      expect(component.isActiveNavItem('menu')).toBeTruthy();
    });

    it('should not be the active navigation item', () => {
      jest.spyOn(TestBed.inject(AppStateService), 'get').mockReturnValue('menu');
      expect(component.isActiveNavItem('search')).toBeFalsy();
    });
  });

  describe('newTaskAvailable', () => {
    it('should be true if new task is present', async () => {
      taskWebSocketServiceSpy.getPromptRefresh.nextWith(true);
      await component.subscribeToWebSocketPromptRefresh()
      expect(component.newTaskAvailable).toBeTruthy();
    });

    it('should be false if no new task is present', async () => {
      taskWebSocketServiceSpy.getPromptRefresh.nextWith(false);
      await component.subscribeToWebSocketPromptRefresh()
      expect(component.newTaskAvailable).toBeFalsy();
    });
  });
});
