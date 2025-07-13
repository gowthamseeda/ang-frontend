import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TaskDiffItemComponent } from './task-diff-item.component';
import { EmptyValuePipe } from '../../../../shared/pipes/empty-value/empty-value.pipe';

describe('TaskDiffItemComponent', () => {
  let component: TaskDiffItemComponent;
  let fixture: ComponentFixture<TaskDiffItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TaskDiffItemComponent, EmptyValuePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDiffItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
