import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';

import { PopupComponent } from './popup.component';

describe('PopUpComponent', () => {
  let component: PopupComponent;
  let fixture: ComponentFixture<PopupComponent>;
  let matDialogSpy: Spy<MatDialog>;

  beforeEach(
    waitForAsync(() => {
      matDialogSpy = createSpyFromClass(MatDialog);

      TestBed.configureTestingModule({
        declarations: [PopupComponent],
        providers: [{ provide: MatDialog, useValue: matDialogSpy }]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openDialog()', () => {
    it('should open dialog', () => {
      matDialogSpy.open.mockReturnValue({
        afterClosed: () => of()
      });
      component.openDialog();
      expect(component.isOpened).toBeTruthy();
    });
  });

  describe('pop-up', () => {
    beforeEach(() => {
      matDialogSpy.open.mockReturnValue({
        afterClosed: () => of('closed'),
        close: () => {}
      });
    });

    it('should set isOpened to false after dialog is closed', done => {
      matDialogSpy
        .open()
        .afterClosed()
        .pipe(take(1))
        .subscribe(() => {
          expect(component.isOpened).toBeFalsy();
          done();
        });
      component.openDialog();
    });

    it('should close dialog', () => {
      component.openDialog();
      component.close();
      expect(component.isOpened).toBeFalsy();
    });
  });
});
