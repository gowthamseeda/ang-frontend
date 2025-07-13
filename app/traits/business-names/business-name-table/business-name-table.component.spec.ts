import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { NgxPermissionsAllowStubDirective } from 'ngx-permissions';
import { of } from 'rxjs';

import { BrandMock } from '../../../services/brand/brand.mock';
import { Brand as BrandServiceBrand } from '../../../services/brand/brand.model';
import { BrandService } from '../../../services/brand/brand.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import { Brand } from '../../brand.model';
import { FlatBusinessName, GroupedBusinessName } from '../business-names.model';
import { getGroupedBusinessNames } from '../business-names.mock';
import { BusinessNamesService } from '../business-names.service';

import { BusinessNameTableComponent } from './business-name-table.component';
import { BusinessNameTableService } from './business-name-table.service';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ confirmed: true })
    };
  }
}

@Component({
  template:
    '<gp-business-name-table [outletId]="outletId" ' +
    '[currentLanguage]="activeTranslation" ' +
    '[countryLanguages]="countryLanguages" ' +
    '[defaultLanguageId]="defaultLanguageId" ' +
    '[isInTranslationEditMode]="isInTranslationEditMode"></gp-business-name-table>'
})
class TestComponent {
  outletId = 'GS1234567';
  activeTranslation = 'de-DE';
  countryLanguages = ['de-DE', 'en-EN'];
  defaultLanguageId = 'de-DE';
  isInTranslationEditMode = false;

  @ViewChild(BusinessNameTableComponent)
  public businessNameTable: BusinessNameTableComponent;
}

describe('BusinessNameTableComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let businessNamesServiceSpy: Spy<BusinessNamesService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let brandServiceSpy: Spy<BrandService>;
  let businessNamesMock: GroupedBusinessName[];
  let brandsMock: BrandServiceBrand[];
  let businessNamesTableServiceSpy: Spy<BusinessNameTableService>;

  beforeEach(
    waitForAsync(() => {
      businessNamesMock = getGroupedBusinessNames();
      brandsMock = BrandMock.asList();
      businessNamesServiceSpy = createSpyFromClass(BusinessNamesService);
      snackBarServiceSpy = createSpyFromClass(SnackBarService);
      brandServiceSpy = createSpyFromClass(BrandService);
      businessNamesTableServiceSpy = createSpyFromClass(BusinessNameTableService);

      businessNamesServiceSpy.get.nextWith(businessNamesMock);
      brandServiceSpy.getAllForUserDataRestrictions.nextWith(brandsMock);
      businessNamesServiceSpy.save.nextWith({});

      TestBed.configureTestingModule({
        declarations: [BusinessNameTableComponent, TestComponent, NgxPermissionsAllowStubDirective],
        imports: [
          NoopAnimationsModule,
          MatSelectModule,
          MatFormFieldModule,
          MatTableModule,
          MatInputModule,
          ReactiveFormsModule,
          NoopAnimationsModule,
          TestingModule
        ],
        providers: [
          { provide: BusinessNamesService, useValue: businessNamesServiceSpy },
          { provide: MatDialog, useClass: MatDialogMock },
          { provide: SnackBarService, useValue: snackBarServiceSpy },
          { provide: BrandService, useValue: brandServiceSpy },
          { provide: BusinessNameTableService, useValue: businessNamesTableServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChange', () => {
    it('should load all business names', () => {
      expect(component.businessNameTable.businessNamesRows.value.length).toEqual(
        businessNamesMock.length
      );
    });

    it('should disable the add button when in translation mode', () => {
      component.isInTranslationEditMode = true;
      fixture.detectChanges();
      const addButton = fixture.debugElement.query(By.css('.add-business-name'));

      expect(addButton).toBeNull();
    });

    it('should hide the delete button of row if in translation mode', () => {
      component.isInTranslationEditMode = true;
      fixture.detectChanges();
      const rows = fixture.nativeElement.querySelector('.mat-mdc-table').querySelectorAll('.mat-mdc-row');
      const lastRow = rows[rows.length - 1];
      const cells = lastRow.querySelectorAll('mat-cell');
      const actionsCell = cells[cells.length - 1];

      expect(actionsCell.querySelector('button')).toBeNull();
    });
  });

  describe('addNewRow', () => {
    it('should add empty row', () => {
      component.businessNameTable.addNewRow();

      const lastRow = component.businessNameTable.businessNamesRows.at(
        component.businessNameTable.businessNamesRows.length - 1
      );
      expect(lastRow.value.name).toEqual('');
    });
  });

  describe('isAddButtonDisabled', () => {
    it('should disable the add button when an empty row exists', () => {
      component.businessNameTable.addNewRow();
      component.businessNameTable.isAddButtonDisabled();
      fixture.detectChanges();
      const addButton = fixture.debugElement.query(By.css('.add-business-name[disabled]'));

      expect(addButton).toBeDefined();
    });

    it('should disable the add button when business name table form is disabled', () => {
      component.businessNameTable._disabled = true;
      component.businessNameTable.isAddButtonDisabled();
      fixture.detectChanges();
      const addButton = fixture.debugElement.query(By.css('.add-business-name[disabled]'));

      expect(addButton).toBeDefined();
    });

    it('should disable the add button when no selectable brandIds available', () => {
      component.businessNameTable.availableBrandIds = [];
      component.businessNameTable.isAddButtonDisabled();
      fixture.detectChanges();
      const addButton = fixture.debugElement.query(By.css('.add-business-name[disabled]'));

      expect(addButton).toBeDefined();
    });
  });

  describe('showDeleteConfirmationDialog', () => {
    it('should set deleted flag', () => {
      const lastRow = component.businessNameTable.businessNamesRows.at(
        component.businessNameTable.businessNamesRows.length - 1
      ) as UntypedFormGroup;

      component.businessNameTable.showDeleteConfirmationDialog(lastRow);

      expect(lastRow.value.deleted).toBeTruthy();
    });

    it('should filter deleted row in table', () => {
      const lastRow = component.businessNameTable.businessNamesRows.at(
        component.businessNameTable.businessNamesRows.length - 1
      ) as UntypedFormGroup;

      component.businessNameTable.showDeleteConfirmationDialog(lastRow);

      expect(component.businessNameTable.dataSource.filteredData).not.toContain(lastRow);
    });
  });

  describe('filteredBrandIds', () => {
    it('should contain all brand ids already in use', () => {
      const filteredBrandIds = component.businessNameTable.filteredBrandIds(
        component.businessNameTable.businessNamesRows.controls.find(
          control => control.value.name === 'Business Name 1'
        ) as UntypedFormControl
      );

      expect(filteredBrandIds).toEqual(['MYB', 'BAB']);
    });
  });

  describe('getInputFormControl', () => {
    it('should return base data control', () => {
      component.businessNameTable.defaultLanguageId = 'de-DE';
      component.businessNameTable.currentLanguage = 'de-DE';
      const firstRow = component.businessNameTable.businessNamesRows.at(0) as UntypedFormGroup;

      const control = component.businessNameTable.getInputFormControl(firstRow) as AbstractControl;

      expect(control.value).toEqual('Business Name 1');
    });

    it('should return translation control', () => {
      component.businessNameTable.defaultLanguageId = 'de-DE';
      component.businessNameTable.currentLanguage = 'en-EN';
      const firstRow = component.businessNameTable.businessNamesRows.at(0) as UntypedFormGroup;

      const control = component.businessNameTable.getInputFormControl(firstRow) as AbstractControl;

      expect(control.value).toEqual('My translated name 1');
    });
  });

  describe('save', () => {
    it('should call service with correct amount of creates/updates/deletes', () => {
      const row = component.businessNameTable.businessNamesRows.controls.find(
        control => control.value.name === 'Business Name 2'
      ) as UntypedFormControl;

      row.patchValue(
        {
          brands: [new Brand('BAB'), new Brand('FUSO')],
          translations: [{ languageId: 'en-EN', name: 'New Translation' }]
        },
        { onlySelf: false }
      );

      component.businessNameTable.save();

      const expectedDeleteMYB: FlatBusinessName = {
        businessName: 'Business Name 2',
        brandId: 'MYB',
        translations: [
          {
            name: 'New Translation',
            languageId: 'en-EN'
          }
        ]
      };
      const expectedPostFUSO: FlatBusinessName = {
        businessName: 'Business Name 2',
        brandId: 'FUSO',
        translations: [
          {
            name: 'New Translation',
            languageId: 'en-EN'
          }
        ]
      };
      const expectedUpdateBAB: FlatBusinessName = {
        businessName: 'Business Name 2',
        brandId: 'BAB',
        translations: [
          {
            name: 'New Translation',
            languageId: 'en-EN'
          }
        ]
      };

      expect(businessNamesServiceSpy.save).toHaveBeenCalledWith(
        'GS1234567',
        [expectedPostFUSO],
        [expectedUpdateBAB],
        [expectedDeleteMYB]
      );
    });

    it('should call service when changing business name translation', () => {
      const row = component.businessNameTable.businessNamesRows.controls.find(
        control => control.value.name === 'Business Name 2'
      ) as UntypedFormControl;

      row.patchValue(
        { translations: [{ languageId: 'en-EN', name: 'New Translation' }] },
        { onlySelf: false }
      );

      component.businessNameTable.save();

      const expectedUpdateMYB: FlatBusinessName = {
        businessName: 'Business Name 2',
        brandId: 'MYB',
        translations: [
          {
            name: 'New Translation',
            languageId: 'en-EN'
          }
        ]
      };
      const expectedUpdateBAB: FlatBusinessName = {
        businessName: 'Business Name 2',
        brandId: 'BAB',
        translations: [
          {
            name: 'New Translation',
            languageId: 'en-EN'
          }
        ]
      };

      expect(businessNamesServiceSpy.save).toHaveBeenCalledWith(
        'GS1234567',
        [],
        [expectedUpdateMYB, expectedUpdateBAB],
        []
      );
    });

    it('should call service when deleting business name', () => {
      const row = component.businessNameTable.businessNamesRows.controls.find(
        control => control.value.name === 'Business Name 1'
      ) as UntypedFormControl;
      row.patchValue({ deleted: true }, { onlySelf: false });

      component.businessNameTable.save();

      const expectedDeletedMB: FlatBusinessName = {
        businessName: 'Business Name 1',
        brandId: 'MB',
        translations: [
          {
            name: 'My translated name 1',
            languageId: 'en-EN'
          }
        ]
      };
      const expectedDeletedSMT: FlatBusinessName = {
        businessName: 'Business Name 1',
        brandId: 'SMT',
        translations: [
          {
            name: 'My translated name 1',
            languageId: 'en-EN'
          }
        ]
      };

      expect(businessNamesServiceSpy.save).toHaveBeenCalledWith(
        'GS1234567',
        [],
        [],
        [expectedDeletedMB, expectedDeletedSMT]
      );
    });

    it('should call service when changing business name', () => {
      const row = component.businessNameTable.businessNamesRows.controls.find(
        control => control.value.name === 'Business Name 2'
      ) as UntypedFormControl;
      row.patchValue({ name: 'My new business name 2' }, { onlySelf: false });

      component.businessNameTable.save();

      const expectedUpdateMYB: FlatBusinessName = {
        businessName: 'My new business name 2',
        brandId: 'MYB',
        translations: [
          {
            name: 'My translated name 2',
            languageId: 'en-EN'
          }
        ]
      };
      const expectedUpdateBAB: FlatBusinessName = {
        businessName: 'My new business name 2',
        brandId: 'BAB',
        translations: [
          {
            name: 'My translated name 2',
            languageId: 'en-EN'
          }
        ]
      };

      expect(businessNamesServiceSpy.save).toHaveBeenCalledWith(
        'GS1234567',
        [expectedUpdateMYB, expectedUpdateBAB],
        [],
        [expectedUpdateMYB, expectedUpdateBAB]
      );
    });

    it('should show a snackbar when update was successful', () => {
      businessNamesServiceSpy.save.complete();

      component.businessNameTable.save();
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith(
        'EDIT_BUSINESS_NAMES_UPDATE_SUCCESS'
      );
    });

    it('should show a snackbar when update was not successful', () => {
      const error = new Error('Error!');
      businessNamesServiceSpy.save.throwWith(error);
      component.businessNameTable.save();
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });

    it('should send a business names updated event when save was successful', () => {
      businessNamesServiceSpy.save.complete();

      component.businessNameTable.save();
      expect(businessNamesTableServiceSpy.namesSaved).toHaveBeenCalledWith(true);
    });

    it('should not send a business names updated event when saving failed', () => {
      const error = new Error('Error!');
      businessNamesServiceSpy.save.throwWith(error);
      component.businessNameTable.save();
      expect(businessNamesTableServiceSpy.namesSaved).toHaveBeenCalledTimes(0);
    });
  });
});
