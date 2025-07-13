import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { ProductGroupMock } from '../../../services/product-group/product-group.mock';
import { ProductGroupService } from '../../../services/product-group/product-group.service';
import { CompModule } from '../../../shared/components/components.module';
import { TestingModule } from '../../../testing/testing.module';
import { ProductGroupSelectionComponent } from './product-group-selection.component';


describe('ProductGroupsSelectionComponent', () => {
  let component: ProductGroupSelectionComponent;
  let fixture: ComponentFixture<ProductGroupSelectionComponent>;
  let productGroupServiceSpy: Spy<ProductGroupService>;
  const productGroupsMock = ProductGroupMock.asList();
  beforeEach(
    waitForAsync(() => {
      productGroupServiceSpy = createSpyFromClass(ProductGroupService);
      TestBed.configureTestingModule({
        imports: [
          CompModule,
          TestingModule,
          MatSelectModule,
          MatChipsModule,
          ReactiveFormsModule,
          NoopAnimationsModule
        ],
        declarations: [ProductGroupSelectionComponent],
        providers: [{ provide: ProductGroupService, useValue: productGroupServiceSpy }],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );
  beforeEach(() => {
    fixture = TestBed.createComponent(ProductGroupSelectionComponent);
    component = fixture.componentInstance;
    productGroupServiceSpy.getAll.nextWith(productGroupsMock);
    component.placeholder = 'CHOOSE_PRODUCT_GROUPS';
    component.fControl = new FormControl([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load all product Groups', () => {
      expect(component.allProductGroups).toEqual(productGroupsMock);
    });
  });
});
