import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { combineLatest, Observable, Subject, of } from 'rxjs';
import { catchError, finalize, take, takeUntil, tap } from 'rxjs/operators';

import { Country } from '../../../geography/country/country.model';
import { CountryService } from '../../../geography/country/country.service';
import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { APISchedulerJob, APISchedulerJobType, SchedulerType } from '../../model/scheduler.model';
import { ApiSchedulerService } from '../../services/api-scheduler.service';

@Component({
  selector: 'gp-api-scheduler',
  templateUrl: './api-scheduler.component.html',
  styleUrls: ['./api-scheduler.component.scss']
})
export class ApiSchedulerComponent implements OnInit, OnDestroy {
  job: APISchedulerJob;
  formGroup: UntypedFormGroup;

  isCreate: boolean;
  isByCountry: boolean;
  isLoading = false;
  isJobFound = true;

  jobTypes: string[] = [];
  countries: Country[] = [];
  schedulerType = SchedulerType;

  private jobId: string;
  private cronKeys = ['second', 'minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'];

  private unsubscribe = new Subject<void>();

  constructor(
    private userAuthorizationService: UserAuthorizationService,
    private apiSchedulerService: ApiSchedulerService,
    private countryService: CountryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private snackBarService: SnackBarService
  ) {
    this.isCreate = this.activatedRoute.snapshot.data['isCreate'] || false;
  }

  ngOnInit(): void {
    this.initJobTypes();
    this.initCountries();
    this.initForm();

    if (!this.isCreate) {
      this.initApiSchedulerJob();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  create(): void {
    this.isLoading = true;
    this.apiSchedulerService
      .create(this.getFormValues())
      .pipe(
        takeUntil(this.unsubscribe),
        tap((response: { id: string }) => {
          this.snackBarService.showInfo('CREATE_JOB_SUCCESS');
          this.router.navigateByUrl(`scheduler/api/${response.id}/edit`);
        }),
        catchError(error => {
          this.snackBarService.showError(error);
          return of(error);
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  update(): void {
    this.isLoading = true;
    this.apiSchedulerService
      .update(this.jobId, this.getFormValues())
      .pipe(
        takeUntil(this.unsubscribe),
        tap(() => {
          this.snackBarService.showInfo('UPDATE_JOB_SUCCESS');
          this.getSchedulerJob();
        }),
        catchError(error => {
          this.snackBarService.showError(error);
          return of(error);
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  cancel(): void {
    if (this.isCreate) {
      this.isByCountry = false;
      this.initForm();
    } else {
      this.getSchedulerJob();
    }
  }

  trigger(): void {
    this.isLoading = true;
    this.apiSchedulerService
      .trigger(this.job.id)
      .pipe(
        takeUntil(this.unsubscribe),
        tap(() => {
          this.snackBarService.showInfo('TRIGGER_JOB_SUCCESS');
          this.getSchedulerJob();
        }),
        catchError(error => {
          this.snackBarService.showError(error);
          return of(error);
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  abort(): void {
    this.isLoading = true;
    this.apiSchedulerService
      .abort(this.job.id)
      .pipe(
        takeUntil(this.unsubscribe),
        tap(() => {
          this.snackBarService.showInfo('TRIGGER_ABORT_SUCCESS');
          this.getSchedulerJob();
        }),
        catchError(error => {
          this.snackBarService.showError(error);
          return of(error);
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  onSchedulerJobTypeChange(jobType: string): void {
    this.isByCountry = jobType === APISchedulerJobType.COMPLETE_OUTLET_FILE_BY_COUNTRY;
  }

  isAuthorized(): Observable<boolean> {
    return this.userAuthorizationService.isAuthorizedFor
      .permissions(['gssnplusapischeduler.scheduler.update'])
      .verify();
  }

  private initJobTypes(): void {
    Object.keys(APISchedulerJobType).forEach(type => this.jobTypes.push(type));
  }

  private initCountries(): void {
    this.countryService
      .getAll()
      .pipe(
        takeUntil(this.unsubscribe),
        tap(countries => (this.countries = countries.sort((a, b) => a.name.localeCompare(b.name))))
      )
      .subscribe();
  }

  private initForm(): void {
    this.formGroup = this.formBuilder.group({
      schedulerJob: ['', [Validators.required]],
      jobParameters: [''],
      second: ['', [Validators.required]],
      minute: ['', [Validators.required]],
      hour: ['', [Validators.required]],
      dayOfMonth: ['', [Validators.required]],
      month: ['', [Validators.required]],
      dayOfWeek: ['', [Validators.required]]
    });

    if (!this.isCreate) {
      this.formGroup.controls['schedulerJob'].disable();
      this.formGroup.addControl('isActive', this.formBuilder.control(false, [Validators.required]));
    }
  }

  private initApiSchedulerJob(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.jobId = paramMap.get('jobId') ?? '';
      if (this.jobId.length) {
        this.getSchedulerJob();
      }
    });
  }

  private getSchedulerJob(): void {
    this.isLoading = true;
    this.formGroup.markAsPristine();
    combineLatest([this.apiSchedulerService.get(this.jobId), this.isAuthorized()])
      .pipe(
        takeUntil(this.unsubscribe),
        take(1),
        tap(([schedulerJob, isAuthorized]) => {
          this.job = schedulerJob;
          this.onSchedulerJobTypeChange(this.job.schedulerJob);
          this.populateForm(this.job);
          if (!isAuthorized) {
            this.formGroup.disable();
          }
        }),
        catchError(error => {
          this.isJobFound = false;
          return of(error);
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe();
  }

  private populateForm(schedulerJob: APISchedulerJob): void {
    const cronValues = schedulerJob.cronExpression.split(' ');

    this.formGroup.patchValue({
      schedulerJob: schedulerJob.schedulerJob,
      jobParameters: (schedulerJob.jobParameters
        ? JSON.parse(schedulerJob.jobParameters)
        : []) as string[],
      isActive: schedulerJob.isActive
    });

    this.cronKeys.forEach((key, index) => {
      this.formGroup.patchValue({
        [key]: cronValues[index]
      });
    });
  }

  private getFormValues(): APISchedulerJob {
    const rawValues = this.formGroup.getRawValue();
    const arr: string[] = [];

    this.cronKeys.forEach(key => arr.push(rawValues[key]));

    const cronExpression = arr.join(' ');
    let apiSchedulerJob = {
      ...rawValues,
      cronExpression
    };

    const rawJobParameters = rawValues['jobParameters'];
    if (this.isByCountry && rawJobParameters && rawJobParameters.length > 0) {
      const jobParameters = JSON.stringify(rawJobParameters);
      apiSchedulerJob = {
        ...apiSchedulerJob,
        jobParameters
      };
    } else {
      delete apiSchedulerJob['jobParameters'];
    }

    this.cronKeys.forEach(key => delete apiSchedulerJob[key]);

    return apiSchedulerJob;
  }
}
