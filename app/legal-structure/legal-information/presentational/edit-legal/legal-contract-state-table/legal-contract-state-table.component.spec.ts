import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { ProductGroup } from '../../../../../services/product-group/product-group.model';
import { ProductGroupService } from '../../../../../services/product-group/product-group.service';

import { LegalContractStateTableComponent } from './legal-contract-state-table.component';

describe('ContractStateTableComponent', () => {
  let component: LegalContractStateTableComponent;
  let fixture: ComponentFixture<LegalContractStateTableComponent>;
  let productGroupServiceSpy: Spy<ProductGroupService>;
  const formArray = new UntypedFormArray([]);

  beforeEach(
    waitForAsync(() => {
      productGroupServiceSpy = createSpyFromClass(ProductGroupService);

      TestBed.configureTestingModule({
        declarations: [LegalContractStateTableComponent],
        providers: [{ provide: ProductGroupService, useValue: productGroupServiceSpy }],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    productGroupServiceSpy.getAll.nextWith([
      { id: 'UNIMOG', name: 'Unimog' } as ProductGroup,
      { id: 'PC', name: 'Passenger Car' } as ProductGroup
    ]);

    fixture = TestBed.createComponent(LegalContractStateTableComponent);
    component = fixture.componentInstance;
    component.formArray = formArray;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('removeIconClicked should', () => {
    const rowControl = new UntypedFormGroup({ id: new UntypedFormControl('any') });
    const formControls = new UntypedFormArray([rowControl]);

    beforeEach(() => {
      jest.spyOn(component.contractRemoved, 'emit');
    });

    test('emit the index of row to delete if row is enabled', () => {
      component.formArray = formControls;
      component.removeIconClicked(rowControl);
      expect(component.contractRemoved.emit).toHaveBeenCalledTimes(1);
      expect(component.contractRemoved.emit).toHaveBeenCalledWith(rowControl.value);
    });

    test('not emit if row is disabled', () => {
      rowControl.disable();
      component.formArray = formControls;
      component.removeIconClicked(rowControl);
      expect(component.contractRemoved.emit).toHaveBeenCalledTimes(0);
    });
  });

  describe('contractRequiredSelectionChange should', () => {
    const formGroup = new UntypedFormGroup({
      required: new UntypedFormControl(true),
      languageId: new UntypedFormControl('any'),
      contractState: new UntypedFormControl('any'),
      corporateDisclosure: new UntypedFormControl('any')
    });

    test('enable controls if required is true', () => {
      component.contractRequiredSelectionChange(formGroup);

      expect(formGroup.get('languageId')?.enabled).toBeTruthy();
      expect(formGroup.get('contractState')?.enabled).toBeTruthy();
      expect(formGroup.get('corporateDisclosure')?.enabled).toBeTruthy();
    });

    test('disable controls if required is false', () => {
      formGroup.setControl('required', new UntypedFormControl(false));
      component.contractRequiredSelectionChange(formGroup);

      expect(formGroup.get('languageId')?.disabled).toBeTruthy();
      expect(formGroup.get('contractState')?.disabled).toBeTruthy();
      expect(formGroup.get('corporateDisclosure')?.disabled).toBeTruthy();
    });
  });
});
