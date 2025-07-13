import { Component, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { ProductGroup } from '../../../services/product-group/product-group.model';
import { ProductGroupService } from '../../../services/product-group/product-group.service';
import { TestingModule } from '../../../testing/testing.module';

import { ProductGroupSelectionComponent } from './product-group-selection.component';

@Component({
  template: '<gp-product-group-selection [control]="control">' + '</gp-product-group-selection>'
})
class TestComponent {
  @ViewChild(ProductGroupSelectionComponent)
  public productGroupSelection: ProductGroupSelectionComponent;
  control = new FormControl([]);
}

describe('ProductGroupSelectionComponent', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let productGroupServiceSpy: Spy<ProductGroupService>;

  beforeEach(
    waitForAsync(() => {
      productGroupServiceSpy = createSpyFromClass(ProductGroupService);
      productGroupServiceSpy.get.nextWith({ id: 'TRUCK' } as ProductGroup);
      productGroupServiceSpy.getAllForUserDataRestrictions.nextWith([
        { id: 'PC' }
      ] as ProductGroup[]);

      TestBed.configureTestingModule({
        declarations: [ProductGroupSelectionComponent, TestComponent],
        imports: [MatSelectModule, ReactiveFormsModule, NoopAnimationsModule, TestingModule],
        providers: [{ provide: ProductGroupService, useValue: productGroupServiceSpy }],
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
    it('should contain product group values', () => {
      const expectedProductGroups = [{ id: 'PC', name: 'Passenger Cars', shortName: 'PC' }];
      productGroupServiceSpy.getAllForUserDataRestrictions.nextWith(expectedProductGroups);
      expect(component.productGroupSelection.restrictedProductGroups).toEqual(
        expectedProductGroups
      );
    });
  });

  describe('productGroups', () => {
    it('should return product groups including selected one', () => {
      const restrictedProductGroups = [{ id: 'PC', name: 'Passenger Cars', shortName: 'PC' }];
      const selectedProductGroup = { id: 'TRUCK', name: 'Truck', shortName: 'TRUCK' };
      productGroupServiceSpy.getAllForUserDataRestrictions.nextWith(restrictedProductGroups);
      productGroupServiceSpy.get.nextWith(selectedProductGroup);
      const expectedProductGroups = restrictedProductGroups.concat(selectedProductGroup);

      expect(component.productGroupSelection.productGroups).toEqual(expectedProductGroups);
    });
  });
});
