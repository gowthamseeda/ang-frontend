import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output
} from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import {
  CommunicationChannel,
  CommunicationChannelsChange
} from '../../model/communication-channel.model';
import { Type, TaskForDisplay } from '../../../tasks/task.model';
import { CommunicationFieldFormat } from '../../model/communication-field-format';
import { CommunicationChannelsValidators } from '../../../shared/validators/communication-channels-validators';
import { MatDialog } from '@angular/material/dialog';
import { TaskDataService } from '../../../tasks/task/store/task-data.service';
import { TaskCommentComponent } from '../../../shared/components/task-comment/task-comment.component';
import { CommunicationChannelsService } from '../../communication-channels.service';

export const DEFAULT_COMMUNICATION_FIELD_UI_FIELD_SIZE = 3;

@Component({
  selector: 'gp-communication-channels',
  templateUrl: './communication-channels.component.html',
  styleUrls: ['./communication-channels.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunicationChannelsComponent implements OnChanges, OnDestroy {
  @Input() communicationChannels: CommunicationChannel[] = [];
  @Input() readOnly: Boolean = false;
  @Output() communicationChannelsChange = new EventEmitter<CommunicationChannelsChange>();
  @Input() taskType: Type;
  @Input() task: TaskForDisplay;
  @Input() showNotification: Boolean = false;
  isPristine = true;
  private unsubscribe = new Subject<void>();
  Type = Type;
  @Input() taskType :string = '';

  communicationChannelsForm: UntypedFormGroup;
  communicationChannelsArray: UntypedFormArray;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private matDialog: MatDialog,
    private taskDataService: TaskDataService,
    private communicationChannelsService: CommunicationChannelsService
  ) {}

  ngOnChanges(): void {
    this.communicationChannelsForm = this.formBuilder.group({
      channels: this.formBuilder.array([])
    });

    this.initCommunicationForm();
    this.communicationChannelsForm.markAllAsTouched();
  }

  ngOnDestroy(): void {
    this.communicationChannelsService.resetServices();
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  get channelsFormArray(): UntypedFormArray {
    return this.communicationChannelsForm?.get('channels') as UntypedFormArray;
  }

  initCommunicationForm(): void {
    this.communicationChannels?.forEach(communicationChannel => {
      this.addChannelToFormArray(communicationChannel);
    });

    this.communicationChannelsForm.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((value: { channels: CommunicationChannel[] }) => {
        this.communicationChannelsChange.emit({
          value: value.channels,
          invalid: this.communicationChannelsForm.invalid
        } as CommunicationChannelsChange);
      });
  }

  isLinkOutAllowed(value: string, format: string): boolean {
    if (!value || !format) {
      return false;
    }

    return format === CommunicationFieldFormat.URL || format === CommunicationFieldFormat.EMAIL;
  }

  openLink(link: string, format: string): void {
    let target = '';

    if (format === CommunicationFieldFormat.EMAIL) {
      link = 'mailto:' + link;
    }

    if (format === CommunicationFieldFormat.URL) {
      // Append http:// to the URL if it does not exists. Angular treats URLs with http or https
      // as URLs of external websites otherwise they are treated as routes
      if (!/^http[s]?:\/\//.test(link)) {
        link = 'http://' + link;
        target = '_blank';
      }
    }

    window.open(link, target);
  }

  getFieldSizeFor(field: any): String {
    return ((field?.uiFieldSize ?? DEFAULT_COMMUNICATION_FIELD_UI_FIELD_SIZE) * 10) + "%";
  }

  private getCommunicationChannelFormGroup(channel: CommunicationChannel): UntypedFormGroup {
    const formGroup = this.formBuilder.group({
      id: channel.id,
      value: channel.value,
      name: channel.name,
      uiFieldSize: channel.uiFieldSize,
      format: channel.format,
      notification: channel.notification,
      taskId: channel.taskId,
      actualValue: channel.value,
      futureValue: channel.newValue
    });

    formGroup.controls['value'].setValidators(this.getValidators(channel.format));
    formGroup.controls['value'].updateValueAndValidity();

    return formGroup;
  }

  private addChannelToFormArray(channel: CommunicationChannel): void {
    this.communicationChannelsArray = this.communicationChannelsForm.get('channels') as UntypedFormArray;
      const formGroup = this.getCommunicationChannelFormGroup(channel);
      this.communicationChannelsArray.push(formGroup);

    formGroup.controls['value'].valueChanges
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(newValue => {
          formGroup.controls['futureValue'].setValue(newValue, { emitEvent: false });
        });

#      if (newValue !== oldValue) {
#        const task = {
#          type: Type.DATA_CHANGE,
#          status: 'OPEN',
#          dataCluster: 'COMMUNICATION_CHANNELS',
#          communicationDataDiff: [
#            {
#              communicationFieldId: channel.id,
#              offeredServiceId: channel.offerServiceId,
#              serviceName: channel.name,
#              diff: {
#                old: oldValue,
#                new: newValue
#              }
#            }
#          ]
#        };
#
#        this.taskDataService.create(task).subscribe();
#      }
#    });
  }

  private getValidators(format?: CommunicationFieldFormat): ValidatorFn[] {
    const validators: ValidatorFn[] = [Validators.maxLength(256)];

    switch (format) {
      case CommunicationFieldFormat.EMAIL:
        validators.push(Validators.email);
        break;
      case CommunicationFieldFormat.TEL:
        validators.push(CommunicationChannelsValidators.telephoneNumberValidator());
        break;
      case CommunicationFieldFormat.URL:
        validators.push(CommunicationChannelsValidators.urlValidator());
        break;
    }

    return validators;
  }

  taskCommentPopup(taskId?: number): void {
    if (taskId != undefined)
      this.taskDataService.getById(taskId)
        .pipe(take(1))
        .subscribe(task => {
            this.matDialog.open(TaskCommentComponent, {
              data: task.comments
            });
          }
        );
  }

  getNotificationClass(channel: AbstractControl): string {
    if (
      channel.value.notification === 'APPROVED' &&
      this.showNotification &&
      channel.get('value')?.pristine
    ) {
      return 'approved-input';
    }
    if (
      channel.value.notification === 'DECLINED' &&
      this.showNotification &&
      channel.get('value')?.pristine
    ) {
      return 'declined-input';
    }
    if (
      channel.value.notification === 'DIRECT_CHANGE' &&
      this.showNotification &&
      channel.get('value')?.pristine
    ) {
      return 'direct-change-input';
    }
    return '';
  }

}