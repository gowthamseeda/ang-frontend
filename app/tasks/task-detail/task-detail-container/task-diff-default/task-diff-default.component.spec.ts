import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { NgPipesModule } from 'ngx-pipes';

import { EmptyValuePipe } from '../../../../shared/pipes/empty-value/empty-value.pipe';
import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';
import { TaskDiff } from '../../../task.model';
import { TaskDiffService } from '../../task-diff.service';
import { TaskDiffItemComponent } from '../task-diff-item/task-diff-item.component';

import { TaskDiffDefaultComponent } from './task-diff-default.component';

const diffMock: TaskDiff = {
  old: {
    businessSiteId: 'GS0000001',
    street: 'Street'
  },
  new: {
    businessSiteId: 'GS0000001',
    street: 'Road to nowhere'
  }
};

describe('TaskDiffDefaultComponent', () => {
  let component: TaskDiffDefaultComponent;
  let fixture: ComponentFixture<TaskDiffDefaultComponent>;
  let taskDiffServiceSpy: Spy<TaskDiffService>;

  beforeEach(
    waitForAsync(() => {
      taskDiffServiceSpy = createSpyFromClass(TaskDiffService);
      taskDiffServiceSpy.diff.mockReturnValue({ street: 'Road to nowhere' });
      taskDiffServiceSpy.highlighted.mockReturnValue(false);

      TestBed.configureTestingModule({
        imports: [NgPipesModule],
        providers: [
          {
            provide: TaskDiffService,
            useValue: taskDiffServiceSpy
          }
        ],
        declarations: [
          TaskDiffDefaultComponent,
          TaskDiffItemComponent,
          TranslatePipeMock,
          EmptyValuePipe
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDiffDefaultComponent);
    component = fixture.componentInstance;
    component.taskDiff = {
      old: {},
      new: {}
    };
    component.diffData = {
      street: 'Road to nowhere'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display old and new diff container in view if diffMock is set', () => {
    component.taskDiff = diffMock;
    fixture.detectChanges();

    const oldDiffElement = fixture.nativeElement.querySelector('[data-test-id="task-diff-old"]');
    const newDiffElement = fixture.nativeElement.querySelector('[data-test-id="task-diff-new"]');

    expect(oldDiffElement).toBeTruthy();
    expect(newDiffElement).toBeTruthy();
  });

  it('should display key value pair for old|new diff containers', () => {
    component.taskDiff = diffMock;
    component.diffDisplay = diffMock;
    fixture.detectChanges();

    const oldFirstKey = fixture.debugElement.queryAll(
      By.css('[data-test-id="task-diff-old"] .diff-key')
    );
    const oldFirstValue = fixture.debugElement.queryAll(
      By.css('[data-test-id="task-diff-old"] .diff-value')
    );
    const newFirstKey = fixture.debugElement.queryAll(
      By.css('[data-test-id="task-diff-new"] .diff-key')
    );
    const newFirstValue = fixture.debugElement.queryAll(
      By.css('[data-test-id="task-diff-new"] .diff-value')
    );

    expect(oldFirstKey).toBeTruthy();
    expect(oldFirstValue).toBeTruthy();
    expect(newFirstKey).toBeTruthy();
    expect(newFirstValue).toBeTruthy();

    expect(oldFirstKey[1].nativeElement.textContent).toBe('street');
    expect(oldFirstValue[1].nativeElement.textContent.trim()).toBe('Street');

    expect(newFirstKey[1].nativeElement.textContent).toBe('street');
    expect(newFirstValue[1].nativeElement.textContent.trim()).toBe('Road to nowhere');
  });

  it('should have highlight class on taskDiff.new elements', () => {
    component.taskDiff = diffMock;
    component.diffDisplay = diffMock;
    taskDiffServiceSpy.highlighted.mockReturnValue(true);
    fixture.detectChanges();

    const streetElement = fixture.nativeElement.querySelector('.highlight:last-child');
    expect(streetElement.textContent.trim()).toContain(component.taskDiff.new.street);
  });

  it('should return true and show no-diff-container when no diff data', () => {
    component.diffData = {};
    fixture.detectChanges();

    const noDiffElement = fixture.nativeElement.querySelector('.no-diff-container');
    expect(noDiffElement).toBeTruthy();
    expect(component.emptyDiff()).toBeTruthy();
  });

  it('should return false and hide no-diff-container when there is diff data', () => {
    component.diffData = {
      street: 'Road to nowhere'
    };
    fixture.detectChanges();

    const noDiffElement = fixture.nativeElement.querySelector('.no-diff-container');
    expect(noDiffElement).toBeFalsy();
    expect(component.emptyDiff()).toBeFalsy();
  });
});
