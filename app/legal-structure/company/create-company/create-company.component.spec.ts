import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { NgxPermissionsAllowStubDirective } from 'ngx-permissions';

import { getRegionMappingMock } from '../../../geography/regionmapping/regionmapping.mock';
import { RegionMappingService } from '../../../geography/regionmapping/regionmapping.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TestingModule } from '../../../testing/testing.module';
import { getLocationRegionMock } from '../../location/models/location.mock';
import { LocationService } from '../../location/services/location-service.model';
import { MessageService } from '../../shared/services/message.service';
import { getCompanyMock, getCompanyMock_GC00000004 } from '../company.mock';
import { CompanyService } from '../company.service';

import { CreateCompanyComponent } from './create-company.component';
import { UserService } from '../../../iam/user/user.service';

describe('CreateCompanyComponent', () => {
  const companyMock = getCompanyMock();
  const companyMock_GC00000004 = getCompanyMock_GC00000004();

  let component: CreateCompanyComponent;
  let fixture: ComponentFixture<CreateCompanyComponent>;
  let companyServiceSpy: Spy<CompanyService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let locationServiceSpy: Spy<LocationService>;
  let regionMappingServiceSpy: Spy<RegionMappingService>;
  let messageServiceSpy: Spy<MessageService>;
  let userServiceSpy: Spy<UserService>;
  let routerSpy: Spy<Router>;

  beforeEach(waitForAsync(() => {
    companyServiceSpy = createSpyFromClass(CompanyService);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    locationServiceSpy = createSpyFromClass(LocationService);
    locationServiceSpy.selectRegion.nextWith(getLocationRegionMock());
    messageServiceSpy = createSpyFromClass(MessageService);
    messageServiceSpy.get.nextWith({});
    userServiceSpy = createSpyFromClass(UserService);
    userServiceSpy.getRoles.nextWith([]);
    routerSpy = createSpyFromClass(Router);

    regionMappingServiceSpy = createSpyFromClass(RegionMappingService);
    regionMappingServiceSpy.get.nextWith(getRegionMappingMock());

    TestBed.configureTestingModule({
      declarations: [CreateCompanyComponent, NgxPermissionsAllowStubDirective],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatInputModule,
        TestingModule
      ],
      providers: [
        { provide: LocationService, useValue: locationServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: RegionMappingService, useValue: regionMappingServiceSpy },
        { provide: CompanyService, useValue: companyServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submitCompany()', () => {

    beforeEach(() => {
      component.createCompanyForm.patchValue(companyMock);
    });

    it('should call the company:id route on success', () => {
      companyServiceSpy.createWithDistributionLevels.nextWith('GS00000004');
      component.createCompanyForm.patchValue(companyMock_GC00000004);
      component.submitCompany();

      expect(routerSpy.navigateByUrl).toBeCalledWith('/outlet/GS00000004');
    });

    it('should trigger an error message when an error is thrown', () => {
      const error: Error = new Error('specific error message');
      companyServiceSpy.createWithDistributionLevels.throwWith(error);
      component.createCompanyForm.patchValue(companyMock);
      component.submitCompany();

      expect(snackBarServiceSpy.showError).toHaveBeenCalledWith(error);
      expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should set region and state', () => {
      companyServiceSpy.createWithDistributionLevels.nextWith('GS00000004');
      component.createCompanyForm.patchValue(companyMock_GC00000004);
      component.submitCompany();
      expect(messageServiceSpy.add).toHaveBeenCalledTimes(2);
    });
  });

  describe('reset()', () => {
    it('should reset create company form', () => {
      const resetSpy = jest.spyOn(component.createCompanyForm, 'reset');

      component.reset();
      expect(resetSpy).toHaveBeenCalled();
    });
  });

  describe('check test outlet user', () => {
    it('should return true when user is a test outlet user', () => {
      userServiceSpy.getRoles.nextWith(['GSSNPLUS.TestOutletUser']);
      component.checkTestOutletUser();
      expect(component.testOutlet).toBeTruthy();
    });

    it('should return false when user is not a test outlet user', () => {
      userServiceSpy.getRoles.nextWith(['GSSNPLUS.ProductResponsible']);
      component.checkTestOutletUser();
      expect(component.testOutlet).toBeFalsy();
    });
  });
});
