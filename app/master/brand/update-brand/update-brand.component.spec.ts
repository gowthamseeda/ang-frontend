import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import { MasterBrandMock } from '../master-brand/master-brand.mock';
import { MasterBrand } from '../master-brand/master-brand.model';
import { MasterBrandService } from '../master-brand/master-brand.service';

import { UpdateBrandComponent } from './update-brand.component';

class ActivatedRouteStub {
  paramMap = of({
    get: (value: any) => {
      return value === 'id' ? 'MB' : null;
    }
  });
}

describe('UpdateBrandComponent', () => {
  const masterBrandMock = MasterBrandMock.asList();

  let component: UpdateBrandComponent;
  let fixture: ComponentFixture<UpdateBrandComponent>;

  let brandServiceSpy: Spy<MasterBrandService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let routerSpy: Spy<Router>;

  beforeEach(
    waitForAsync(() => {
      snackBarServiceSpy = createSpyFromClass(SnackBarService);
      routerSpy = createSpyFromClass(Router);

      brandServiceSpy = createSpyFromClass(MasterBrandService);
      brandServiceSpy.fetchBy.nextWith(masterBrandMock[0]);
      brandServiceSpy.update.nextWith();
      brandServiceSpy.clearCacheAndFetchAll();

      TestBed.configureTestingModule({
        declarations: [UpdateBrandComponent],
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
          { provide: Router, useValue: routerSpy },
          { provide: ActivatedRoute, useValue: new ActivatedRouteStub() }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateBrandComponent);
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

    it('should be able to update the brand', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('UPDATE_BRAND_SUCCESS');
    });

    it('should not be able to update the brand', () => {
      const error = new Error('Error!');
      brandServiceSpy.update.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });

  describe('initBrandForm()', () => {
    it('should have brands fields', done => {
      expect(component.brandForm.controls['id']).toBeTruthy();
      expect(component.brandForm.controls['name']).toBeTruthy();
      expect(component.brandForm.controls['position']).toBeTruthy();
      done();
    });
  });
});
