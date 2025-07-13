import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { DataNotificationChangeFields } from '../../../../../notifications/models/notifications.model';
import { AddressType } from '../../../models/address.model';
import { AGGREGATE_FIELDS, AGGREGATE_NAMES } from '../../../../../shared/model/constants';
import { DataCluster } from '../../../../../tasks/task.model';

@Component({
  selector: 'gp-street',
  templateUrl: './street.component.html',
  styleUrls: ['./street.component.scss']
})
export class StreetComponent implements OnInit {
  readonly dataField: string = 'street';
  @Input()
  parentForm: UntypedFormGroup;
  @Input()
  street: string;
  @Input()
  required = false;
  @Input()
  addressType: AddressType;
  @Output()
  streetChange = new EventEmitter();
  @Input()
  dataNotificationChangeFields = new DataNotificationChangeFields();
  @Input()
  isRetailOutlet: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  formControlChange(): void {
    this.streetChange.emit();
  }

  get aggregateField() {
    if (this.addressType === AddressType.Main){
      return AGGREGATE_FIELDS.BASE_DATA_ADDRESS_STREET;
    } else {
      return AGGREGATE_FIELDS.BASE_DATA_ADDITIONAL_ADDRESS_STREET;
    }
  }

  get aggregateName() {
    return AGGREGATE_NAMES.BUSINESS_SITE
  }

  get dataCluster() {
    if (this.addressType === AddressType.Main){
      return DataCluster.BASE_DATA_ADDRESS_STREET;
    } else {
      return DataCluster.BASE_DATA_ADDITIONAL_ADDRESS;
    }
  }
}
