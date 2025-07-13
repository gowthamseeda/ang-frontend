import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import { MasterProductGroupMock } from '../master-product-group/master-product-group.mock';
import { MasterProductGroupService } from '../master-product-group/master-product-group.service';

import { UpdateProductGroupComponent } from './update-product-group.component';

class ActivatedRouteStub {
  paramMap = of({
    get: (value: any) => {
      return value === 'id' ? 'PC' : null;
    }
  });
}

describe('UpdateProductGroupComponent', () => {
  const productGroupsMock = MasterProductGroupMock.asList();

  let component: UpdateProductGroupComponent;
  let fixture: ComponentFixture<UpdateProductGroupComponent>;
  let productGroupServiceSpy: Spy<MasterProductGroupService>;
  let routerSpy: Spy<Router>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(
    waitForAsync(() => {
      routerSpy = createSpyFromClass(Router);
      snackBarServiceSpy = createSpyFromClass(SnackBarService);

      productGroupServiceSpy = createSpyFromClass(MasterProductGroupService);
      productGroupServiceSpy.fetchBy.nextWith(productGroupsMock[0]);
      productGroupServiceSpy.update.nextWith();
      productGroupServiceSpy.clearCacheAndFetchAll();

      TestBed.configureTestingModule({
        declarations: [UpdateProductGroupComponent],
        imports: [ReactiveFormsModule, TestingModule],
        providers: [
          { provide: MasterProductGroupService, useValue: productGroupServiceSpy },
          { provide: Router, useValue: routerSpy },
          { provide: SnackBarService, useValue: snackBarServiceSpy },
          { provide: ActivatedRoute, useValue: new ActivatedRouteStub() }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateProductGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit()', () => {
    beforeEach(() => {
      component.submit(productGroupsMock[0]);
    });

    it('should update the product group', () => {
      expect(productGroupServiceSpy.update).toHaveBeenCalledWith(productGroupsMock[0]);
    });

    it('should give a success message', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('UPDATE_PRODUCT_GROUP_SUCCESS');
    });

    it('should give a error message', () => {
      const error = new Error('Error!');
      productGroupServiceSpy.update.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });

  describe('initProductGroupForm()', () => {
    it('should have product group fields', done => {
      expect(component.productGroupForm.controls['id']).toBeTruthy();
      expect(component.productGroupForm.controls['name']).toBeTruthy();
      expect(component.productGroupForm.controls['shortName']).toBeTruthy();
      expect(component.productGroupForm.controls['position']).toBeTruthy();
      expect(component.productGroupForm.controls['translations']).toBeTruthy();
      done();
    });
  });
});
