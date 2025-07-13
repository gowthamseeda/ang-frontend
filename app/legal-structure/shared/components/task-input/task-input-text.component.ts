import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  FormControlOptions,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { mergeMap, switchMap, take, takeUntil } from 'rxjs/operators';
import { UserService } from '../../../../iam/user/user.service';
import {
  DataNotificationChangeFields,
  DeclinedDisplayData
} from '../../../../notifications/models/notifications.model';
import { TaskCommentComponent } from '../../../../shared/components/task-comment/task-comment.component';
import { FeatureToggleService } from '../../../../shared/directives/feature-toggle/feature-toggle.service';
import { FEATURE_NAMES } from '../../../../shared/model/constants';
import { ParentErrorStateMatcher } from '../../../../shared/validators/error-state-matchers/parent-error-state-matcher';
import { CommentsDialogComponent } from '../../../../tasks/shared/comments-dialog/comments-dialog.component';
import {
  AggregateDataField,
  DataCluster, NewTaskDiff,
  Task, TaskDiff,
  TaskForDisplay,
  VerificationTaskFormStatus
} from '../../../../tasks/task.model';
import { TaskDataService } from '../../../../tasks/task/store/task-data.service';
import { MTR_ROLE, RETAILER_ROLE } from '../../../../tasks/tasks.constants';
import { BaseData4rService } from '../../../outlet/base-data-4r.service';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'gp-task-input-text',
  templateUrl: './task-input-text.component.html',
  styleUrls: ['./task-input-text.component.scss']
})
export class TaskInputTextComponent implements OnInit, OnChanges, OnDestroy {
  readonly forRetailFeatureToggleName = FEATURE_NAMES.FOR_RETAIL;
  @ViewChild('textInput') textInput!: ElementRef;
  @Input()
  label: string;
  @Input()
  fieldName: string;
  @Input()
  parentForm: UntypedFormGroup;
  @Input()
  value: string | undefined;
  @Input()
  dataNotificationChangeFields = new DataNotificationChangeFields();
  @Input()
  dataNotificationChangeFieldsInclusion: string[];
  @Input()
  maxLength: number = 256;
  @Input()
  readonly: boolean = false;
  @Input()
  required: boolean = false;
  @Input()
  errorStateMatcher?: ParentErrorStateMatcher;
  @Input()
  dataCluster: DataCluster;
  @Input()
  aggregateName: string;
  @Input()
  aggregateField: string;
  @Input()
  initialValue: string | null = null;
  @Input()
  isRetailOutlet: boolean = false;

  @Output()
  inputChange: EventEmitter<Event> = new EventEmitter<Event>();

  hasChange: boolean = false;
  isMarketResponsible: boolean = false;
  isBusinessSiteResponsible: boolean = false;
  openDataChange = new Subject<Task | undefined>();
  isDataChanged = false;
  isDataApproved = false;
  declinedData: DeclinedDisplayData = { shouldDisplay: false };
  isVerificationTaskPresent = of(false);
  verificationTaskStatus = VerificationTaskFormStatus.NOT_PRESENT;
  VerificationTaskFormStatus = VerificationTaskFormStatus;
  taskForDisplay = new TaskForDisplay();
  futureValue = new BehaviorSubject<any>(null);
  shouldDisplayVerificationDialog = false;
  private unsubscribe = new Subject<void>();
  isEditPage = false;
  emptyValueUpdate = false;

  constructor(
    private tasksService: TasksService,
    private userService: UserService,
    private featureToggleService: FeatureToggleService,
    private taskDataService: TaskDataService,
    private matDialog: MatDialog,
    private baseData4rService: BaseData4rService
  ) {}

  ngOnInit() {
    this.checkDataChanged();
    this.checkDataApproved();
    this.checkDataDeclined();
    this.initFormField();
    this.initTaskWithRoles();
    this.subscribeToRemainVerificationTasks();
    this.baseData4rService.getEditPage().subscribe(editPage => (this.isEditPage = editPage));
  }

  get fieldData(): AggregateDataField {
    return {
      aggregateField: this.aggregateField,
      aggregateName: this.aggregateName,
      dataCluster: this.dataCluster
    };
  }

  private initFormField(): void {
    let validators: ValidatorFn | ValidatorFn[] | FormControlOptions | null = [];
    if (this.maxLength) {
      validators.push(Validators.maxLength(this.maxLength));
    }
    this.parentForm.addControl(
      this.fieldName,
      new UntypedFormControl({ value: this.value, disabled: this.parentForm.disabled }, validators)
    );
  }

  ngOnChanges() {
    this.verificationTaskStatus = VerificationTaskFormStatus.NOT_PRESENT;

    this.checkDataChanged();
    this.checkDataApproved();
    this.checkDataDeclined();
    this.baseData4rService.getEditPage().subscribe(editPage => (this.isEditPage = editPage));
  }

  checkDataChanged() {
    this.isDataChanged = this.dataNotificationChangeFields?.directChange.some(change =>
      this.dataNotificationChangeFieldsInclusion.includes(change)
    );
  }

  private checkDataApproved() {
    this.isDataApproved = this.dataNotificationChangeFields?.approved.some(change =>
      this.dataNotificationChangeFieldsInclusion.includes(change)
    );
  }

  private checkDataDeclined() {
    const addressDeclinedData = this.dataNotificationChangeFields?.declined.find(declinedField =>
      this.dataNotificationChangeFieldsInclusion.includes(declinedField.field)
    );
    this.declinedData = {
      shouldDisplay: !!addressDeclinedData,
      taskId: addressDeclinedData?.taskId
    };
  }

  taskCommentPopup(): void {
    this.taskDataService
      .getById(<number>this.declinedData.taskId)
      .pipe(take(1))
      .subscribe(task => {
        this.matDialog.open(TaskCommentComponent, {
          data: task.comments
        });
      });
  }

  ngOnDestroy() {
    this.baseData4rService.resetServices();
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initTaskWithRoles() {
    this.userService
      .getRoles()
      .pipe(
        take(1),
        switchMap(roles => {
          const isMTR = roles.some(role => MTR_ROLE.includes(role));
          const isBSR = roles.some(role => RETAILER_ROLE.includes(role));
          this.isMarketResponsible = isMTR;
          this.isBusinessSiteResponsible = isBSR;

          if (isMTR || isBSR) {
            this.isVerificationTaskPresent =
              this.baseData4rService.isOpenVerificationTaskByAggregateField(this.aggregateField);
          } else {
            this.isVerificationTaskPresent = of(false);
          }

          return this.featureToggleService.isFeatureEnabled(this.forRetailFeatureToggleName).pipe(
            mergeMap(enabled => (enabled ? this.tasksService.getDataChangeTasks() : of([]))),
            takeUntil(this.unsubscribe)
          );
        })
      )
      .subscribe((tasks: Task[]) => {
        if ((this.isMarketResponsible || this.isBusinessSiteResponsible) && !!tasks) {
          let dataChange = tasks.find(task => task.aggregateField == this.aggregateField);
          this.openDataChange.next(dataChange);
          let taskDiff = dataChange?.diff as TaskDiff | NewTaskDiff;
          if (!!dataChange) {
            this.taskForDisplay.taskId = dataChange.taskId;
            this.taskForDisplay.shouldDisplayFutureValue = true;
            this.futureValue.next(taskDiff?.new);
          } else {
            this.taskForDisplay.shouldDisplayFutureValue = false;
          }
          this.hasChange = taskDiff?.new !== taskDiff?.old;
        }
      });
  }

  subscribeToRemainVerificationTasks(): void {
    this.baseData4rService
      .subscribeToAllCompletedVerificationTasks()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(aggregateFields => {
        if (aggregateFields.includes(this.aggregateField)) {
          const currentValue = this.parentForm.get(this.fieldName)?.value;
          const fieldInitialValue = this.initialValue !== null ? this.initialValue : this.value;
          this.isVerificationTaskPresent.pipe(take(1)).subscribe(taskPresent => {
            if (
              (fieldInitialValue === undefined || fieldInitialValue == null) &&
              currentValue === ''
            ) {
              this.verificationTaskStatus = VerificationTaskFormStatus.REMAIN;
            } else {
              this.verificationTaskStatus =
                fieldInitialValue !== currentValue
                  ? VerificationTaskFormStatus.CHANGED
                  : VerificationTaskFormStatus.REMAIN;
            }
          });
        }
      });
  }

  onKeyUp(event: Event): void {
    this.inputChange.emit(event);
    this.isVerificationTaskPresent.pipe(take(1)).subscribe(taskPresent => {
      if (taskPresent && this.isBusinessSiteResponsible) {
        this.baseData4rService.setCompletedVerificationTasks([this.aggregateField]);
      }
      this.isDataChanged = false;
      this.isDataApproved = false;
      this.declinedData.shouldDisplay = false;
    });
  }

  onKeyDown(value: KeyboardEvent): void {
    if (this.taskForDisplay.shouldDisplayFutureValue && this.isMarketResponsible) {
      value.preventDefault();
      this.textInput.nativeElement.blur();
      this.matDialog.open(CommentsDialogComponent, {
        data: { task: this.taskForDisplay }
      });
    }
  }

  onRemainClick(): void {
    this.isVerificationTaskPresent.pipe(take(1)).subscribe(taskPresent => {
      if (taskPresent && this.isBusinessSiteResponsible) {
        this.baseData4rService.setCompletedVerificationTasks([this.aggregateField]);
      }
    });
  }
}
