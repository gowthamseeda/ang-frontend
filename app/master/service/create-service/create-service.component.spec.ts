import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import { MasterService } from '../master-service/master-service.model';
import { MasterServiceService } from '../master-service/master-service.service';

import { CreateServiceComponent } from './create-service.component';

describe('CreateServiceComponent', () => {
  let component: CreateServiceComponent;
  let fixture: ComponentFixture<CreateServiceComponent>;
  let serviceServiceSpy: Spy<MasterServiceService>;
  let routerSpy: Spy<Router>;
  let snackBarServiceSpy: Spy<SnackBarService>;

  beforeEach(waitForAsync(() => {
    serviceServiceSpy = createSpyFromClass(MasterServiceService);
    serviceServiceSpy.create.nextWith();
    routerSpy = createSpyFromClass(Router);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);

    TestBed.configureTestingModule({
      declarations: [CreateServiceComponent],
      imports: [
        MatInputModule,
        MatSelectModule,
        NoopAnimationsModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        TestingModule
      ],
      providers: [
        { provide: MasterServiceService, useValue: serviceServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit()', () => {
    beforeEach(() => {
      const service: MasterService = {
        name: 'After-sales',
        active: true,
        id: 10,
        position: 10,
        openingHoursSupport: false,
        retailerVisibility: false,
        allowedDistributionLevels: ['RETAILER'],
        description: 'new description'
      };
      component.submit(service);
    });

    it('should create the service', () => {
      expect(serviceServiceSpy.create).toHaveBeenCalled();
    });

    it('should give a success message', () => {
      expect(snackBarServiceSpy.showInfo).toHaveBeenCalledWith('CREATE_SERVICE_SUCCESS');
    });

    it('should give an error message', () => {
      const error = new Error('Error!');
      serviceServiceSpy.create.throwWith(error);
      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });
});
