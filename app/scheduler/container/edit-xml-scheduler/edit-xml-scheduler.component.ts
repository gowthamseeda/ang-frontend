import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { combineLatest, iif, Observable, of, Subject } from 'rxjs';
import { finalize, mergeMap, takeUntil } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { SchedulerType, XMLSchedulerJob } from '../../model/scheduler.model';
import { XmlSchedulerService } from '../../services/xml-scheduler.service';

@Component({
  selector: 'gp-edit-xml-scheduler',
  templateUrl: './edit-xml-scheduler.component.html',
  styleUrls: ['./edit-xml-scheduler.component.scss']
})
export class EditXmlSchedulerComponent implements OnInit, OnDestroy {
  job: XMLSchedulerJob;
  jobFormGroup: UntypedFormGroup;
  jobId: string;
  isJobFound = true;
  isLoading = false;

  schedulerType = SchedulerType;

  private unsubscribe = new Subject<void>();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private xmlSchedulerService: XmlSchedulerService,
    private snackBarService: SnackBarService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userAuthorizationService: UserAuthorizationService
  ) {}

  ngOnInit(): void {
    this.initXmlJobForm();
    this.initXmlSchedulerJob();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initXmlSchedulerJob(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.jobId = paramMap.get('jobId') || '';
      if (!this.jobId) {
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
      }
      this.getSchedulerJob();
    });
  }

  save(): void {
    this.isLoading = true;
    this.xmlSchedulerService
      .update(this.jobId, this.jobFormGroup.getRawValue())
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(
        () => {
          this.jobFormGroup.markAsPristine();
          this.getSchedulerJob();
          this.snackBarService.showInfo('UPDATE_JOB_SUCCESS');
        },
        error => {
          this.snackBarService.showError(error);
        }
      );
  }

  trigger(schedulerId: string): void {
    this.xmlSchedulerService.trigger(schedulerId).subscribe(
      () => {
        this.snackBarService.showInfo('TRIGGER_JOB_SUCCESS');
        this.getSchedulerJob();
      },
      error => {
        this.snackBarService.showError(error);
      }
    );
  }

  abort(schedulerId: string): void {
    this.xmlSchedulerService.abort(schedulerId).subscribe(
      () => {
        this.snackBarService.showInfo('TRIGGER_ABORT_SUCCESS');
        this.getSchedulerJob();
      },
      error => {
        this.snackBarService.showError(error);
      }
    );
  }

  cancel(): void {
    this.jobFormGroup.markAsPristine();
    this.getSchedulerJob();
  }

  isDisabledEditAction(): Observable<boolean> {
    return this.verifyAuthentication(['gssnplusxmlscheduler.scheduler.update']).pipe(
      mergeMap(isEditable => iif(() => isEditable, of(false), of(true))),
      takeUntil(this.unsubscribe)
    );
  }

  verifyAuthentication(permissions: string[]): Observable<boolean> {
    return this.userAuthorizationService.isAuthorizedFor.permissions(permissions).verify();
  }

  initXmlJobForm(): void {
    this.jobFormGroup = this.formBuilder.group({
      second: ['', [Validators.required]],
      minute: ['', [Validators.required]],
      hour: ['', [Validators.required]],
      dayOfMonth: ['', [Validators.required]],
      month: ['', [Validators.required]],
      dayOfWeek: ['', [Validators.required]],
      isActive: [false, [Validators.required]]
    });
  }

  private getSchedulerJob(): void {
    combineLatest([
      this.xmlSchedulerService.get(this.jobId),
      this.isDisabledEditAction()
    ]).subscribe(
      ([schedulerJob, isDisabled]) => {
        this.job = schedulerJob;
        this.populateXmlScheduler(schedulerJob);
        if (isDisabled) {
          this.jobFormGroup.disable();
        }
      },
      () => {
        this.isJobFound = false;
      }
    );
  }

  private populateXmlScheduler(schedulerJob: XMLSchedulerJob): void {
    this.jobFormGroup.patchValue({
      second: schedulerJob.second,
      minute: schedulerJob.minute,
      hour: schedulerJob.hour,
      dayOfMonth: schedulerJob.dayOfMonth,
      month: schedulerJob.month,
      dayOfWeek: schedulerJob.dayOfWeek,
      isActive: schedulerJob.isActive
    });
  }
}
