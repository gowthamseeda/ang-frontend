import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BusinessNameDiff } from 'app/tasks/task.model';
import { NgPipesModule } from 'ngx-pipes';

import { TaskDiffBusinessNameComponent } from './task-diff-business-name.component';
import { EmptyValuePipe } from '../../../../shared/pipes/empty-value/empty-value.pipe';
import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';

const taskDiffMock: BusinessNameDiff = {
  old: [
    {
      brandId: 'Brand1',
      businessName: 'Business1'
    },
    {
      brandId: 'Brand2',
      businessName: 'Business1'
    },
    {
      brandId: 'Brand3',
      businessName: 'Business2'
    }
  ],
  new: [
    {
      brandId: 'Brand1',
      businessName: 'Business1'
    },
    {
      brandId: 'Brand2',
      businessName: 'Business1'
    },
    {
      brandId: 'Brand4',
      businessName: 'Business2'
    },
    {
      brandId: 'Brand 5',
      businessName: 'Business2'
    },
    {
      brandId: 'Brand New',
      businessName: 'BusinessNew'
    }
  ]
};
const mockOld = {
  Business1: ['Brand1', 'Brand2'],
  Business2: ['Brand3']
};
const mockNew = {
  Business1: ['Brand1', 'Brand2'],
  Business2: ['Brand4', 'Brand5'],
  BusinessNew: ['Brand New']
};

describe('TaskDiffBusinessNameComponent', () => {
  let component: TaskDiffBusinessNameComponent;
  let fixture: ComponentFixture<TaskDiffBusinessNameComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NgPipesModule],
      declarations: [TaskDiffBusinessNameComponent, TranslatePipeMock, EmptyValuePipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDiffBusinessNameComponent);
    component = fixture.componentInstance;
    component.taskDiff = taskDiffMock;
    component.taskOld = mockOld;
    component.taskNew = mockNew;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show old and new div containers', () => {
    const oldDiffElement = fixture.nativeElement.querySelector('[data-test-id="task-diff-old"]');
    const newDiffElement = fixture.nativeElement.querySelector('[data-test-id="task-diff-new"]');

    expect(oldDiffElement).toBeTruthy();
    expect(newDiffElement).toBeTruthy();
  });

  it('should highlight last taskNew Element which is newly added', () => {
    const lastNewDiffElement = fixture.nativeElement.querySelector(
      '[data-test-id="task-diff-new"] .diff-keyvalue:last-child'
    );
    expect(lastNewDiffElement.className).toContain('highlight');
    expect(lastNewDiffElement.textContent).toContain('Brand New');
  });

  describe('highlighted()', () => {
    it('should return true if key is in diff', () => {
      const key = 'BusinessNew';
      expect(component.highlighted(key, 'new')).toBeTruthy();
    });

    it('should return false if key is not in diff', () => {
      const key = 'Business1';
      expect(component.highlighted(key, 'new')).toBeFalsy();
    });
  });
});
