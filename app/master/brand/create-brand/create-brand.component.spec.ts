import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import { MasterBrand } from '../master-brand/master-brand.model';
import { MasterBrandService } from '../master-brand/master-brand.service';

import { CreateBrandComponent } from './create-brand.component';

describe('CreateBrandComponent', () => {
  let component: CreateBrandComponent;
  let fixture: ComponentFixture<CreateBrandComponent>;

  let brandServiceSpy: Spy<MasterBrandService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let routerSpy: Spy<Router>;

  beforeEach(
    waitForAsync(() => {
      brandServiceSpy = createSpyFromClass(MasterBrandService);
      brandServiceSpy.create.nextWith();
      brandServiceSpy.clearCacheAndFetchAll();
      snackBarServiceSpy = createSpyFromClass(SnackBarService);
      routerSpy = createSpyFromClass(Router);

      TestBed.configureTestingModule({
        declarations: [CreateBrandComponent],
        imports: [
          MatInputModule,
          MatSelectModule,
          NoopAnimationsModule,
          ReactiveFormsModule,
          TestingModule
        ],
        providers: [
          { provide: MasterBrandService, useValue: brandServiceSpy },
          { provide: SnackBarService, useValue: snackBarServiceSpy },
          { provide: Router, useValue: routerSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit()', () => {
    beforeEach(() => {
      const brand: MasterBrand = {
        id: 'MB',
        name: 'Mercedes-Benz'
      };
      component.submit(brand);
    });

    it('should be able to create the brand', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('CREATE_BRAND_SUCCESS');
    });

    it('should not be able to create the brand', () => {
      const error = new Error('Error!');
      brandServiceSpy.create.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });
});
