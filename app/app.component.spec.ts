import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouteConfigLoadStart, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Angulartics2Matomo } from 'angulartics2';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { BehaviorSubject, of } from 'rxjs';

import { AppComponent } from './app.component';
import { FeatureToggleDirective } from './shared/directives/feature-toggle/feature-toggle.directive';
import { FeatureToggleService } from './shared/directives/feature-toggle/feature-toggle.service';
import { ProgressBarService } from './shared/services/progress-bar/progress-bar.service';
import { TaskWebSocketService } from './tasks/service/task-websocket.service';
import { hansSettingsMock } from './user-settings/user-settings/model/user-settings.mock';
import { UserSettingsService } from './user-settings/user-settings/services/user-settings.service';
import {SessionInvalidatorService} from "./main/session-manager/session-invalidator/session-invalidator.service";

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let progressBarService: ProgressBarService;
  let userSettingsServiceSpy: Spy<UserSettingsService>;
  let taskWebSocketServiceSpy: Spy<TaskWebSocketService>;
  let sessionInvalidatorServiceSpy : Spy<SessionInvalidatorService>;
  const routerStub = {
    events: new BehaviorSubject<any>(null)
  };
  const progressBarServiceStub = {
    progressChanges: of(10),
    start: () => {}
  };
  let featureToggleServiceSpy: Spy<FeatureToggleService>;

  beforeEach(waitForAsync(() => {
    userSettingsServiceSpy = createSpyFromClass(UserSettingsService, ['get']);
    userSettingsServiceSpy.get.nextWith(hansSettingsMock);
    featureToggleServiceSpy = createSpyFromClass(FeatureToggleService, ['isFeatureEnabled']);
    featureToggleServiceSpy.isFeatureEnabled.nextWith(true);
    taskWebSocketServiceSpy = createSpyFromClass(TaskWebSocketService);
    sessionInvalidatorServiceSpy = createSpyFromClass(SessionInvalidatorService);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, TranslateModule.forRoot({}), HttpClientTestingModule],
      declarations: [AppComponent, FeatureToggleDirective],
      providers: [
        { provide: Angulartics2Matomo, useValue: createSpyFromClass(Angulartics2Matomo) },
        { provide: ProgressBarService, useValue: progressBarServiceStub },
        { provide: Router, useValue: routerStub },
        { provide: UserSettingsService, useValue: userSettingsServiceSpy },
        { provide: FeatureToggleService, useValue: featureToggleServiceSpy },
        { provide: TaskWebSocketService, useValue: taskWebSocketServiceSpy },
        { provide: SessionInvalidatorService, useValue: sessionInvalidatorServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('ngOnInit', () => {
    it('should listen to progress bar changes', () => {
      expect(component.loadProgress).toEqual(10);
    });

    it('should show progress bar when module will be loaded', () => {
      progressBarService = fixture.debugElement.injector.get(ProgressBarService);
      jest.spyOn(progressBarService, 'start');
      routerStub.events.next(new RouteConfigLoadStart({}));
      expect(progressBarService.start).toHaveBeenCalled();
    });
  });
});
