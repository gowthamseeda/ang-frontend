import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { OpeningHoursTaskNotificationComponent } from "./opening-hours-task-notification.component";
import { TaskDataService } from "../../../tasks/task/store/task-data.service";
import { Spy } from "jest-auto-spies";
import { MatDialog } from "@angular/material/dialog";
import { TranslatePipeMock } from "../../../testing/pipe-mocks/translate";

describe('OpeningHourTasksCommentComponent', () => {
  let component: OpeningHoursTaskNotificationComponent;
  let fixture: ComponentFixture<OpeningHoursTaskNotificationComponent>
  let taskDataServiceSpy: Spy<TaskDataService>;
  let matDialogSpy: Spy<MatDialog>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [
        OpeningHoursTaskNotificationComponent,
        TranslatePipeMock
      ],
      imports: [],
      providers: [
        { provide: TaskDataService, useValue: taskDataServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    }).compileComponents()

    fixture = TestBed.createComponent(OpeningHoursTaskNotificationComponent)
    component = fixture.componentInstance
    fixture.detectChanges();

  })

  it('should create', () => {
    expect(component).toBeTruthy();
  })
})
