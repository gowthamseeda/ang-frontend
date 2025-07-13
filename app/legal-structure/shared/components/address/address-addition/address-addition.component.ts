import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { DataNotificationChangeFields } from '../../../../../notifications/models/notifications.model';
import { AGGREGATE_FIELDS, AGGREGATE_NAMES } from '../../../../../shared/model/constants';
import { AddressType } from '../../../models/address.model';
import { DataCluster } from '../../../../../tasks/task.model';

@Component({
  selector: 'gp-address-addition',
  templateUrl: './address-addition.component.html',
  styleUrls: ['./address-addition.component.scss']
})
export class AddressAdditionComponent implements OnInit {
  @Input()
  parentForm: UntypedFormGroup;
  @Input()
  addressAddition: string;
  @Input()
  addressType: AddressType;

  @Input()
  dataNotificationChangeFields = new DataNotificationChangeFields();
  @Input()
  isRetailOutlet: boolean = false;

  readonly dataField: string = 'addressAddition';

  constructor() {
  }

  ngOnInit(): void {
  }

  get aggregateField() {
    if (this.addressType === AddressType.Main){
      return AGGREGATE_FIELDS.BASE_DATA_ADDRESS_ADDRESS_ADDITION;
    } else {
      return AGGREGATE_FIELDS.BASE_DATA_ADDITIONAL_ADDRESS_ADDRESS_ADDITION;
    }
  }

  get aggregateName() {
    return AGGREGATE_NAMES.BUSINESS_SITE
  }

  get dataCluster() {
    if (this.addressType === AddressType.Main){
      return DataCluster.BASE_DATA_ADDRESS_ADDRESS_ADDITION;
    } else {
      return DataCluster.BASE_DATA_ADDITIONAL_ADDRESS;
    }
  }
}
