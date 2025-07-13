import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import { MasterProductGroupMock } from '../master-product-group/master-product-group.mock';
import { MasterProductGroupService } from '../master-product-group/master-product-group.service';

import { CreateProductGroupComponent } from './create-product-group.component';

describe('CreateProductGroupComponent', () => {
  const productGroupsMock = MasterProductGroupMock.asList();

  let component: CreateProductGroupComponent;
  let fixture: ComponentFixture<CreateProductGroupComponent>;
  let productGroupServiceSpy: Spy<MasterProductGroupService>;
  let routerSpy: Spy<Router>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(
    waitForAsync(() => {
      productGroupServiceSpy = createSpyFromClass(MasterProductGroupService);
      routerSpy = createSpyFromClass(Router);
      snackBarServiceSpy = createSpyFromClass(SnackBarService);

      productGroupServiceSpy.create.nextWith();
      productGroupServiceSpy.clearCacheAndFetchAll();

      TestBed.configureTestingModule({
        declarations: [CreateProductGroupComponent],
        imports: [ReactiveFormsModule, TestingModule],
        providers: [
          { provide: MasterProductGroupService, useValue: productGroupServiceSpy },
          { provide: Router, useValue: routerSpy },
          { provide: SnackBarService, useValue: snackBarServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProductGroupComponent);
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

    it('should create the product group', () => {
      expect(productGroupServiceSpy.create).toHaveBeenCalledWith(productGroupsMock[0]);
    });

    it('should give a success message', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('CREATE_PRODUCT_GROUP_SUCCESS');
    });

    it('should give a error message', () => {
      const error = new Error('Error!');
      productGroupServiceSpy.create.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });
});
