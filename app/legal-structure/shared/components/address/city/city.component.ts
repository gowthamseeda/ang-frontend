import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { DataNotificationChangeFields } from '../../../../../notifications/models/notifications.model';
import { AddressType } from '../../../models/address.model';
import { AGGREGATE_FIELDS, AGGREGATE_NAMES } from '../../../../../shared/model/constants';
import { DataCluster } from '../../../../../tasks/task.model';

@Component({
  selector: 'gp-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {
  readonly dataField: string = 'city';

  @Input()
  parentForm: UntypedFormGroup;
  @Input()
  city: string;
  @Input()
  required = false;
  @Input()
  addressType: AddressType;
  @Input()
  dataNotificationChangeFields = new DataNotificationChangeFields();
  @Input()
  isRetailOutlet: boolean = false;

  @Output()
  cityChange = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  formControlChange(): void {
    this.cityChange.emit();
  }

  get aggregateField() {
    if (this.addressType === AddressType.Main){
      return AGGREGATE_FIELDS.BASE_DATA_ADDRESS_CITY;
    } else {
      return AGGREGATE_FIELDS.BASE_DATA_ADDITIONAL_ADDRESS_CITY;
    }
  }

  get aggregateName() {
    return AGGREGATE_NAMES.BUSINESS_SITE
  }

  get dataCluster() {
    if (this.addressType === AddressType.Main){
      return DataCluster.BASE_DATA_ADDRESS_CITY;
    } else {
      return DataCluster.BASE_DATA_ADDITIONAL_ADDRESS;
    }
  }
}
