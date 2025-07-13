import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { BrandMock } from '../../../services/brand/brand.mock';
import { Brand } from '../../../services/brand/brand.model';
import { BrandService } from '../../../services/brand/brand.service';
import { FeatureToggleDirective } from '../../../shared/directives/feature-toggle/feature-toggle.directive';
import { FeatureToggleService } from '../../../shared/directives/feature-toggle/feature-toggle.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import { Brand as TraitsBrand } from '../../brand.model';
import { ExternalKey } from '../../external-key/external-key.model';
import { ExternalKeyService } from '../../external-key/external-key.service';
import { GroupedKey } from '../key.model';
import { KeyType } from '../key-type.model';
import { getExternalKeysMock, getGroupedKeysMock } from '../key.mock';
import { KeysService } from '../keys.service';

import { KeyTableComponent } from './key-table.component';
import { KeyTableService } from './key-table.service';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ confirmed: true })
    };
  }
}

@Component({
  template:
    '<gp-key-table outletId="GS123" [countryId]="countryId"' + ' [disabled]="false"></gp-key-table>'
})
class TestComponent {
  @ViewChild(KeyTableComponent)
  public keyTable: KeyTableComponent;
  countryId = 'FR';
}

describe('KeyTableComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let keysServiceSpy: Spy<KeysService>;
  let keyTableServiceSpy: Spy<KeyTableService>;
  let brandServiceSpy: Spy<BrandService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let externalKeyServiceSpy: Spy<ExternalKeyService>;
  let featureToggleServiceSpy: Spy<FeatureToggleService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  const userAuthorizationServiceMock = {
    isAuthorizedFor: {
      permissions: () => userAuthorizationServiceSpy
    }
  };
  let keysMock: GroupedKey[];
  let brandsMock: Brand[];
  let externalKeysMock: ExternalKey[];

  beforeEach(
    waitForAsync(() => {
      keysMock = getGroupedKeysMock();
      externalKeysMock = getExternalKeysMock();
      keysServiceSpy = createSpyFromClass(KeysService);
      keyTableServiceSpy = createSpyFromClass(KeyTableService);
      brandsMock = BrandMock.asList();
      brandServiceSpy = createSpyFromClass(BrandService);
      snackBarServiceSpy = createSpyFromClass(SnackBarService);
      externalKeyServiceSpy = createSpyFromClass(ExternalKeyService);
      featureToggleServiceSpy = createSpyFromClass(FeatureToggleService);
      userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);

      brandServiceSpy.getAll.nextWith(brandsMock);
      brandServiceSpy.getFilteredBrands.nextWith(brandsMock);
      keysServiceSpy.get.nextWith(keysMock);
      keysServiceSpy.getUpdatableKeyTypesBy.nextWith([KeyType.BRAND_CODE]);
      externalKeyServiceSpy.getAll.nextWith(externalKeysMock);
      featureToggleServiceSpy.isFeatureEnabled.nextWith(true);
      userAuthorizationServiceSpy.verify.nextWith(true);

      TestBed.configureTestingModule({
        declarations: [KeyTableComponent, TestComponent, FeatureToggleDirective],
        imports: [
          NoopAnimationsModule,
          MatSortModule,
          MatSelectModule,
          MatFormFieldModule,
          MatTableModule,
          MatInputModule,
          ReactiveFormsModule,
          NoopAnimationsModule,
          TestingModule
        ],
        providers: [
          { provide: KeysService, useValue: keysServiceSpy },
          { provide: KeyTableService, useValue: keyTableServiceSpy },
          { provide: BrandService, useValue: brandServiceSpy },
          { provide: MatDialog, useClass: MatDialogMock },
          { provide: SnackBarService, useValue: snackBarServiceSpy },
          { provide: ExternalKeyService, useValue: externalKeyServiceSpy },
          { provide: FeatureToggleService, useValue: featureToggleServiceSpy },
          { provide: UserAuthorizationService, useValue: userAuthorizationServiceMock }
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

  describe('ngOnInit', () => {
    it('should load all keys', () => {
      keysServiceSpy.get.nextWith(keysMock);
      expect(component.keyTable.keyRows.value.length).toEqual(keysMock.length);
    });

    it('should load external keys', () => {
      expect(component.keyTable.externalKeysRows.value.length).toEqual(externalKeysMock.length);
    });

    it('should enable form controls when updatable keys are present', () => {
      expect(component.keyTable.keyRows.enabled).toBeTruthy();
    });

    it('should disable form controls when no updatable keys are present', () => {
      keysServiceSpy.getUpdatableKeyTypesBy.nextWith([]);
      expect(component.keyTable.keysForm.disabled).toBeFalsy();
    });
  });

  describe('addNewRow', () => {
    it('should add empty row', () => {
      component.keyTable.addNewRow();
      const lastKey = component.keyTable.keyRows.at(component.keyTable.keyRows.length - 1);
      expect(lastKey.value.type).toBeNull();
    });

    it('should reset brand ids when switching type', () => {
      component.keyTable.addNewRow();

      const lastKey = component.keyTable.keyRows.at(component.keyTable.keyRows.length - 1);
      (lastKey.get('type') as UntypedFormControl).setValue(KeyType.BRAND_CODE);

      const brands = lastKey.get('brands') as UntypedFormControl;

      expect(brands.value).toEqual([]);
    });

    it('should not add multiple empty rows', () => {
      keysServiceSpy.get.nextWith(keysMock);
      component.keyTable.addNewRow();
      component.keyTable.addNewRow();
      expect(component.keyTable.keyRows.length).toEqual(
        2 /* existing key rows */ + 1 /* new key row */
      );
    });

    it('should not add multiple equal rows', () => {
      keysServiceSpy.get.nextWith(keysMock);
      component.keyTable.addNewRow();

      const lastKey = component.keyTable.keyRows.at(component.keyTable.keyRows.length - 1);
      (lastKey.get('type') as UntypedFormControl).setValue(KeyType.BRAND_CODE);

      component.keyTable.addNewRow();

      expect(component.keyTable.keyRows.length).toEqual(
        2 /* existing key rows */ + 1 /* new key row */
      );
    });
  });

  describe('addNewExternalKeyRow', () => {
    it('should add empty row', () => {
      component.keyTable.addNewExternalKeyRow();
      const lastExternalKey = component.keyTable.externalKeysRows.at(
        component.keyTable.externalKeysRows.length - 1
      );
      expect(lastExternalKey.value.type).toBeUndefined();
    });

    it('should not add multiple empty rows', () => {
      component.keyTable.addNewExternalKeyRow();
      component.keyTable.addNewExternalKeyRow();
      component.keyTable.addNewExternalKeyRow();
      expect(component.keyTable.externalKeysRows.value.length).toEqual(externalKeysMock.length + 1);
    });
  });

  describe('showDeleteConfirmationDialog', () => {
    it('should filter deleted row', () => {
      keysServiceSpy.get.nextWith(keysMock);
      const lastKey = component.keyTable.keyRows.at(
        component.keyTable.keyRows.length - 1
      ) as UntypedFormGroup;

      component.keyTable.showDeleteConfirmationDialog(lastKey);

      expect(component.keyTable.dataSource.filteredData).not.toContain(lastKey);
    });
  });

  describe('showExternalKeyDeleteConfirmationDialog', () => {
    it('should delete row', () => {
      const lastExternalKey = component.keyTable.externalKeysRows.at(
        component.keyTable.externalKeysRows.length - 1
      ) as UntypedFormGroup;

      component.keyTable.showExternalKeyDeleteConfirmationDialog(lastExternalKey);

      expect(component.keyTable.externalKeysRows.value.length).toEqual(externalKeysMock.length - 1);
    });
  });

  describe('assignedBrandIdsExceptOf currentKey', () => {
    it('should contain all brand ids already in use', () => {
      keysServiceSpy.get.nextWith(keysMock);
      const currentKeyRow = component.keyTable.keyRows.controls.find(
        control => control.value.key === '2211'
      ) as UntypedFormControl;

      expect(component.keyTable.assignedBrandIdsExceptOf(currentKeyRow)).toEqual(['FUSO']);
    });
  });

  describe('excludedKeyTypes', () => {
    let currentKeyRow: UntypedFormControl;

    beforeEach(() => {
      keysServiceSpy.get.nextWith(keysMock);
      currentKeyRow = component.keyTable.keyRows.controls.find(
        control => control.value.key === '2211'
      ) as UntypedFormControl;
    });

    it('should exclude type BRAND_CODE', done => {
      brandServiceSpy.getFilteredBrands.nextWith([]);

      component.keyTable.excludedKeyTypes(currentKeyRow).subscribe((keyTypes: KeyType[]) => {
        expect(keyTypes).toEqual([KeyType.BRAND_CODE]);
        done();
      });
    });

    it('should not exclude any types', done => {
      component.keyTable.excludedKeyTypes(currentKeyRow).subscribe((keyTypes: KeyType[]) => {
        expect(keyTypes).toEqual([]);
        done();
      });
    });
  });

  describe('selectedKeyTypes', () => {
    it('should contain selected types', () => {
      keysServiceSpy.get.nextWith(keysMock);
      const keyTypes = component.keyTable.selectedKeyTypes;

      expect(keyTypes).toContain(KeyType.BRAND_CODE);
    });

    it('should not contain types of deleted rows', () => {
      keysServiceSpy.get.nextWith([
        new GroupedKey(KeyType.ALIAS, 'Key', [{ brandId: 'MB', readonly: false }])
      ]);
      component.keyTable.keyRows.controls
        .filter(control => control.value.type === KeyType.ALIAS)
        .forEach(control => control.patchValue({ deleted: true }));

      const keyTypes = component.keyTable.selectedKeyTypes;

      expect(keyTypes).not.toContain(KeyType.ALIAS);
    });
  });

  describe('save', () => {
    it('should call keys service with changed objects', () => {
      keysServiceSpy.get.nextWith(keysMock);
      keysServiceSpy.update.nextWith();
      externalKeyServiceSpy.saveAll.nextWith();
      const row = component.keyTable.keyRows.controls.find(
        control => control.value.key === '2212'
      ) as UntypedFormControl;
      row.patchValue({ key: 'NEW123' }, { onlySelf: false });
      component.keyTable.save();

      expect(keysServiceSpy.update).toHaveBeenCalledWith(
        'GS123',
        [{ type: KeyType.BRAND_CODE, key: 'NEW123', brandId: 'FUSO' }],
        [{ type: KeyType.BRAND_CODE, key: '2212', brandId: 'FUSO' }]
      );
    });

    it('should call external keys service with changed objects', () => {
      keysServiceSpy.update.nextWith();
      externalKeyServiceSpy.saveAll.nextWith();
      const row = component.keyTable.externalKeysRows.controls.find(
        control => control.value.value === 'extKey01'
      ) as UntypedFormControl;
      row.get('brand')?.setValue(new TraitsBrand('SMT'));
      component.keyTable.save();

      expect(externalKeyServiceSpy.saveAll).toHaveBeenCalledWith('GS123', [
        new ExternalKey('COFICO01', 'extKey01', 'SMT'),
        new ExternalKey('COFICO02', 'extKey02', 'MB'),
        new ExternalKey('COFICO03', 'extKey03', 'MB', 'PC')
      ]);
    });

    it('should show a snackbar when update was successful', () => {
      keysServiceSpy.update.complete();
      externalKeyServiceSpy.saveAll.complete();

      component.keyTable.save();
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('EDIT_BRAND_KEYS_UPDATE_SUCCESS');
    });

    it('should show a snackbar when update was not successful', () => {
      const error = new Error('Error!');
      keysServiceSpy.update.throwWith(error);
      externalKeyServiceSpy.saveAll.nextWith();
      component.keyTable.save();
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });

    it('should send a keys updated event when save was successful', () => {
      keysServiceSpy.update.complete();
      externalKeyServiceSpy.saveAll.complete();

      component.keyTable.save();
      expect(keyTableServiceSpy.keysSaved).toHaveBeenCalledWith(true);
    });

    it('should not send a keys updated event when saving failed', () => {
      const error = new Error('Error!');
      keysServiceSpy.update.throwWith(error);
      externalKeyServiceSpy.saveAll.nextWith();
      component.keyTable.save();
      expect(keyTableServiceSpy.keysSaved).toHaveBeenCalledTimes(0);
    });
  });

  describe('external key responsibility', () => {
    it('should show external key add button when external key responsibility', () => {
      component.keyTable.reset();
      expect(component.keyTable.externalKeysForm.disabled).toBeFalsy();
    });
  });
});
