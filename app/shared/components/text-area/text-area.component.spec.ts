import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { TextAreaComponent } from './text-area.component';
import { VerificationTaskFormStatus } from "../../../tasks/task.model";
import {MatDialog} from "@angular/material/dialog";
import {createSpyFromClass, Spy} from "jest-auto-spies";

describe('TextAreaComponent', () => {
  let component: TextAreaComponent;
  let fixture: ComponentFixture<TextAreaComponent>;
  let matDialogSpy: Spy<MatDialog>;

  beforeEach(
    waitForAsync(() => {
      matDialogSpy = createSpyFromClass(MatDialog);
      TestBed.configureTestingModule({
        declarations: [TextAreaComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          { provide: MatDialog, useValue: matDialogSpy }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TextAreaComponent);
    component = fixture.componentInstance;
    const mockValue = 'test';
    component.form = new FormGroup({ textArea: new FormControl(mockValue) });
    component.isForRetailEnabled = true
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onKeyUp should', () => {
    beforeEach(() => {
      const controlName = 'textArea';
      const mockValue = 'test';
      const mockControl = new FormControl(mockValue);

      spyOn(component.form, 'get').and.callFake((name: string) => {
        return name === controlName ? mockControl : null;
      });
      component.isBSR = true;
      component.verificationTaskStatus = VerificationTaskFormStatus.PENDING;
      fixture.detectChanges();
    });
    test(`should set verificationTaskStatus to REMAIN when the field value is the same`, () => {
      const mockEvent = new KeyboardEvent("keyup", {
        key: "Enter",
        code: "Enter",
      });
      component.fieldInitialValue = 'test';
      fixture.detectChanges();
      component.onKeyUp(mockEvent);
      expect(component.verificationTaskStatus).toStrictEqual(VerificationTaskFormStatus.REMAIN);
    });
    test(`should set verificationTaskStatus to CHANGED when the field value is not the same`, () => {
      const mockEvent = new KeyboardEvent("keyup", {
        key: "Enter",
        code: "Enter",
      });
      component.fieldInitialValue = 'test1';
      fixture.detectChanges();
      component.onKeyUp(mockEvent);
      expect(component.verificationTaskStatus).toStrictEqual(VerificationTaskFormStatus.CHANGED);
    });
  });
  describe('onKeyUp when isMTR should', () => {
    let mockControl: FormControl;

    beforeEach(() => {
      const controlName = 'textArea';
      const mockValue = 'test';
      mockControl = new FormControl(mockValue);
      component.controlName = controlName;
      component.form.controls[controlName] = mockControl;

      spyOn(component.form, 'get').and.callFake((name: string) => {
        return name === controlName ? mockControl : null;
      });
      spyOn(component.form.controls[controlName], 'setValue');
      component.isMTR = true;
      component.taskForDisplay.shouldDisplayFutureValue = true,
        fixture.detectChanges();
    });

    it('should test value to', () => {
      const mockEvent = new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
      });
      component.onKeyDown(mockEvent);
      expect(component.form.get('textArea')?.value).toBe('test');
      expect(matDialogSpy.open).toHaveBeenCalled();
    });
  });
});
