import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';
import { getBusinessSiteDataRestrictionMock } from '../../../data-restriction/data-restriction.mock';
import { DataRestrictionService } from '../../../data-restriction/data-restriction.service';

import { BusinessSiteSelectDialogComponent } from './business-site-select-dialog.component';

describe('BusinessSiteSelectDialogComponent', () => {
  let component: BusinessSiteSelectDialogComponent;
  let fixture: ComponentFixture<BusinessSiteSelectDialogComponent>;
  let dataRestrictionServiceSpy: Spy<DataRestrictionService>;

  beforeEach(
    waitForAsync(() => {
      dataRestrictionServiceSpy = createSpyFromClass(DataRestrictionService);

      TestBed.configureTestingModule({
        declarations: [BusinessSiteSelectDialogComponent, TranslatePipeMock],
        imports: [MatAutocompleteModule, ReactiveFormsModule],
        providers: [
          { provide: DataRestrictionService, useValue: dataRestrictionServiceSpy },
          { provide: MatDialogRef, useValue: {} },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {
              dataRestrictionId: 'BusinessSite',
              assignedDataRestrictionValues: ['GS1234567', 'GS1234568']
            }
          }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessSiteSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it(
      'should init found businessSite restriction ids from the Data Restriction Service filtered' +
        ' by already assigned id´s',
      () => {
        dataRestrictionServiceSpy.getBusinessSiteIds.nextWith(getBusinessSiteDataRestrictionMock());
        component.form.controls['businessSiteId'].setValue('GS');
        fixture.detectChanges();
        expect(component.foundBusinessSiteIds).toEqual({
          ids: ['GS1234569']
        });
      }
    );

    it('should init available data restriction values empty when something goes wrong', () => {
      dataRestrictionServiceSpy.getBusinessSiteIds.throwWith('error');
      expect(component.foundBusinessSiteIds).toEqual({
        ids: []
      });
    });
  });
});
