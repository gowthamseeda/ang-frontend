import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { DataNotificationChangeFields } from '../../../../../notifications/models/notifications.model';
import { AddressType } from '../../../models/address.model';
import { AGGREGATE_FIELDS, AGGREGATE_NAMES } from '../../../../../shared/model/constants';
import { DataCluster } from '../../../../../tasks/task.model';

@Component({
  selector: 'gp-district',
  templateUrl: './district.component.html',
  styleUrls: ['./district.component.scss'],
})
export class DistrictComponent implements OnInit {
  readonly dataField: string = 'district';

  @Input()
  parentForm: UntypedFormGroup;
  @Input()
  district: string;
  @Input()
  addressType: AddressType;
  @Input()
  dataNotificationChangeFields = new DataNotificationChangeFields();
  @Input()
  isRetailOutlet: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  get aggregateField() {
    if (this.addressType === AddressType.Main){
      return AGGREGATE_FIELDS.BASE_DATA_ADDRESS_DISTRICT;
    } else {
      return AGGREGATE_FIELDS.BASE_DATA_ADDITIONAL_ADDRESS_DISTRICT;
    }
  }

  get aggregateName() {
    return AGGREGATE_NAMES.BUSINESS_SITE
  }

  get dataCluster() {
    if (this.addressType === AddressType.Main){
      return DataCluster.BASE_DATA_ADDRESS_DISTRICT;
    } else {
      return DataCluster.BASE_DATA_ADDITIONAL_ADDRESS;
    }
  }
}
