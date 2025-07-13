import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';
import { getDataRestrictionMock } from '../../../data-restriction/data-restriction.mock';
import { DataRestrictionService } from '../../../data-restriction/data-restriction.service';
import { SelectDialogComponent } from './select-dialog.component';

describe('SelectDialogComponent', () => {
  let component: SelectDialogComponent;
  let fixture: ComponentFixture<SelectDialogComponent>;
  let dataRestrictionServiceSpy: Spy<DataRestrictionService>;

  beforeEach(
    waitForAsync(() => {
      dataRestrictionServiceSpy = createSpyFromClass(DataRestrictionService);
      dataRestrictionServiceSpy.get.nextWith(getDataRestrictionMock());

      TestBed.configureTestingModule({
        declarations: [SelectDialogComponent, TranslatePipeMock],
        imports: [],
        providers: [
          { provide: DataRestrictionService, useValue: dataRestrictionServiceSpy },
          { provide: MatDialogRef, useValue: {} },
          {
            provide: MAT_DIALOG_DATA,
            useValue: { dataRestrictionId: 'Country', assignedDataRestrictionValues: ['FR'] }
          }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should init available data restriction values from the Data Restriction Service filtered by already assigned dataRestriction values', () => {
      expect(component.availableDataRestrictionValues).toEqual(['GB']);
    });

    it('should init available data restriction values empty when something goes wrong', () => {
      dataRestrictionServiceSpy.get.throwWith('error');
      expect(component.availableDataRestrictionValues).toEqual([]);
    });
  });
});
