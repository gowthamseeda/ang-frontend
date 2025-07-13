import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { NgxPermissionsAllowStubDirective, NgxPermissionsService } from 'ngx-permissions';
import { BehaviorSubject, of } from 'rxjs';

import { UserDataRestrictions } from '../../../../iam/user/user.model';
import { UserService } from '../../../../iam/user/user.service';
import { Outlet } from '../../../../legal-structure/shared/models/outlet.model';
import { OutletService } from '../../../../legal-structure/shared/services/outlet.service';
import { BrandMock } from '../../../../services/brand/brand.mock';
import { Brand } from '../../../../services/brand/brand.model';
import { BrandService } from '../../../../services/brand/brand.service';
import { ContentLoaderService } from '../../../../shared/components/content-loader/content-loader.service';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../../testing/testing.module';
import { DistributionLevelsService } from '../../../distribution-levels/distribution-levels.service';
import { LabelService } from '../../label.service';
import {
  AssignedBrandLabel,
  FlatAssignedBrandLabel,
  GroupedAssignedBrandLabel
} from '../assigned-brand-label';
import { getAssignedBrandLabels, getBrandLabelAssignments } from '../assigned-brand-labels.mock';
import { AssignedBrandLabelsService } from '../assigned-brand-labels.service';

import { AssignedBrandLabelTableComponent } from './assigned-brand-label-table.component';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of({ confirmed: true })
    };
  }
}

class ContentLoaderServiceStub {
  visibleChanges = new BehaviorSubject<boolean>(false);
}

@Component({
  template:
    '<gp-assigned-brand-label-table [outletId]="outletId"' +
    ' [isInTranslationEditMode]="isInTranslationEditMode"' +
    ' [disabled]="false"></gp-assigned-brand-label-table>'
})
class TestComponent {
  outletId = 'GS1234567';
  isInTranslationEditMode = false;

  @ViewChild(AssignedBrandLabelTableComponent)
  public assignedBrandLabelTable: AssignedBrandLabelTableComponent;
}

describe('AssignedBrandLabelTableComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let assignedBrandLabelsService: Spy<AssignedBrandLabelsService>;
  let brandServiceSpy: Spy<BrandService>;
  let userServiceSpy: Spy<UserService>;
  let labelServiceSpy: Spy<LabelService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let distributionLevelServiceSpy: Spy<DistributionLevelsService>;
  let outletServiceSpy: Spy<OutletService>;
  let contentLoaderServiceStub: any;
  let brandsMock: Brand[];
  let userRestrictionsMock: UserDataRestrictions;
  let brandLabelAssignmentsMock: AssignedBrandLabel[];
  let assignedBrandLabels: GroupedAssignedBrandLabel[];
  let permissionServiceSpy: Spy<NgxPermissionsService>;

  beforeEach(
    waitForAsync(() => {
      brandLabelAssignmentsMock = getBrandLabelAssignments();
      assignedBrandLabels = getAssignedBrandLabels();
      assignedBrandLabelsService = createSpyFromClass(AssignedBrandLabelsService);
      snackBarServiceSpy = createSpyFromClass(SnackBarService);
      distributionLevelServiceSpy = createSpyFromClass(DistributionLevelsService);
      outletServiceSpy = createSpyFromClass(OutletService);
      userRestrictionsMock = new UserDataRestrictions();
      brandsMock = BrandMock.asList();
      brandServiceSpy = createSpyFromClass(BrandService);
      userServiceSpy = createSpyFromClass(UserService);
      labelServiceSpy = createSpyFromClass(LabelService);
      contentLoaderServiceStub = new ContentLoaderServiceStub();
      permissionServiceSpy = createSpyFromClass(NgxPermissionsService);

      userServiceSpy.getUserDataRestrictions.nextWith(userRestrictionsMock);
      assignedBrandLabelsService.getBrandLabelAssignments.nextWith(brandLabelAssignmentsMock);
      assignedBrandLabelsService.getAssignedBrandLabels.nextWith(assignedBrandLabels);
      brandServiceSpy.getAllForUserDataRestrictions.nextWith(brandsMock);
      labelServiceSpy.getAllAssignable.nextWith([]);
      distributionLevelServiceSpy.get.nextWith([]);
      outletServiceSpy.getOrLoadBusinessSite.nextWith({ countryId: 'DE' } as Outlet);

      TestBed.configureTestingModule({
        declarations: [
          AssignedBrandLabelTableComponent,
          TestComponent,
          NgxPermissionsAllowStubDirective
        ],
        imports: [
          NoopAnimationsModule,
          MatSelectModule,
          MatFormFieldModule,
          MatTableModule,
          MatInputModule,
          ReactiveFormsModule,
          TestingModule
        ],
        providers: [
          { provide: AssignedBrandLabelsService, useValue: assignedBrandLabelsService },
          { provide: BrandService, useValue: brandServiceSpy },
          { provide: MatDialog, useClass: MatDialogMock },
          { provide: SnackBarService, useValue: snackBarServiceSpy },
          { provide: UserService, useValue: userServiceSpy },
          { provide: LabelService, useValue: labelServiceSpy },
          { provide: DistributionLevelsService, useValue: distributionLevelServiceSpy },
          { provide: OutletService, useValue: outletServiceSpy },
          { provide: ContentLoaderService, useValue: contentLoaderServiceStub },
          { provide: NgxPermissionsService, useValue: permissionServiceSpy }
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
    it('should load all assigned brand availableLabels', () => {
      expect(component.assignedBrandLabelTable.assignedBrandLabelRows.value.length).toEqual(2);
    });

    it('should disable the add button when in translation mode', () => {
      component.isInTranslationEditMode = true;
      fixture.detectChanges();
      const addButton = fixture.debugElement.query(By.css('.add-assigned-brand-label'));

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
      component.assignedBrandLabelTable.addNewRow();

      const lastRow = component.assignedBrandLabelTable.assignedBrandLabelRows.at(
        component.assignedBrandLabelTable.assignedBrandLabelRows.length - 1
      );
      expect(lastRow.value.labelId).toEqual(null);
    });
  });

  describe('isAddButtonDisabled', () => {
    it('should disable the add button when an empty row exists', () => {
      component.assignedBrandLabelTable.addNewRow();
      component.assignedBrandLabelTable.isAddButtonDisabled();
      fixture.detectChanges();
      const addButton = fixture.debugElement.query(By.css('.add-business-name[disabled]'));

      expect(addButton).toBeDefined();
    });

    it('should disable the add button when assigned brand label table form is disabled', () => {
      component.assignedBrandLabelTable._disabled = true;
      component.assignedBrandLabelTable.isAddButtonDisabled();
      fixture.detectChanges();
      const addButton = fixture.debugElement.query(By.css('.add-business-name[disabled]'));

      expect(addButton).toBeDefined();
    });

    it('should disable the add button when no selectable brandIds available', () => {
      component.assignedBrandLabelTable.allBrandIds = [];
      component.assignedBrandLabelTable.isAddButtonDisabled();
      fixture.detectChanges();
      const addButton = fixture.debugElement.query(By.css('.add-business-name[disabled]'));

      expect(addButton).toBeDefined();
    });
  });

  describe('showDeleteConfirmationDialog', () => {
    it('should filter deleted row in table', () => {
      const lastRow = component.assignedBrandLabelTable.assignedBrandLabelRows.at(
        component.assignedBrandLabelTable.assignedBrandLabelRows.length - 1
      ) as FormGroup;

      component.assignedBrandLabelTable.showDeleteConfirmationDialog(lastRow);

      expect(component.assignedBrandLabelTable.dataSource.filteredData).not.toContain(lastRow);
    });
  });

  describe('save', () => {
    beforeEach(() => {
      assignedBrandLabelsService.save.nextWith();
    });

    it('should call service with correct amount of creates/deletes', () => {
      const row = component.assignedBrandLabelTable.assignedBrandLabelRows.controls.find(
        control => control.value.labelId === 2
      ) as FormControl;

      row.patchValue(
        {
          brands: [{ brandId: 'BAB' }, { brandId: 'FUSO' }]
        },
        { onlySelf: false }
      );

      component.assignedBrandLabelTable.save();

      const expectedDeleteMYB: FlatAssignedBrandLabel = {
        labelId: 2,
        brandId: 'MYB'
      };
      const expectedPostFUSO: FlatAssignedBrandLabel = {
        labelId: 2,
        brandId: 'FUSO'
      };

      expect(assignedBrandLabelsService.save).toHaveBeenCalledWith(
        'GS1234567',
        [expectedPostFUSO],
        [expectedDeleteMYB]
      );
    });

    it('should call service when deleting label', () => {
      const row = component.assignedBrandLabelTable.assignedBrandLabelRows.controls.find(
        control => control.value.labelId === 1
      ) as FormControl;
      row.patchValue({ deleted: true }, { onlySelf: false });

      component.assignedBrandLabelTable.save();

      const expectedDeletedMB: FlatAssignedBrandLabel = {
        labelId: 1,
        brandId: 'MB'
      };
      const expectedDeletedSMT: FlatAssignedBrandLabel = {
        labelId: 1,
        brandId: 'SMT'
      };

      expect(assignedBrandLabelsService.save).toHaveBeenCalledWith(
        'GS1234567',
        [],
        [expectedDeletedMB, expectedDeletedSMT]
      );
    });

    it('should call service when changing label', () => {
      const row = component.assignedBrandLabelTable.assignedBrandLabelRows.controls.find(
        control => control.value.labelId === 2
      ) as FormControl;
      row.patchValue({ labelId: 3 }, { onlySelf: false });

      component.assignedBrandLabelTable.save();

      const expectedDeleteMYB: FlatAssignedBrandLabel = {
        labelId: 2,
        brandId: 'MYB'
      };
      const expectedDeleteBAB: FlatAssignedBrandLabel = {
        labelId: 2,
        brandId: 'BAB'
      };
      const expectedPostMYB: FlatAssignedBrandLabel = {
        labelId: 3,
        brandId: 'MYB'
      };
      const expectedPostBAB: FlatAssignedBrandLabel = {
        labelId: 3,
        brandId: 'BAB'
      };

      expect(assignedBrandLabelsService.save).toHaveBeenCalledWith(
        'GS1234567',
        [expectedPostMYB, expectedPostBAB],
        [expectedDeleteMYB, expectedDeleteBAB]
      );
    });

    it('should show a snackbar when update was successful', () => {
      assignedBrandLabelsService.save.complete();

      component.assignedBrandLabelTable.save();
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('EDIT_BRAND_LABELS_UPDATE_SUCCESS');
    });

    it('should show a snackbar when update was not successful', () => {
      const error = new Error('Error!');
      assignedBrandLabelsService.save.throwWith(error);
      component.assignedBrandLabelTable.save();
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });

  describe('availableBrandIds', () => {
    it('should contain all brand ids from brand codes', () => {
      const lastRow = component.assignedBrandLabelTable.assignedBrandLabelRows.at(
        component.assignedBrandLabelTable.assignedBrandLabelRows.length - 1
      ) as FormGroup;

      const availableBrandIds = component.assignedBrandLabelTable.availableBrandIds(
        lastRow.value.labelId
      );
      const expected = brandsMock.map(brand => brand.id);

      expect(availableBrandIds).toEqual(expected);
    });
  });
});
