import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { InvestorDialogComponent } from './investor-dialog.component';

describe('InvestorDialogComponent', () => {
  let component: InvestorDialogComponent;
  let fixture: ComponentFixture<InvestorDialogComponent>;
  let matDialogRefSpy: Spy<MatDialogRef<unknown, unknown>>;

  beforeEach(
    waitForAsync(() => {
      matDialogRefSpy = createSpyFromClass(MatDialogRef);

      TestBed.configureTestingModule({
        declarations: [InvestorDialogComponent],
        providers: [{ provide: MatDialogRef, useValue: matDialogRefSpy }],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorDialogComponent);
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

      expect(matDialogRefSpy.close).toHaveBeenCalled();
    });
  });
});
