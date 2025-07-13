import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { ProductGroupMock } from '../../../services/product-group/product-group.mock';
import { ProductGroupService } from '../../../services/product-group/product-group.service';

import { TranslatedProductGroupFlagComponent } from './translated-product-group-flag.component';

describe('TranslatedFilterComponent', () => {
  const productGroupsMock = ProductGroupMock.asList();
  let component: TranslatedProductGroupFlagComponent;
  let fixture: ComponentFixture<TranslatedProductGroupFlagComponent>;
  let productGroupServiceServiceSpy: Spy<ProductGroupService>;

  beforeEach(
    waitForAsync(() => {
      productGroupServiceServiceSpy = createSpyFromClass(ProductGroupService);
      productGroupServiceServiceSpy.getAll.nextWith(productGroupsMock);

      TestBed.configureTestingModule({
        declarations: [TranslatedProductGroupFlagComponent],
        providers: [{ provide: ProductGroupService, useValue: productGroupServiceServiceSpy }]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslatedProductGroupFlagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load all product groups', () => {
      expect(component.allProductGroups).toEqual(productGroupsMock);
    });
  });

  describe('productGroupBy', () => {
    it('should load all product groups', () => {
      const expectedProductGroup = component.allProductGroups[0];
      expect(component.productGroupBy('productGroups_PC')).toEqual(expectedProductGroup);
    });
  });
});
