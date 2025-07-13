import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { BrandMock } from '../../../services/brand/brand.mock';
import { BrandService } from '../../../services/brand/brand.service';
import { TestingModule } from '../../../testing/testing.module';

import { BrandSelectionComponent } from './brand-selection.component';

@Component({
  template:
    '<gp-brand-selection [control]="control" [excludedBrandIds]="excludedBrandIds" [multiple]="multiple" [required]="readonly"></gp-brand-selection>'
})
class TestComponent {
  @ViewChild(BrandSelectionComponent)
  public brandSelection: BrandSelectionComponent;
  control = new UntypedFormControl([]);
  excludedBrandIds: string[] = [];
  multiple = true;
  readonly = false;
}

describe('BrandSelectionComponent', () => {
  const brandsMock = BrandMock.asList();
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let brandServiceSpy: Spy<BrandService>;

  beforeEach(
    waitForAsync(() => {
      brandServiceSpy = createSpyFromClass(BrandService);

      TestBed.configureTestingModule({
        declarations: [BrandSelectionComponent, TestComponent],
        imports: [MatSelectModule, ReactiveFormsModule, NoopAnimationsModule, TestingModule],
        providers: [{ provide: BrandService, useValue: brandServiceSpy }],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      brandServiceSpy.getAll.nextWith(brandsMock);
      brandServiceSpy.getFilteredBrands.nextWith(brandsMock);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    const brandsForUserDataRestrictions = brandsMock.filter(
      brand => brand.id === 'MB' || brand.id === 'SMT'
    );

    beforeEach(() => {
      brandServiceSpy.getFilteredBrands.nextWith(brandsForUserDataRestrictions);
    });

    it('should load all brands', () => {
      expect(component.brandSelection.allBrands).toEqual(brandsMock);
    });

    it('should load brands covered by user data restriction', () => {
      expect(component.brandSelection.selectableBrands).toEqual(brandsForUserDataRestrictions);
    });
  });

  describe('brandBy', () => {
    it('should return brand', () => {
      const expectedBrand = brandsMock.find(brand => brand.id === 'MB');
      expect(component.brandSelection.brandBy('MB')).toEqual(expectedBrand);
    });

    it('should return null', () => {
      expect(component.brandSelection.brandBy('NONE')).toBeUndefined();
    });
  });

  describe('removeBrand', () => {
    beforeEach(() => {
      component.brandSelection.control.setValue(brandsMock);
    });

    it('should update brand selection control when removing brand', () => {
      component.brandSelection.removeBrand('MB', new Event('click'));

      expect(component.brandSelection.control.value).not.toContain('MB');
    });

    it('should do nothing when removing not selected brand', () => {
      component.brandSelection.removeBrand('NOT_EXISTENT', new Event('click'));

      expect(component.brandSelection.control.value).toEqual(brandsMock);
    });
  });
});
