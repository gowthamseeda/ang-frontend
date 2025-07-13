import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { SnackBarService } from '../../shared/services/snack-bar/snack-bar.service';

import { TranslatePipeMock } from '../../testing/pipe-mocks/translate';
import { GroupedTaskService } from '../grouped-task/groupedTask.service';
import { TaskWebSocketService } from '../service/task-websocket.service';

import { AppStateService } from './../../shared/services/state/app-state-service';
import { TasksContainerComponent } from './tasks-container.component';

describe('TasksContainerComponent', () => {
  let component: TasksContainerComponent;
  let fixture: ComponentFixture<TasksContainerComponent>;
  let appStateService: AppStateService;

  let groupedTaskServiceSpy: Spy<GroupedTaskService>;
  let taskWebSocketServiceSpy: Spy<TaskWebSocketService>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(waitForAsync(() => {
    groupedTaskServiceSpy = createSpyFromClass(GroupedTaskService);
    groupedTaskServiceSpy.getAllGroupedTasks.nextWith([]);
    taskWebSocketServiceSpy = createSpyFromClass(TaskWebSocketService);
    taskWebSocketServiceSpy.getPromptRefresh.nextWith(false);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);

    TestBed.configureTestingModule({
      declarations: [TasksContainerComponent, TranslatePipeMock],
      providers: [
        {
          provide: GroupedTaskService,
          useValue: groupedTaskServiceSpy
        },
        {
          provide: TaskWebSocketService,
          useValue: taskWebSocketServiceSpy
        },
        {
          provide: SnackBarService,
          useValue: snackBarServiceSpy
        },
        AppStateService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    appStateService = TestBed.inject(AppStateService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should call taskService.fetchAllGroupedTasks() on ngOnInit', () => {
      expect(groupedTaskServiceSpy.fetchAllGroupedTasks).toHaveBeenCalledTimes(1);
    });
  });

  describe('saveExpandedStatus()', () => {
    it('should store expanded row business site id in cache', () => {
      const event = {
        row: {
          businessSite: {
            businessSiteId: 'GS0000001'
          }
        },
        show: true
      };

      component.saveExpandedStatus(event);
      const expandedTaskBusinessSiteIds = appStateService.get('expandedTaskBusinessSiteIds');
      expect(expandedTaskBusinessSiteIds).toContain(event.row.businessSite.businessSiteId);
    });

    it('should remove collapsed row business site id from cache', () => {
      appStateService.save('expandedTaskBusinessSiteIds', ['GS0000002']);

      const event = {
        row: {
          businessSite: {
            businessSiteId: 'GS0000002'
          }
        },
        show: false
      };

      component.saveExpandedStatus(event);
      const expandedTaskBusinessSiteIds = appStateService.get('expandedTaskBusinessSiteIds');
      expect(expandedTaskBusinessSiteIds.length).toEqual(0);
    });
  });
});
