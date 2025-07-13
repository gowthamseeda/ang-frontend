import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { PredecessorDialogComponent } from './predecessor-dialog.component';

describe('PredecessorDialogComponent', () => {
  let component: PredecessorDialogComponent;
  let fixture: ComponentFixture<PredecessorDialogComponent>;
  let matDialogRef: MatDialogRef<unknown, unknown>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PredecessorDialogComponent],
        imports: [MatDialogModule],
        providers: [
          {
            provide: MatDialogRef,
            useValue: {
              close: jest.fn()
            }
          },
          MatDialog
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();

      matDialogRef = TestBed.inject(MatDialogRef);
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PredecessorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('closeDialog', () => {
    it('should call close', () => {
      component.closeDialog({
        id: 'GS001',
        type: 'type',
        payload: {}
      });

      expect(matDialogRef.close).toHaveBeenCalled();
    });
  });
});
