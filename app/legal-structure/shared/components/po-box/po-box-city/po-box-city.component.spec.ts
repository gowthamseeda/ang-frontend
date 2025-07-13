import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { TranslatePipeMock } from '../../../../../testing/pipe-mocks/translate';

import { PoBoxCityComponent } from './po-box-city.component';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { TaskDataService } from '../../../../../tasks/task/store/task-data.service';
import { MatDialog } from '@angular/material/dialog';

function getPOBoxFormMock() {
  return new FormBuilder().group({
    poBox: new FormBuilder().group({
      city: ''
    })
  });
}

describe('PoBoxCityComponent', () => {
  let component: PoBoxCityComponent;
  let fixture: ComponentFixture<PoBoxCityComponent>;
  let taskDataServiceSpy: Spy<TaskDataService>;
  let matDialogSpy: Spy<MatDialog>;

  beforeEach(waitForAsync(() => {
    taskDataServiceSpy = createSpyFromClass(TaskDataService);
    matDialogSpy = createSpyFromClass(MatDialog);

    TestBed.configureTestingModule({
      declarations: [PoBoxCityComponent, TranslatePipeMock],
      providers: [
        { provide: TaskDataService, useValue: taskDataServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoBoxCityComponent);
    component = fixture.componentInstance;
    component.poBoxForm = getPOBoxFormMock();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
