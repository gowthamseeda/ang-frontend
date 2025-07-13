import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { SortingService } from '../../../shared/services/sorting/sorting.service';
import { TestingModule } from '../../../testing/testing.module';
import { MasterBrandService } from '../../brand/master-brand/master-brand.service';
import { getMasterUpateLabelMock } from '../../services/master-label/master-label.mock';
import { MasterLabelService } from '../../services/master-label/master-label.service';

import { UpdateLabelComponent } from './update-label.component';

class ActivatedRouteStub {
  paramMap = of({
    get: (value: any) => {
      return value === 'id' ? '3' : null;
    }
  });
}

describe('UpdateLabelComponent', () => {
  let component: UpdateLabelComponent;
  let fixture: ComponentFixture<UpdateLabelComponent>;
  let brandServiceSpy: Spy<MasterBrandService>;
  let labelServiceSpy: Spy<MasterLabelService>;
  let sortingServiceSpy: Spy<SortingService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let routerSpy: Spy<Router>;

  beforeEach(
    waitForAsync(() => {
      labelServiceSpy = createSpyFromClass(MasterLabelService);
      labelServiceSpy.get.nextWith(getMasterUpateLabelMock());
      labelServiceSpy.update.nextWith({});
      sortingServiceSpy = createSpyFromClass(SortingService);
      snackBarServiceSpy = createSpyFromClass(SnackBarService);
      brandServiceSpy = createSpyFromClass(MasterBrandService);
      brandServiceSpy.getAll.nextWith([]);
      routerSpy = createSpyFromClass(Router);

      TestBed.configureTestingModule({
        declarations: [UpdateLabelComponent],
        imports: [TestingModule, ReactiveFormsModule],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          { provide: MasterLabelService, useValue: labelServiceSpy },
          { provide: SortingService, useValue: sortingServiceSpy },
          { provide: SnackBarService, useValue: snackBarServiceSpy },
          { provide: MasterBrandService, useValue: brandServiceSpy },
          { provide: Router, useValue: routerSpy },
          { provide: ActivatedRoute, useValue: new ActivatedRouteStub() }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit()', () => {
    beforeEach(() => {
      component.submit(getMasterUpateLabelMock());
    });

    it('should be able to update the label', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('UPDATE_LABEL_SUCCESS');
    });

    it('should not be able to update the label', () => {
      const error = new Error('Error!');
      labelServiceSpy.update.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });

  describe('initLabelForm()', () => {
    it('should have label fields', done => {
      expect(component.labelForm.controls['id']).toBeTruthy();
      expect(component.labelForm.controls['name']).toBeTruthy();
      expect(component.labelForm.controls['assignableTo']).toBeTruthy();
      expect(component.labelForm.controls['restrictedToBrandIds']).toBeTruthy();
      expect(component.labelForm.controls['restrictedToCountryIds']).toBeTruthy();
      expect(component.labelForm.controls['restrictedToDistributionLevels']).toBeTruthy();
      expect(component.labelForm.controls['translations']).toBeTruthy();
      done();
    });
  });
});
