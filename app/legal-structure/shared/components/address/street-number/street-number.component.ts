import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { DataNotificationChangeFields } from '../../../../../notifications/models/notifications.model';
import { AddressType } from '../../../models/address.model';
import { AGGREGATE_FIELDS, AGGREGATE_NAMES } from '../../../../../shared/model/constants';
import { DataCluster } from '../../../../../tasks/task.model';

@Component({
  selector: 'gp-street-number',
  templateUrl: './street-number.component.html',
  styleUrls: ['./street-number.component.scss']
})
export class StreetNumberComponent implements OnInit {
  @Input()
  parentForm: UntypedFormGroup;
  @Input()
  streetNumber: string;
  @Input()
  addressType: AddressType;
  @Input()
  dataNotificationChangeFields = new DataNotificationChangeFields();
  @Input()
  isRetailOutlet: boolean = false;
  @Output()
  streetNumberChange = new EventEmitter();

  readonly dataField: string = 'streetNumber';

  constructor() {
  }

  ngOnInit(): void {
  }

  formControlChange(): void {
    this.streetNumberChange.emit();
  }

  get aggregateField() {
    if (this.addressType === AddressType.Main){
      return AGGREGATE_FIELDS.BASE_DATA_ADDRESS_NUMBER;
    } else {
      return AGGREGATE_FIELDS.BASE_DATA_ADDITIONAL_ADDRESS_STREET_NUMBER;
    }
  }

  get aggregateName() {
    return AGGREGATE_NAMES.BUSINESS_SITE
  }

  get dataCluster() {
    if (this.addressType === AddressType.Main){
      return DataCluster.BASE_DATA_ADDRESS_NUMBER;
    } else {
      return DataCluster.BASE_DATA_ADDITIONAL_ADDRESS;
    }
  }
}
