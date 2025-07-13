import { UserTaskCleanSchedulerStatusComponent } from "./user-task-clean-scheduler-status.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TranslatePipeMock } from "../../../testing/pipe-mocks/translate";
import { MatTableModule } from "@angular/material/table";

describe('AuditLogCleanSchedulerStatusComponent', () => {
  let component: UserTaskCleanSchedulerStatusComponent
  let fixture: ComponentFixture<UserTaskCleanSchedulerStatusComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserTaskCleanSchedulerStatusComponent, TranslatePipeMock],
      imports: [MatTableModule]
    }).compileComponents();

    fixture = TestBed.createComponent(UserTaskCleanSchedulerStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
})
