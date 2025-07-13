import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { of } from 'rxjs';

import { PredecessorMock } from '../../predecessor/predecessor.mock';

import { PredecessorsTableComponent } from './predecessors-table.component';
import { TestingModule } from '../../../../testing/testing.module';

describe('PredecessorsTableComponent', () => {
  const predecessorMock = PredecessorMock.asList()[0].predecessors;

  let component: PredecessorsTableComponent;
  let fixture: ComponentFixture<PredecessorsTableComponent>;
  let matDialog: MatDialog;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PredecessorsTableComponent],
      imports: [TestingModule, MatDialogModule, MatTableModule],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn()
          }
        },
        MatDialog
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    matDialog = TestBed.inject(MatDialog);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredecessorsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should init all columns if there are predecessors', done => {
      component.predecessorItems = of(predecessorMock);
      fixture.detectChanges();

      component.columnsToDisplay.subscribe(columnsToDisplay => {
        expect(columnsToDisplay).toEqual(['legalName', 'address', 'brandCode', 'action']);
        done();
      });
    });

    describe('openSearchDialog', () => {
      beforeEach(() => {
        component.predecessorItems = of([]);
        jest.spyOn(component.addPredecessorItem, 'emit');
      });

      it('should emit add predecessor returned when closing search dialog', () => {
        spyOn(matDialog, 'open').and.returnValue({ afterClosed: () => of(predecessorMock[0]) });
        component.openSearchDialog();
        expect(component.addPredecessorItem.emit).toHaveBeenCalledWith(predecessorMock[0]);
      });

      it('should emit nothing if no predecessor is returned when closing search dialog', () => {
        spyOn(matDialog, 'open').and.returnValue({ afterClosed: () => of(undefined) });
        component.openSearchDialog();
        expect(component.addPredecessorItem.emit).not.toHaveBeenCalled();
      });
    });

    describe('openRemoveConfirmationDialog', () => {
      beforeEach(() => {
        component.predecessorItems = of(predecessorMock[0]);
        jest.spyOn(component.removePredecessorItem, 'emit');
      });

      it('should emit add predecessor returned when closing remove dialog', () => {
        spyOn(matDialog, 'open').and.returnValue({ afterClosed: () => of(true) });
        component.openRemoveConfirmationDialog('GS001');
        expect(component.removePredecessorItem.emit).toHaveBeenCalledWith('GS001');
      });

      it('should emit nothing if no predecessor is returned when closing remove dialog', () => {
        spyOn(matDialog, 'open').and.returnValue({ afterClosed: () => of(false) });
        component.openRemoveConfirmationDialog('GS001');
        expect(component.removePredecessorItem.emit).not.toHaveBeenCalled();
      });
    });
  });
});
