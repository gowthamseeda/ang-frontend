import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import moment from 'moment';

import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';

import { TaskConfirmDialogComponent } from './task-confirm-dialog.component';

describe('TaskConfirmDialogComponent', () => {
  let component: TaskConfirmDialogComponent;
  let fixture: ComponentFixture<TaskConfirmDialogComponent>;
  let mockTaskDialogData: any;

  beforeEach(
    waitForAsync(() => {
      mockTaskDialogData = {
        title: 'Dialog data',
        confirm: 'OK',
        mandatoryComment: true
      };

      TestBed.configureTestingModule({
        declarations: [TaskConfirmDialogComponent, TranslatePipeMock],
        imports: [MatDialogModule],
        providers: [
          UntypedFormBuilder,
          {
            provide: MatDialogRef,
            useValue: {
              close: jest.fn()
            }
          },
          { provide: MAT_DIALOG_DATA, useValue: mockTaskDialogData }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('close', () => {
    beforeEach(() => {
      jest.spyOn(component.dialogRef, 'close');
    });

    it('should call function with comment and dueDate', () => {
      const data = {
        confirm: true,
        payload: {
          comment: 'A Comment',
          dueDate: moment().format('YYYY-MM-DD')
        }
      };

      component.close(data);
      fixture.detectChanges();

      expect(component.dialogRef.close).toHaveBeenCalledWith(data);
    });

    it('should call function without payload', () => {
      const data = {
        confirm: false
      };

      component.close(data);
      fixture.detectChanges();

      expect(component.dialogRef.close).toHaveBeenCalledWith(data);
    });
  });

  describe('conditional comment field', () => {
    it('should have invalid taskForm if comment empty', () => {
      component.taskForm.get('comment')?.setValue('');
      expect(component.taskForm.invalid).toBeTruthy();
    });

    it('should have valid taskForm if comment set', () => {
      component.taskForm.get('comment')?.setValue('comment set');
      expect(component.taskForm.invalid).toBeFalsy();
    });
  });
});
