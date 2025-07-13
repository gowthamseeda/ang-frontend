import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { Type } from '../../task.model';

import { TranslatePipeMock } from '../../../testing/pipe-mocks/translate';
import { TaskFooterComponent } from './task-footer.component';

describe('TaskFooterComponent', () => {
  let component: TaskFooterComponent;
  let fixture: ComponentFixture<TaskFooterComponent>;

  let matDialogSpy: Spy<MatDialog>;

  beforeEach(
    waitForAsync(() => {
      matDialogSpy = createSpyFromClass(MatDialog);

      TestBed.configureTestingModule({
        declarations: [TaskFooterComponent, TranslatePipeMock],
        providers: [{ provide: MatDialog, useValue: matDialogSpy }],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskFooterComponent);
    component = fixture.componentInstance;
    component.taskId = 1;
    component.type = Type.DATA_VERIFICATION;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('type', () => {
    it('should set footer according to Type.DATA_CHANGE', () => {
      component.type = Type.DATA_CHANGE;
      expect(component.confirmButtonTranslationKey).toEqual('TASK_REQUEST_APPROVAL');
      expect(component.confirmDialogTitle).toEqual('TASK_REQUEST_APPROVAL');
    });

    it('should set footer accordnig to Type.DATA_VERIFICATION', () => {
      expect(component.confirmButtonTranslationKey).toEqual('TASK_ACCEPT');
      expect(component.discardButtonTranslationKey).toEqual('TASK_DENY');
      expect(component.confirmDialogTitle).toEqual('TASK_APPROVE_TITLE');
      expect(component.discardDialogTitle).toEqual('TASK_REJECT_TITLE');
      expect(component.confirmDiscardAction).toBeTruthy();
      expect(component.hideDueDate).toBeTruthy();
    });
  });

  describe('confirmApprove()', () => {
    beforeEach(() => {
      jest.spyOn(component.confirm, 'emit');
    });

    it('should emit confirm if confirmed', () => {
      matDialogSpy.open.mockReturnValue({
        afterClosed: () => of({ confirm: true, payload: { comment: 'A Comment' } })
      });
      component.confirmApprove();
      fixture.detectChanges();

      expect(component.confirm.emit).toHaveBeenCalledWith({
        taskId: 1,
        payload: { comment: 'A Comment' }
      });
    });

    it('should not emit confirm if not confirmed', () => {
      matDialogSpy.open.mockReturnValue({ afterClosed: () => of({ confirm: false }) });
      component.confirmApprove();
      fixture.detectChanges();

      expect(component.confirm.emit).not.toHaveBeenCalled();
    });


    it('should disable decline and approve button if confirmed', () => {
      matDialogSpy.open.mockReturnValue({
        afterClosed: () => of({ confirm: true, payload: { comment: 'A Comment' } })
      });
      component.confirmApprove();
      fixture.detectChanges();

      expect(component.discardButtonDisabled).toBeTruthy();
      expect(component.confirmButtonDisabled).toBeTruthy();
    })
  });

  describe('confirmDiscard()', () => {
    beforeEach(() => {
      jest.spyOn(component.discard, 'emit');
    });

    it('should emit discard if confirmed', () => {
      matDialogSpy.open.mockReturnValue({
        afterClosed: () => of({ confirm: true, payload: { comment: 'A Comment' } })
      });
      component.confirmDiscard();
      fixture.detectChanges();

      expect(component.discard.emit).toHaveBeenCalledWith({
        taskId: 1,
        payload: { comment: 'A Comment' }
      });
    });

    it('should not emit discard if not confirmed', () => {
      matDialogSpy.open.mockReturnValue({ afterClosed: () => of({ confirm: false }) });
      component.confirmDiscard();
      fixture.detectChanges();

      expect(component.discard.emit).not.toHaveBeenCalled();
    });

    it('should disable decline and approve button if confirmed', () => {
      matDialogSpy.open.mockReturnValue({
        afterClosed: () => of({ confirm: true, payload: { comment: 'A Comment' } })
      });
      component.confirmDiscard();
      fixture.detectChanges();

      expect(component.discardButtonDisabled).toBeTruthy();
      expect(component.confirmButtonDisabled).toBeTruthy();
    })
  });
});
