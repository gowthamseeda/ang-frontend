import { Component, Input, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule
} from '@angular/platform-browser/animations';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import moment from 'moment';

import { KeysPipe } from '../../../../shared/pipes/keys/keys.pipe';
import { LocaleService } from '../../../../shared/services/locale/locale.service';
import { TestingModule } from '../../../../testing/testing.module';
import { BrandProductGroup } from '../../../brand-product-group/brand-product-group.model';
import { Validity, ValidityTableRow } from '../../validity.model';

import { ValidityTableLayoutComponent } from './validity-table-layout.component';
import { OfferedServiceMock } from '../../../offered-service/offered-service.mock';

/*const validityTableRows = of([
  {
    application: true,
    applicationValidUntil: '2019-01-01',
    validFrom: '2019-01-02',
    validUntil: '2019-01-31',
    offeredServicesMap: { 'GS0000001-3': OfferedServiceMock.asMap()['GS0000001-3'] }
  }
] as ValidityTableRow[]);*/

const validityTableRows = [
  {
    application: true,
    applicationValidUntil: '2019-01-01',
    validFrom: '2019-01-02',
    validUntil: '2019-01-31',
    offeredServicesMap: { 'GS0000001-3': OfferedServiceMock.asMap()['GS0000001-3'] }
  }
] as ValidityTableRow[];

@Component({
  template: `
    <gp-validity-table-layout
      [brandProductGroups]="brandProductGroups"
      [validityTableRows]="validityTableRows"
      [userHasPermissions]="userHasPermissions"
      [brandRestrictions]="brandRestrictions"
      [productGroupRestrictions]="productGroupRestrictions"
    >
    </gp-validity-table-layout>
  `
})
class TestComponent {
  brandProductGroups = {
    MB: [
      { brandId: 'MB', productGroupId: 'PC' },
      { brandId: 'MB', productGroupId: 'VAN' }
    ] as BrandProductGroup[]
  };
  validityTableRows = validityTableRows;
  @Input() userHasPermissions: boolean;
  @Input() brandRestrictions: string[];
  @Input() productGroupRestrictions: string[];

  @ViewChild(ValidityTableLayoutComponent)
  public validityTableLayoutComponent: ValidityTableLayoutComponent;
}

describe('ValidityTableLayoutComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let localeServiceSpy: Spy<LocaleService>;

  beforeEach(waitForAsync(() => {
    localeServiceSpy = createSpyFromClass(LocaleService);
    localeServiceSpy.currentBrowserLocale.nextWith('en-GB');

    TestBed.configureTestingModule({
      declarations: [ValidityTableLayoutComponent, KeysPipe, TestComponent],
      imports: [
        NoopAnimationsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        TestingModule,
        MatTableModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        MatCheckboxModule
      ],
      providers: [
        KeysPipe,
        MatDatepickerModule,
        { provide: LocaleService, useValue: localeServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    component.userHasPermissions = true;
    component.brandRestrictions = [];
    component.productGroupRestrictions = [];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should init datasource of table', () => {
      expect(component.validityTableLayoutComponent.validityDataSource.data).toEqual(
        validityTableRows
      );
    });

    it('should init form', () => {
      const validityFormArray = component.validityTableLayoutComponent.validityFormArray;
      const expected = validityTableRows.map(
        validityTableRow =>
          ({
            application: validityTableRow.application,
            applicationValidUntil: validityTableRow.applicationValidUntil,
            validFrom: validityTableRow.validFrom,
            validUntil: validityTableRow.validUntil
          } as Validity)
      );

      expect(validityFormArray.value).toEqual(expected);
    });
  });

  describe('offeredServiceValidityExistsFor', () => {
    it('Offered Service has validity in first row for brand ID "MB" and product group ID "PC"', () => {
      expect(
        component.validityTableLayoutComponent.offeredServiceValidityExistsFor(0, 'MB', 'PC')
      ).toBeTruthy();
    });

    it(
      'Offered Service has no validity in first row for brand ID "SMT" and product group ID' +
        ' "PC"',
      () => {
        expect(
          component.validityTableLayoutComponent.offeredServiceValidityExistsFor(0, 'SMT', 'PC')
        ).toBeFalsy();
      }
    );
  });

  describe('add1Day', () => {
    it('should add 1 day', () => {
      expect(component.validityTableLayoutComponent.add1Day('2019-01-01')).toEqual(
        moment('2019-01-02').toDate()
      );
    });

    it('should return null', () => {
      expect(component.validityTableLayoutComponent.add1Day(null)).toEqual(null);
    });
  });

  describe('subtract1Day', () => {
    it('should subtract 1 day', () => {
      expect(component.validityTableLayoutComponent.subtract1Day('2019-01-02')).toEqual(
        moment('2019-01-01').toDate()
      );
    });

    it('should return null', () => {
      expect(component.validityTableLayoutComponent.subtract1Day(null)).toEqual(null);
    });
  });

  describe('shouldValidityTableRowBeDisabled', () => {
    const validityTableRow = {
      offeredServicesMap: {
        'GS0000001-3': OfferedServiceMock.asMap()['GS0000001-3']
      }
    };

    it('should return false when user is not restricted', () => {
      const result = component.validityTableLayoutComponent.isValidityRowDisabled(validityTableRow);
      expect(result).toBeFalsy();
    });

    it('should return false when user restrictions do match currently selected row', () => {
      component.brandRestrictions = ['MB'];
      component.productGroupRestrictions = ['PC'];
      fixture.detectChanges();

      const result = component.validityTableLayoutComponent.isValidityRowDisabled(validityTableRow);
      expect(result).toBeFalsy();
    });

    it('should return false when user restrictions are limited to MB and user is allowed to change it', () => {
      component.brandRestrictions = ['MB'];
      component.productGroupRestrictions = [];
      fixture.detectChanges();

      const result = component.validityTableLayoutComponent.isValidityRowDisabled(validityTableRow);
      expect(result).toBeFalsy();
    });

    it('should return false when user restrictions are limited to PC and user is allowed to change it', () => {
      component.brandRestrictions = [];
      component.productGroupRestrictions = ['PC'];
      fixture.detectChanges();

      const result = component.validityTableLayoutComponent.isValidityRowDisabled(validityTableRow);
      expect(result).toBeFalsy();
    });

    it('should return false when user restrictions are limited to PC and VAN and user is allowed to change it', () => {
      component.brandRestrictions = [];
      component.productGroupRestrictions = ['PC', 'VAN'];
      fixture.detectChanges();

      const result = component.validityTableLayoutComponent.isValidityRowDisabled(validityTableRow);
      expect(result).toBeFalsy();
    });

    it('should return true when user has no permission to edit validity', () => {
      component.userHasPermissions = false;
      fixture.detectChanges();
      const result = component.validityTableLayoutComponent.isValidityRowDisabled(validityTableRow);
      expect(result).toBeTruthy();
    });

    it('should return true when user is restricted to only smart', () => {
      component.brandRestrictions = ['SMT'];
      component.productGroupRestrictions = [];
      fixture.detectChanges();

      const result = component.validityTableLayoutComponent.isValidityRowDisabled(validityTableRow);
      expect(result).toBeTruthy();
    });

    it('should return true when user is restricted to only van', () => {
      component.brandRestrictions = [];
      component.productGroupRestrictions = ['VAN'];
      fixture.detectChanges();

      const result = component.validityTableLayoutComponent.isValidityRowDisabled(validityTableRow);
      expect(result).toBeTruthy();
    });
  });

  describe('getIcon', () => {
    it('should return the icon name from the process state', () => {
      const icon = component.validityTableLayoutComponent.getIcon(0, 'MB', 'PC');
      expect(icon).toEqual('os-offered-and-valid');
    });
  });

  describe('isProductGroupDisabled', () => {
    it('should return true when user has no permissions', () => {
      component.userHasPermissions = false;
      fixture.detectChanges();
      const isDisabled = component.validityTableLayoutComponent.isProductGroupDisabled('MB', 'PC');
      expect(isDisabled).toBeTruthy();
    });

    it('should return true when brand and productGroup do not match current user restrictions', () => {
      component.brandRestrictions = ['SMT'];
      component.productGroupRestrictions = ['PC'];
      fixture.detectChanges();
      const isDisabled = component.validityTableLayoutComponent.isProductGroupDisabled('MB', 'PC');
      expect(isDisabled).toBeTruthy();
    });

    it('should return false when brand and productGroup to match current user restrictions', () => {
      component.brandRestrictions = ['SMT'];
      component.productGroupRestrictions = ['PC'];
      fixture.detectChanges();
      const isDisabled = component.validityTableLayoutComponent.isProductGroupDisabled('SMT', 'PC');
      expect(isDisabled).toBeFalsy();
    });

    it('should return true when brand do not match current user restrictions', () => {
      component.brandRestrictions = ['MB'];
      fixture.detectChanges();
      const isDisabled = component.validityTableLayoutComponent.isProductGroupDisabled('SMT', 'PC');
      expect(isDisabled).toBeTruthy();
    });

    it('should return false when brand do match current user restrictions', () => {
      component.brandRestrictions = ['MB'];
      fixture.detectChanges();
      const isDisabled = component.validityTableLayoutComponent.isProductGroupDisabled('MB', 'PC');
      expect(isDisabled).toBeFalsy();
    });

    it('should return true when productGroup do not match current user restrictions', () => {
      component.productGroupRestrictions = ['BUS'];
      fixture.detectChanges();
      const isDisabled = component.validityTableLayoutComponent.isProductGroupDisabled('SMT', 'PC');
      expect(isDisabled).toBeTruthy();
    });

    it('should return false when productGroup do match current user restrictions', () => {
      component.productGroupRestrictions = ['BUS'];
      fixture.detectChanges();
      const isDisabled = component.validityTableLayoutComponent.isProductGroupDisabled('PC', 'BUS');
      expect(isDisabled).toBeFalsy();
    });

    it('should return false when brand, productGroup  and userPermissions to match to current productGroup', () => {
      component.userHasPermissions = true;
      component.brandRestrictions = ['SMT'];
      component.productGroupRestrictions = ['PC'];
      fixture.detectChanges();
      const isDisabled = component.validityTableLayoutComponent.isProductGroupDisabled('SMT', 'PC');
      expect(isDisabled).toBeFalsy();
    });
  });

  describe('emitApplicationUntilChange()', () => {
    it('should set the validFrom date one day after the applicantUntil date', () => {
      component.validityTableLayoutComponent.validityFormArray.at(0)?.patchValue({ validFrom: '' });
      component.validityTableLayoutComponent.emitApplicationUntilChange(
        moment('2020-01-01').toDate(),
        0
      );

      expect(
        component.validityTableLayoutComponent.validityFormArray.at(0)?.get('validFrom')?.value
      ).toEqual(moment('2020-01-02').format('YYYY-MM-DD'));
    });

    it('should not touch the validFrom date when already set', () => {
      component.validityTableLayoutComponent.emitApplicationUntilChange(
        moment('2020-01-01').toDate(),
        0
      );

      expect(
        component.validityTableLayoutComponent.validityFormArray.at(0)?.get('validFrom')?.value
      ).toEqual('2019-01-02');
    });
  });
});
