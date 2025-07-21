import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

import { CommunicationChannel } from '../../model/communication-channel.model';

export interface CommunicationChannelsChange {
  invalid: boolean;
  value: CommunicationChannel[];
}

@Component({
  selector: 'gp-communication-channels',
  templateUrl: './communication-channels.component.html',
  styleUrls: ['./communication-channels.component.scss']
})
export class CommunicationChannelsComponent implements OnInit {
  @Input() communicationChannels: CommunicationChannel[] = [];
  @Input() readOnly = false;

  @Output() communicationChannelsChange = new EventEmitter<CommunicationChannelsChange>();

  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      channels: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    const channelsArray = this.form.get('channels') as FormArray;
    channelsArray.clear();

    this.communicationChannels.forEach(channel => {
      const channelGroup = this.formBuilder.group({
        communicationFieldId: [channel.communicationFieldId],
        value: [channel.value]
      });
      channelsArray.push(channelGroup);
    });

    this.form.valueChanges.subscribe(() => {
      this.emitChange();
    });
  }

  private emitChange(): void {
    const formValue = this.form.value;
    const channels: CommunicationChannel[] = formValue.channels.map((channel: any) => ({
      communicationFieldId: channel.communicationFieldId,
      value: channel.value
    }));

    this.communicationChannelsChange.emit({
      invalid: this.form.invalid,
      value: channels
    });
  }

  get channelsFormArray(): FormArray {
    return this.form.get('channels') as FormArray;
  }
}