import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';

import { StateComponent } from './state.component';
import { TaskDataService } from '../../../../tasks/task/store/task-data.service';
import { MatDialog } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

function getForm() {
  return new FormBuilder().group({
    state: ''
  });
}

describe('StateComponent', () => {
  let component: StateComponent;
  let fixture: ComponentFixture<StateComponent>;
  let taskDataServiceSpy: Spy<TaskDataService>;
  let matDialogSpy: Spy<MatDialog>;

  beforeEach(
    waitForAsync(() => {
      taskDataServiceSpy = createSpyFromClass(TaskDataService);
      matDialogSpy = createSpyFromClass(MatDialog);

      TestBed.configureTestingModule({
        declarations: [StateComponent, TranslatePipeMock],
        providers: [
          { provide: TaskDataService, useValue: taskDataServiceSpy },
          { provide: MatDialog, useValue: matDialogSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StateComponent);
    component = fixture.componentInstance;
    component.parentForm = getForm();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
