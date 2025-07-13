import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslatePipeMock } from '../../../../../testing/pipe-mocks/translate';
import { PoBoxNumberComponent } from './po-box-number.component';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { TaskDataService } from '../../../../../tasks/task/store/task-data.service';
import { MatDialog } from '@angular/material/dialog';

function getPOBoxFormMock() {
  return new FormBuilder().group({
    poBox: new FormBuilder().group({
      number: ''
    })
  });
}

describe('PoBoxNumberComponent', () => {
  let component: PoBoxNumberComponent;
  let fixture: ComponentFixture<PoBoxNumberComponent>;
  let taskDataServiceSpy: Spy<TaskDataService>;
  let matDialogSpy: Spy<MatDialog>;

  beforeEach(
    waitForAsync(() => {
      taskDataServiceSpy = createSpyFromClass(TaskDataService);
      matDialogSpy = createSpyFromClass(MatDialog);

      TestBed.configureTestingModule({
        declarations: [PoBoxNumberComponent, TranslatePipeMock],
        providers: [
          { provide: TaskDataService, useValue: taskDataServiceSpy },
          { provide: MatDialog, useValue: matDialogSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PoBoxNumberComponent);
    component = fixture.componentInstance;
    component.poBoxForm = getPOBoxFormMock();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
