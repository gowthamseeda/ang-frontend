import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  Output
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ControlValueAccessor,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  NG_ASYNC_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { Observable, Subject } from 'rxjs';
import { first, map, sample, takeUntil } from 'rxjs/operators';

import { CommunicationChannelsValidators } from '../../../shared/validators/communication-channels-validators';
import {
  CommunicationChannel,
  CommunicationChannelsChange
} from '../../model/communication-channel.model';
import { CommunicationFieldFormat } from '../../model/communication-field-format';
import { SocialMediaChannel } from '../../model/social-media-channel.model';

@Component({
  selector: 'gp-social-media-channels',
  templateUrl: './social-media-channels.component.html',
  styleUrls: ['./social-media-channels.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SocialMediaChannelsComponent),
      multi: true
    },
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => SocialMediaChannelsComponent),
      multi: true
    }
  ]
})
export class SocialMediaChannelsComponent
  implements OnChanges, OnDestroy, ControlValueAccessor, AsyncValidator {
  @Input() socialMediaChannels: SocialMediaChannel[];
  @Input() readOnly = false;
  @Output()
  communicationChannelsChange: EventEmitter<CommunicationChannelsChange> = new EventEmitter<CommunicationChannelsChange>();

  changeTrigger = new Subject<void>();
  selectedSocialMediaChannelsFormGroup: UntypedFormGroup;
  private unsubscribe = new Subject<void>();

  constructor(private formBuilder: UntypedFormBuilder) {}

  ngOnChanges(): void {
    this.initFormGroup();
    this.selectedSocialMediaChannelsFormGroup.markAllAsTouched();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  writeValue(socialMediaChannels: SocialMediaChannel[]): void {
    this.socialMediaChannels = socialMediaChannels;
    this.initFormGroup();
  }

  registerOnChange(fn: any): void {
    this.selectedSocialMediaChannelsFormGroup.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => fn());
  }

  registerOnTouched(fn: any): void {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.selectedSocialMediaChannelsFormGroup.statusChanges.pipe(
      map(status => (status === 'VALID' ? null : { socialMediaChannelsError: true })),
      first()
    );
  }

  registerOnValidatorChange(fn: () => void): void {
    this.selectedSocialMediaChannelsFormGroup.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(fn);
  }

  updateSocialMediaChannelsSelection(
    selectedSocialMediaChannelsEvent: MatButtonToggleChange
  ): void {
    const selectedSocialMediaChannels = selectedSocialMediaChannelsEvent.value as SocialMediaChannel[];
    this.updateSocialMediaChannelsSelectionState(selectedSocialMediaChannels);
    this.initFormGroup();
    this.changeTrigger.next();
  }

  removeSocialMediaChannel(socialMediaChannelId: string): void {
    const foundSocialMediaChannel = this.socialMediaChannels.find(
      socialMediaChannel => socialMediaChannel.id === socialMediaChannelId
    );
    if (foundSocialMediaChannel) {
      foundSocialMediaChannel.selected = false;
    }

    this.removeControlsOfDeselectedSocialMediaChannels();
    this.changeTrigger.next();
  }

  openLink(link: string): void {
    if (!link) {
      return;
    }

    // Append https:// to the URL if it does not exists. Angular treats URLs with http or https
    // as URLs of external websites otherwise they are treated as routes
    if (!/^http[s]?:\/\//.test(link)) {
      link = 'https://' + link;
    }
    window.open(link, '_blank');
  }

  get selectedSocialMediaChannels(): SocialMediaChannel[] {
    if (!this.socialMediaChannels) {
      return [];
    }
    return this.socialMediaChannels.filter(socialMediaChannel => socialMediaChannel.selected);
  }

  private get unselectedSocialMediaChannels(): SocialMediaChannel[] {
    return this.socialMediaChannels.filter(socialMediaChannel => !socialMediaChannel.selected);
  }

  private initFormGroup(): void {
    if (!this.selectedSocialMediaChannelsFormGroup) {
      this.selectedSocialMediaChannelsFormGroup = this.formBuilder.group({});
      this.emitCommunicationChannelsWhenChanged();
    }

    this.removeControlsOfDeselectedSocialMediaChannels();
    this.addControlsForSelectedSocialMediaChannels();

    this.selectedSocialMediaChannelsFormGroup.markAllAsTouched();
  }

  private removeControlsOfDeselectedSocialMediaChannels(): void {
    Object.keys(this.selectedSocialMediaChannelsFormGroup.controls).forEach(
      socialMediaChannelId => {
        const deselectedSocialMediaChannel = this.socialMediaChannels.find(
          socialMediaChannel =>
            socialMediaChannel.id === socialMediaChannelId && !socialMediaChannel.selected
        );
        if (deselectedSocialMediaChannel) {
          this.selectedSocialMediaChannelsFormGroup.removeControl(socialMediaChannelId);
        }
      }
    );
  }

  private addControlsForSelectedSocialMediaChannels(): void {
    this.selectedSocialMediaChannels.forEach(socialMediaChannel => {
      const validators: ValidatorFn[] = [Validators.required, Validators.maxLength(256)];
      if (socialMediaChannel.format && socialMediaChannel.format === CommunicationFieldFormat.URL) {
        validators.push(CommunicationChannelsValidators.urlValidator());
      }
      if (socialMediaChannel.template) {
        validators.push(
          CommunicationChannelsValidators.socialMediaChannelTemplateValidator(
            socialMediaChannel.template
          )
        );
      }

      let value = socialMediaChannel.value ?? '';
      if (!value) {
        value = socialMediaChannel.template ?? '';
      }

      this.selectedSocialMediaChannelsFormGroup.addControl(
        socialMediaChannel.id,
        new UntypedFormControl(value, validators)
      );
    });
  }

  private updateSocialMediaChannelsSelectionState(
    selectedSocialMediaChannels: SocialMediaChannel[]
  ): void {
    this.socialMediaChannels.forEach(socialMediaChannel => {
      const isSelected =
        selectedSocialMediaChannels.find(
          selectedSocialMediaChannel => socialMediaChannel.id === selectedSocialMediaChannel.id
        ) !== undefined;
      socialMediaChannel.selected = isSelected;
    });
  }

  private emitCommunicationChannelsWhenChanged(): void {
    this.selectedSocialMediaChannelsFormGroup.valueChanges
      .pipe(sample(this.changeTrigger), takeUntil(this.unsubscribe))
      .subscribe((socialMediaChannels: { [key: string]: string }) => {
        const emptyCommunicationChannels = this.unselectedSocialMediaChannels.map(
          unselectedSocialMediaChannel =>
            ({ id: unselectedSocialMediaChannel.id, value: '' } as CommunicationChannel)
        );
        const communicationChannels = Object.entries(socialMediaChannels).map(
          ([socialMediaChannelsId, socialMediaChannelsValue]) =>
            ({ id: socialMediaChannelsId, value: socialMediaChannelsValue } as CommunicationChannel)
        );
        const communicationChannelsChange = {
          value: communicationChannels.concat(emptyCommunicationChannels),
          invalid: this.selectedSocialMediaChannelsFormGroup.invalid
        } as CommunicationChannelsChange;

        this.communicationChannelsChange.emit(communicationChannelsChange);
      });
  }
}
