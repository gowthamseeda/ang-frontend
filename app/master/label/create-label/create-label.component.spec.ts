import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { SortingService } from '../../../shared/services/sorting/sorting.service';
import { TestingModule } from '../../../testing/testing.module';
import { MasterBrandService } from '../../brand/master-brand/master-brand.service';
import { getMasterNewLabelMock } from '../../services/master-label/master-label.mock';
import { MasterLabelService } from '../../services/master-label/master-label.service';

import { CreateLabelComponent } from './create-label.component';

describe('CreateLabelComponent', () => {
  let component: CreateLabelComponent;
  let fixture: ComponentFixture<CreateLabelComponent>;
  let brandServiceSpy: Spy<MasterBrandService>;
  let labelServiceSpy: Spy<MasterLabelService>;
  let sortingServiceSpy: Spy<SortingService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let routerSpy: Spy<Router>;

  beforeEach(
    waitForAsync(() => {
      labelServiceSpy = createSpyFromClass(MasterLabelService);
      labelServiceSpy.create.nextWith({});
      sortingServiceSpy = createSpyFromClass(SortingService);
      snackBarServiceSpy = createSpyFromClass(SnackBarService);
      brandServiceSpy = createSpyFromClass(MasterBrandService);
      brandServiceSpy.getAll.nextWith([]);
      routerSpy = createSpyFromClass(Router);

      TestBed.configureTestingModule({
        declarations: [CreateLabelComponent],
        imports: [TestingModule, ReactiveFormsModule],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          { provide: MasterLabelService, useValue: labelServiceSpy },
          { provide: SortingService, useValue: sortingServiceSpy },
          { provide: SnackBarService, useValue: snackBarServiceSpy },
          { provide: MasterBrandService, useValue: brandServiceSpy },
          { provide: Router, useValue: routerSpy }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit()', () => {
    beforeEach(() => {
      component.submit(getMasterNewLabelMock());
    });

    it('should be able to create the label', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('CREATE_LABEL_SUCCESS');
    });

    it('should not be able to create the label', () => {
      const error = new Error('Error!');
      labelServiceSpy.create.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });
});
