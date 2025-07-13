import { LayoutModule } from '@angular/cdk/layout';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AbstractControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { noop, of, throwError } from 'rxjs';

import { getCountriesMock } from '../../../geography/country/country.mock';
import { CountryService } from '../../../geography/country/country.service';
import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TranslatePipeMock } from '../../../testing/pipe-mocks/translate';
import { TestingModule } from '../../../testing/testing.module';
import { getAPISchedulerJobs } from '../../model/scheduler.mock';
import { APISchedulerJobType } from '../../model/scheduler.model';
import { ApiSchedulerService } from '../../services/api-scheduler.service';

import { ApiSchedulerComponent } from './api-scheduler.component';
import spyOn = jest.spyOn;

const apiSchedulerJob = getAPISchedulerJobs()[0];
const apiSchedulerJobByCountry = getAPISchedulerJobs()[1];

class ActivatedRouteStub {
  paramMap = of({ get: () => apiSchedulerJob.id });
  snapshot = { data: { isCreate: true } };
}

describe('EditApiComponent', () => {
  let component: ApiSchedulerComponent;
  let fixture: ComponentFixture<ApiSchedulerComponent>;
  let apiSchedulerServiceSpy: Spy<ApiSchedulerService>;
  let countryServiceSpy: Spy<CountryService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let routerSpy: Spy<Router>;

  const activatedRouteStub = new ActivatedRouteStub();

  beforeEach(
    waitForAsync(() => {
      apiSchedulerServiceSpy = createSpyFromClass(ApiSchedulerService);
      apiSchedulerServiceSpy.get.nextWith(apiSchedulerJob);
      apiSchedulerServiceSpy.create.mockReturnValue(of({ id: apiSchedulerJob.id }));
      apiSchedulerServiceSpy.update.mockReturnValue(of(true));
      apiSchedulerServiceSpy.trigger.mockReturnValue(of(true));
      apiSchedulerServiceSpy.abort.mockReturnValue(of(true));
      userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
      userAuthorizationServiceSpy.verify.nextWith(true);
      countryServiceSpy = createSpyFromClass(CountryService);
      countryServiceSpy.getAll.nextWith(getCountriesMock().countries);
      snackBarServiceSpy = createSpyFromClass(SnackBarService);
      routerSpy = createSpyFromClass(Router);

      TestBed.configureTestingModule({
        declarations: [ApiSchedulerComponent, TranslatePipeMock],
        imports: [
          TestingModule,
          ReactiveFormsModule,
          MatSelectModule,
          MatInputModule,
          MatSlideToggleModule,
          NoopAnimationsModule,
          RouterTestingModule.withRoutes([]),
          LayoutModule
        ],
        providers: [
          FormBuilder,
          { provide: ApiSchedulerService, useValue: apiSchedulerServiceSpy },
          { provide: CountryService, useValue: countryServiceSpy },
          { provide: Router, useValue: routerSpy },
          { provide: ActivatedRoute, useValue: activatedRouteStub },
          {
            provide: UserAuthorizationService,
            useValue: { isAuthorizedFor: { permissions: () => userAuthorizationServiceSpy } }
          },
          { provide: SnackBarService, useValue: snackBarServiceSpy }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should handle create API scheduler job', () => {
    beforeEach(() => {
      component.formGroup.patchValue({
        schedulerJob: apiSchedulerJob.schedulerJob,
        second: '*',
        minute: '*',
        hour: '*',
        dayOfMonth: '*',
        month: '*',
        dayOfWeek: '*'
      });
    });

    it('should handle create job success', () => {
      const spy1 = spyOn(apiSchedulerServiceSpy, 'create');
      const spy2 = spyOn(snackBarServiceSpy, 'showInfo');
      const spy3 = spyOn(routerSpy, 'navigateByUrl');

      component.create();

      const expected = {
        schedulerJob: apiSchedulerJob.schedulerJob,
        cronExpression: '* * * * * *'
      };

      expect(spy1).toHaveBeenCalledWith(expected);
      expect(spy2).toHaveBeenCalledWith('CREATE_JOB_SUCCESS');
      expect(spy3).toHaveBeenCalledWith(`scheduler/api/${apiSchedulerJob.id}/edit`);
      expect(component.isLoading).toBeFalsy();
    });

    it('should handle create job failure', () => {
      const spy1 = spyOn(apiSchedulerServiceSpy, 'create').mockReturnValue(throwError('error'));
      const spy2 = spyOn(snackBarServiceSpy, 'showError');
      const spy3 = spyOn(routerSpy, 'navigateByUrl');

      component.create();

      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      expect(spy3).not.toHaveBeenCalled();
      expect(component.isLoading).toBeFalsy();
    });
  });

  describe('should handle update API scheduler job', () => {
    beforeEach(() => {
      activatedRouteStub.paramMap = of({ get: () => apiSchedulerJobByCountry.id });
      apiSchedulerServiceSpy.get.nextOneTimeWith(apiSchedulerJobByCountry);
      component.isCreate = false;
      component.ngOnInit();
    });

    it('should handle update job success', () => {
      const spy1 = spyOn(apiSchedulerServiceSpy, 'update');
      const spy2 = spyOn(apiSchedulerServiceSpy, 'get');
      const spy3 = spyOn(snackBarServiceSpy, 'showInfo');

      component.update();

      const expected = {
        schedulerJob: apiSchedulerJobByCountry.schedulerJob,
        jobParameters: '["MY","DE"]',
        cronExpression: '* * * * * *',
        isActive: true
      };

      expect(spy1).toHaveBeenCalledWith(apiSchedulerJobByCountry.id, expected);
      expect(spy2).toHaveBeenCalledWith(apiSchedulerJobByCountry.id);
      expect(spy3).toHaveBeenCalledWith('UPDATE_JOB_SUCCESS');
      expect(component.isLoading).toBeFalsy();
    });

    it('should handle update job failure', () => {
      const spy1 = spyOn(apiSchedulerServiceSpy, 'update').mockReturnValue(throwError('error'));
      const spy2 = spyOn(snackBarServiceSpy, 'showError');

      component.update();

      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      expect(component.isLoading).toBeFalsy();
    });

    it('should not pass jobParameters for country job if parameter is empty string', () => {
      const spy1 = spyOn(apiSchedulerServiceSpy, 'update');

      component.isByCountry = true;
      component.formGroup.get('jobParameters')?.setValue('');
      component.update();

      const expected = {
        schedulerJob: apiSchedulerJobByCountry.schedulerJob,
        jobParameters: undefined,
        cronExpression: '* * * * * *',
        isActive: true
      };

      expect(spy1).toHaveBeenCalledWith(apiSchedulerJobByCountry.id, expected);
    });

    it('should not pass jobParameters for country job if parameter is empty array', () => {
      const spy1 = spyOn(apiSchedulerServiceSpy, 'update');

      component.isByCountry = true;
      component.formGroup.get('jobParameters')?.setValue([]);
      component.update();

      const expected = {
        schedulerJob: apiSchedulerJobByCountry.schedulerJob,
        jobParameters: undefined,
        cronExpression: '* * * * * *',
        isActive: true
      };

      expect(spy1).toHaveBeenCalledWith(apiSchedulerJobByCountry.id, expected);
    });

    it('should not pass jobParameters for country job if parameter is null', () => {
      const spy1 = spyOn(apiSchedulerServiceSpy, 'update');

      component.isByCountry = true;
      component.formGroup.get('jobParameters')?.setValue(null);
      component.update();

      const expected = {
        schedulerJob: apiSchedulerJobByCountry.schedulerJob,
        jobParameters: undefined,
        cronExpression: '* * * * * *',
        isActive: true
      };

      expect(spy1).toHaveBeenCalledWith(apiSchedulerJobByCountry.id, expected);
    });
  });

  describe('should handle cancel', () => {
    beforeEach(() => {
      component.isByCountry = true;
    });

    it('should handle cancel if is create', () => {
      component.isCreate = true;
      component.formGroup.markAsDirty();
      component.cancel();

      expect(component.isByCountry).toBeFalsy();
      expect(component.formGroup).toBeTruthy();
    });

    it('should handle cancel if is not create', () => {
      const spy = spyOn(apiSchedulerServiceSpy, 'get');
      spyOn(component, 'onSchedulerJobTypeChange').mockImplementationOnce(noop);

      component.isCreate = false;
      component.cancel();

      expect(component.isByCountry).toBeTruthy();
      expect(component.formGroup.pristine).toBeTruthy();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('should handle trigger API scheduler job', () => {
    beforeEach(() => {
      component.job = apiSchedulerJob;
    });

    it('should handle trigger job success', () => {
      const spy1 = spyOn(apiSchedulerServiceSpy, 'trigger');
      const spy2 = spyOn(apiSchedulerServiceSpy, 'get');
      const spy3 = spyOn(snackBarServiceSpy, 'showInfo');

      component.trigger();

      expect(spy1).toHaveBeenCalledWith(apiSchedulerJob.id);
      expect(spy2).toHaveBeenCalled();
      expect(spy3).toHaveBeenCalledWith('TRIGGER_JOB_SUCCESS');
      expect(component.isLoading).toBeFalsy();
    });

    it('should handle trigger job failure', () => {
      const spy1 = spyOn(apiSchedulerServiceSpy, 'trigger').mockReturnValue(throwError('error'));
      const spy2 = spyOn(apiSchedulerServiceSpy, 'get');
      const spy3 = spyOn(snackBarServiceSpy, 'showError');

      component.trigger();

      expect(spy1).toHaveBeenCalledWith(apiSchedulerJob.id);
      expect(spy2).not.toHaveBeenCalled();
      expect(spy3).toHaveBeenCalled();
      expect(component.isLoading).toBeFalsy();
    });
  });

  describe('should handle abort API scheduler job', () => {
    beforeEach(() => {
      component.job = apiSchedulerJob;
    });

    it('should handle abort job success', () => {
      const spy1 = spyOn(apiSchedulerServiceSpy, 'abort');
      const spy2 = spyOn(apiSchedulerServiceSpy, 'get');
      const spy3 = spyOn(snackBarServiceSpy, 'showInfo');

      component.abort();

      expect(spy1).toHaveBeenCalledWith(apiSchedulerJob.id);
      expect(spy2).toHaveBeenCalled();
      expect(spy3).toHaveBeenCalledWith('TRIGGER_ABORT_SUCCESS');
      expect(component.isLoading).toBeFalsy();
    });

    it('should handle abort job failure', () => {
      const spy1 = spyOn(apiSchedulerServiceSpy, 'abort').mockReturnValue(throwError('error'));
      const spy2 = spyOn(apiSchedulerServiceSpy, 'get');
      const spy3 = spyOn(snackBarServiceSpy, 'showError');

      component.abort();

      expect(spy1).toHaveBeenCalledWith(apiSchedulerJob.id);
      expect(spy2).not.toHaveBeenCalled();
      expect(spy3).toHaveBeenCalled();
      expect(component.isLoading).toBeFalsy();
    });
  });

  describe('should handle scheduler job type change', () => {
    beforeEach(() => {
      component.isCreate = true;
      component.cancel();
    });

    it('should handle scheduler job type change if by country', () => {
      component.onSchedulerJobTypeChange(APISchedulerJobType.COMPLETE_OUTLET_FILE_BY_COUNTRY);

      expect(component.isByCountry).toBeTruthy();
    });

    it('should handle scheduler job type change if not by country', () => {
      component.onSchedulerJobTypeChange(APISchedulerJobType.COMPLETE_OUTLET_FILE);

      expect(component.isByCountry).toBeFalsy();
      expect(
        component.formGroup.get('jobParameters')?.validator?.({} as AbstractControl)
      ).toBeUndefined();
    });
  });
});
